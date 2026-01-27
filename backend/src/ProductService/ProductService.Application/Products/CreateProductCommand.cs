using MediatR;
using ProductService.Core.Entities;
using ProductService.Core.Interfaces;
using Shared.Contracts.Errors;

namespace ProductService.Application.Products;

public sealed record CreateProductCommand(string Name, string Description, decimal Price, string Category, string ImageUrl)
    : IRequest<ProductDto>;

public sealed class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly IProductRepository _repo;
    public CreateProductCommandHandler(IProductRepository repo) => _repo = repo;

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new AppException("Name is required.", 400);

        var p = new Product
        {
            Name = request.Name.Trim(),
            Description = request.Description?.Trim() ?? "",
            Price = request.Price,
            Category = request.Category.Trim(),
            ImageUrl = request.ImageUrl.Trim(),
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        await _repo.AddAsync(p, ct);
        return new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Category, p.ImageUrl);
    }
}
