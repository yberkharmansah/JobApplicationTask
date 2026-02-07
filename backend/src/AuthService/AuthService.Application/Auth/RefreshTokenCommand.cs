using AuthService.Core.Interfaces;
using MediatR;
using Shared.Contracts.Errors;

namespace AuthService.Application.Auth;

public sealed record RefreshTokenCommand(string RefreshToken) : IRequest<AuthResult>;

public sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResult>
{
    private readonly IUserRepository _users;
    private readonly Func<AuthService.Core.Entities.User, string> _tokenFunc;
    private readonly Func<string> _refreshTokenFunc;

    public RefreshTokenCommandHandler(
        IUserRepository users,
        Func<AuthService.Core.Entities.User, string> tokenFunc,
        Func<string> refreshTokenFunc)
    {
        _users = users;
        _tokenFunc = tokenFunc;
        _refreshTokenFunc = refreshTokenFunc;
    }

    public async Task<AuthResult> Handle(RefreshTokenCommand request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
            throw new AppException("Refresh token is required.", 400);

        var user = await _users.GetByRefreshTokenAsync(request.RefreshToken, ct);
        if (user is null || user.RefreshTokenExpiresUtc is null || user.RefreshTokenExpiresUtc <= DateTime.UtcNow)
            throw new AppException("Refresh token is invalid or expired.", 401);

        var token = _tokenFunc(user);
        user.RefreshToken = _refreshTokenFunc();
        user.RefreshTokenExpiresUtc = DateTime.UtcNow.AddDays(7);
        await _users.UpdateAsync(user, ct);

        return new AuthResult(token, user.Email, user.Role, user.RefreshToken);
    }
}