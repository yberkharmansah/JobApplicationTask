using MediatR;
using ProductService.Core.Interfaces;
using Shared.Contracts.Errors;

namespace ProductService.Application.Products;

public sealed record GetProductByIdQuery(Guid Id) : IRequest<ProductDto>;

public sealed class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IProductRepository _repo;
    private readonly IProductCache _cache;

    public GetProductByIdQueryHandler(IProductRepository repo, IProductCache cache)
    {
        _repo = repo;
        _cache = cache;
    }

    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken ct)
    {
        var cached = await _cache.GetByIdAsync(request.Id, ct);
        if (cached is not null)
        {
            return new ProductDto(cached.Id, cached.Name, cached.Description, cached.Price, cached.Category, cached.ImageUrl);
        }

        var p = await _repo.GetByIdAsync(request.Id, ct);
        if (p is null) throw new AppException("Product not found.", 404);

        await _cache.SetByIdAsync(p, ct);
        return new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Category, p.ImageUrl);
    }
}