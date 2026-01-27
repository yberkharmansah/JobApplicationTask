namespace ProductService.Application.Products;

public sealed record ProductDto(Guid Id, string Name, string Description, decimal Price, string Category, string ImageUrl);

public sealed record CreateProductRequest(string Name, string Description, decimal Price, string Category, string ImageUrl);
public sealed record UpdateProductRequest(string Name, string Description, decimal Price, string Category, string ImageUrl);
