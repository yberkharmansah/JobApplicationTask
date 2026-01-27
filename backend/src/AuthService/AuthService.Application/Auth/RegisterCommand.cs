using AuthService.Core.Entities;
using AuthService.Core.Interfaces;
using MediatR;
using Shared.Contracts.Errors;

namespace AuthService.Application.Auth;

public sealed record RegisterCommand(string Email, string Password) : IRequest<AuthResponse>;

public sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly IUserRepository _users;
    private readonly Func<string, (byte[] hash, byte[] salt)> _hashFunc;
    private readonly Func<User, string> _tokenFunc;

    public RegisterCommandHandler(
        IUserRepository users,
        Func<string, (byte[] hash, byte[] salt)> hashFunc,
        Func<User, string> tokenFunc)
    {
        _users = users;
        _hashFunc = hashFunc;
        _tokenFunc = tokenFunc;
    }

    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLower();
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(request.Password))
            throw new AppException("Email and password are required.", 400);

        var existing = await _users.GetByEmailAsync(email, ct);
        if (existing is not null)
            throw new AppException("Email already exists.", 409);

        var (hash, salt) = _hashFunc(request.Password);

        var user = new User
        {
            Email = email,
            PasswordHash = hash,
            PasswordSalt = salt
        };

        await _users.AddAsync(user, ct);

        var token = _tokenFunc(user);
        return new AuthResponse(token, user.Email);
    }
}
