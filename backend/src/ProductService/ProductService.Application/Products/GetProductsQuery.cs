using MediatR;
using ProductService.Core.Interfaces;

namespace ProductService.Application.Products;

public sealed record GetProductsQuery(string? Category, decimal? Min, decimal? Max, string? Sort)
    : IRequest<List<ProductDto>>;

public sealed class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, List<ProductDto>>
{
    private readonly IProductRepository _repo;
    private readonly IProductCache _cache;

    public GetProductsQueryHandler(IProductRepository repo, IProductCache cache)
    {
        _repo = repo;
        _cache = cache;
    }

    public async Task<List<ProductDto>> Handle(GetProductsQuery request, CancellationToken ct)
    {
        var cached = await _cache.GetListAsync(request.Category, request.Min, request.Max, request.Sort, ct);
        if (cached is not null)
        {
            return cached.Select(p => new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Category, p.ImageUrl)).ToList();
        }

        var list = await _repo.GetListAsync(request.Category, request.Min, request.Max, request.Sort, ct);
        await _cache.SetListAsync(request.Category, request.Min, request.Max, request.Sort, list, ct);
        return list.Select(p => new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Category, p.ImageUrl)).ToList();
    }
}