namespace Cars.API.DTOs;

public sealed record UserDto(
    string Id,
    string UserName,
    string Email,
    string Token,
    IReadOnlyCollection<string> Roles);
