using MediatR;
using ProductService.Core.Interfaces;
using Shared.Contracts.Errors;

namespace ProductService.Application.Products;

public sealed record GetProductByIdQuery(Guid Id) : IRequest<ProductDto>;

public sealed class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto>
{
    private readonly IProductRepository _repo;
    public GetProductByIdQueryHandler(IProductRepository repo) => _repo = repo;

    public async Task<ProductDto> Handle(GetProductByIdQuery request, CancellationToken ct)
    {
        var p = await _repo.GetByIdAsync(request.Id, ct);
        if (p is null) throw new AppException("Product not found.", 404);

        return new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Category, p.ImageUrl);
    }
}
