using AuthService.Core.Interfaces;
using MediatR;
using Shared.Contracts.Errors;

namespace AuthService.Application.Auth;

public sealed record LoginCommand(string Email, string Password) : IRequest<AuthResponse>;

public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
{
    private readonly IUserRepository _users;
    private readonly Func<string, byte[], byte[], bool> _verifyFunc;
    private readonly Func<AuthService.Core.Entities.User, string> _tokenFunc;

    public LoginCommandHandler(
        IUserRepository users,
        Func<string, byte[], byte[], bool> verifyFunc,
        Func<AuthService.Core.Entities.User, string> tokenFunc)
    {
        _users = users;
        _verifyFunc = verifyFunc;
        _tokenFunc = tokenFunc;
    }

    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLower();
        var user = await _users.GetByEmailAsync(email, ct);
        if (user is null)
            throw new AppException("Invalid credentials.", 401);

        var ok = _verifyFunc(request.Password, user.PasswordHash, user.PasswordSalt);
        if (!ok)
            throw new AppException("Invalid credentials.", 401);

        var token = _tokenFunc(user);
        return new AuthResponse(token, user.Email);
    }
}
