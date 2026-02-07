namespace AuthService.Application.Auth;

public sealed record RegisterRequest(string Email, string Password);
public sealed record LoginRequest(string Email, string Password);

public sealed record AuthResponse(string Token, string Email, string Role);
public sealed record AuthResult(string Token, string Email, string Role, string RefreshToken);