namespace Cars.API.DTOs;

public sealed record ResetPasswordDto(
    string Email,
    string Token,
    string NewPassword);
