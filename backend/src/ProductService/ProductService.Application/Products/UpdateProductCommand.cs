using MediatR;
using ProductService.Core.Interfaces;
using Shared.Contracts.Errors;

namespace ProductService.Application.Products;

public sealed record UpdateProductCommand(Guid Id, string Name, string Description, decimal Price, string Category, string ImageUrl)
    : IRequest<ProductDto>;

public sealed class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ProductDto>
{
    private readonly IProductRepository _repo;
    private readonly IProductCache _cache;

    public UpdateProductCommandHandler(IProductRepository repo, IProductCache cache)
    {
        _repo = repo;
        _cache = cache;
    }

    public async Task<ProductDto> Handle(UpdateProductCommand request, CancellationToken ct)
    {
        var p = await _repo.GetByIdAsync(request.Id, ct);
        if (p is null) throw new AppException("Product not found.", 404);

        p.Name = request.Name.Trim();
        p.Description = request.Description?.Trim() ?? "";
        p.Price = request.Price;
        p.Category = request.Category.Trim();
        p.ImageUrl = request.ImageUrl.Trim();
        p.UpdatedAtUtc = DateTime.UtcNow;

        await _repo.UpdateAsync(p, ct);
        await _cache.SetByIdAsync(p, ct);
        await _cache.InvalidateListAsync(ct);
        return new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Category, p.ImageUrl);
    }
}