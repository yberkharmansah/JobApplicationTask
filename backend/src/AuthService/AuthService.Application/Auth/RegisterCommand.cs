using AuthService.Core.Entities;
using AuthService.Core.Interfaces;
using MediatR;
using Shared.Contracts.Errors;

namespace AuthService.Application.Auth;

public sealed record RegisterCommand(string Email, string Password) : IRequest<AuthResult>;

public sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResult>
{
    private readonly IUserRepository _users;
    private readonly Func<string, (byte[] hash, byte[] salt)> _hashFunc;
    private readonly Func<User, string> _tokenFunc;
    private readonly Func<string> _refreshTokenFunc;
    private readonly Func<string, bool> _isAdminEmail;

    public RegisterCommandHandler(
        IUserRepository users,
        Func<string, (byte[] hash, byte[] salt)> hashFunc,
        Func<User, string> tokenFunc,
        Func<string> refreshTokenFunc,
        Func<string, bool> isAdminEmail)
    {
        _users = users;
        _hashFunc = hashFunc;
        _tokenFunc = tokenFunc;
        _refreshTokenFunc = refreshTokenFunc;
        _isAdminEmail = isAdminEmail;
    }

    public async Task<AuthResult> Handle(RegisterCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLower();
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(request.Password))
            throw new AppException("Email and password are required.", 400);
        if (!IsValidEmail(email))
            throw new AppException("Email format is invalid.", 400);
        if (!IsValidEmailLength(email))
            throw new AppException("Email must be between 5 and 100 characters.", 400);
        if (!IsValidPassword(request.Password))
            throw new AppException("Password must be 5-25 characters and include at least one letter and one number.", 400);

        var existing = await _users.GetByEmailAsync(email, ct);
        if (existing is not null)
            throw new AppException("Email already exists.", 409);

        var (hash, salt) = _hashFunc(request.Password);

        var user = new User
        {
            Email = email,
            PasswordHash = hash,
            PasswordSalt = salt,
            Role = _isAdminEmail(email) ? "Admin" : "User",
            RefreshToken = _refreshTokenFunc(),
            RefreshTokenExpiresUtc = DateTime.UtcNow.AddDays(7)
        };

        await _users.AddAsync(user, ct);

        var token = _tokenFunc(user);
        return new AuthResult(token, user.Email, user.Role, user.RefreshToken);
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    private static bool IsValidPassword(string password)
    {
        if (password.Length is < 5 or > 25) return false;
        var hasLetter = password.Any(char.IsLetter);
        var hasDigit = password.Any(char.IsDigit);
        return hasLetter && hasDigit;
    }

    private static bool IsValidEmailLength(string email)
        => email.Length is >= 5 and <= 100;
}