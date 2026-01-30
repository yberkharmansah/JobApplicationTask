using MediatR;
using ProductService.Core.Interfaces;
using Shared.Contracts.Errors;

namespace ProductService.Application.Products;

public sealed record DeleteProductCommand(Guid Id) : IRequest;

public sealed class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand>
{
    private readonly IProductRepository _repo;
    private readonly IProductCache _cache;

    public DeleteProductCommandHandler(IProductRepository repo, IProductCache cache)
    {
        _repo = repo;
        _cache = cache;
    }

    public async Task Handle(DeleteProductCommand request, CancellationToken ct)
    {
        var p = await _repo.GetByIdAsync(request.Id, ct);
        if (p is null) throw new AppException("Product not found.", 404);

        await _repo.DeleteAsync(p, ct);
        await _cache.InvalidateProductAsync(request.Id, ct);
        await _cache.InvalidateListAsync(ct);
    }
}