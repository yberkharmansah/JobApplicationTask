using MediatR;
using ProductService.Core.Interfaces;

namespace ProductService.Application.Products;

public sealed record GetProductsQuery(string? Category, decimal? Min, decimal? Max, string? Sort)
    : IRequest<List<ProductDto>>;

public sealed class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, List<ProductDto>>
{
    private readonly IProductRepository _repo;
    public GetProductsQueryHandler(IProductRepository repo) => _repo = repo;

    public async Task<List<ProductDto>> Handle(GetProductsQuery request, CancellationToken ct)
    {
        var list = await _repo.GetListAsync(request.Category, request.Min, request.Max, request.Sort, ct);
        return list.Select(p => new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Category, p.ImageUrl)).ToList();
    }
}
