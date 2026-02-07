namespace Shared.Contracts.Errors;

public sealed record ErrorResponse(string Message, string? Detail = null);
