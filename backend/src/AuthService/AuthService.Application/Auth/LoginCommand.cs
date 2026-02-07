using AuthService.Core.Interfaces;
using MediatR;
using Shared.Contracts.Errors;

namespace AuthService.Application.Auth;

public sealed record LoginCommand(string Email, string Password) : IRequest<AuthResult>;

public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResult>
{
    private readonly IUserRepository _users;
    private readonly Func<string, byte[], byte[], bool> _verifyFunc;
    private readonly Func<AuthService.Core.Entities.User, string> _tokenFunc;
    private readonly Func<string> _refreshTokenFunc;

    public LoginCommandHandler(
        IUserRepository users,
        Func<string, byte[], byte[], bool> verifyFunc,
        Func<AuthService.Core.Entities.User, string> tokenFunc,
        Func<string> refreshTokenFunc)
    {
        _users = users;
        _verifyFunc = verifyFunc;
        _tokenFunc = tokenFunc;
        _refreshTokenFunc = refreshTokenFunc;
    }

    public async Task<AuthResult> Handle(LoginCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLower();
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(request.Password))
            throw new AppException("Email and password are required.", 400);
        var user = await _users.GetByEmailAsync(email, ct);
        if (user is null)
            throw new AppException("Invalid credentials.", 401);

        var ok = _verifyFunc(request.Password, user.PasswordHash, user.PasswordSalt);
        if (!ok)
            throw new AppException("Invalid credentials.", 401);

        var token = _tokenFunc(user);
        user.RefreshToken = _refreshTokenFunc();
        user.RefreshTokenExpiresUtc = DateTime.UtcNow.AddDays(7);
        await _users.UpdateAsync(user, ct);
        return new AuthResult(token, user.Email, user.Role, user.RefreshToken);
    }
}