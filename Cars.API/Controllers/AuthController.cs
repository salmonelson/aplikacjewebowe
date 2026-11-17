using Cars.API.DTOs;
using Cars.API.Services;
using Cars.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace Cars.API.Controllers;

[ApiController]
[Route("api/account")]
public sealed class AuthController(
    UserManager<AppUser> userManager,
    ITokenService tokenService,
    IEmailService emailService,
    IConfiguration configuration) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto dto)
    {
        var user = new AppUser
        {
            UserName = dto.UserName.Trim(),
            Email = dto.Email.Trim()
        };
        var result = await userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(error => error.Description));
        }

        await userManager.AddToRoleAsync(user, "User");
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
        var confirmationUrl =
            $"{configuration["Client:BaseUrl"]}/confirm-email" +
            $"?userId={Uri.EscapeDataString(user.Id)}" +
            $"&token={Uri.EscapeDataString(encodedToken)}";
        await emailService.SendAsync(
            user.Email!,
            "Potwierdź konto Cars",
            $"<h2>Cars</h2><p><a href=\"{confirmationUrl}\">Potwierdź adres e-mail</a></p>");
        return Ok(new { message = "Konto utworzono. Sprawdź e-mail i potwierdź rejestrację." });
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromQuery] ConfirmEmailDto request)
    {
        var user = await userManager.FindByIdAsync(request.UserId);
        if (user is null) return BadRequest("Nieprawidłowy użytkownik.");
        string decodedToken;
        try
        {
            decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Token));
        }
        catch (FormatException)
        {
            return BadRequest("Nieprawidłowy token.");
        }
        var result = await userManager.ConfirmEmailAsync(user, decodedToken);
        return result.Succeeded
            ? Ok(new { message = "Adres e-mail został potwierdzony." })
            : BadRequest("Nie udało się potwierdzić konta.");
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email.Trim());
        if (user is null || !await userManager.CheckPasswordAsync(user, dto.Password))
            return Unauthorized("Nieprawidłowy e-mail lub hasło.");
        if (!await userManager.IsEmailConfirmedAsync(user))
            return Unauthorized("Adres e-mail nie został potwierdzony.");

        var roles = (await userManager.GetRolesAsync(user)).ToArray();
        return Ok(new UserDto(
            user.Id, user.UserName!, user.Email!,
            await tokenService.CreateTokenAsync(user), roles));
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult> ForgotPassword(ForgotPasswordDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email.Trim());
        if (user is not null && user.EmailConfirmed)
        {
            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var resetUrl =
                $"{configuration["Client:BaseUrl"]}/reset-password" +
                $"?email={Uri.EscapeDataString(user.Email!)}" +
                $"&token={Uri.EscapeDataString(encodedToken)}";
            await emailService.SendAsync(
                user.Email!,
                "Reset hasła Cars",
                $"<h2>Cars</h2><p><a href=\"{resetUrl}\">Ustaw nowe hasło</a></p>");
        }
        return Ok(new { message = "Jeżeli konto istnieje, wysłaliśmy wiadomość z instrukcją." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email.Trim());
        if (user is null) return BadRequest("Nie udało się zresetować hasła.");
        string decodedToken;
        try
        {
            decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Token));
        }
        catch (FormatException)
        {
            return BadRequest("Nieprawidłowy token.");
        }
        var result = await userManager.ResetPasswordAsync(user, decodedToken, dto.NewPassword);
        return result.Succeeded
            ? Ok(new { message = "Hasło zostało zmienione." })
            : BadRequest(result.Errors.Select(error => error.Description));
    }
}
