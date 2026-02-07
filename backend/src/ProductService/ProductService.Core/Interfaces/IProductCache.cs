using ProductService.Core.Entities;

namespace ProductService.Core.Interfaces;

public interface IProductCache
{
    Task<Product?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<List<Product>?> GetListAsync(string? category, decimal? min, decimal? max, string? sort, CancellationToken ct);

    Task SetByIdAsync(Product product, CancellationToken ct);
    Task SetListAsync(string? category, decimal? min, decimal? max, string? sort, List<Product> products, CancellationToken ct);

    Task InvalidateProductAsync(Guid id, CancellationToken ct);
    Task InvalidateListAsync(CancellationToken ct);
}