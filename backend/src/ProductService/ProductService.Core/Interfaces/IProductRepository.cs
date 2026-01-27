using ProductService.Core.Entities;

namespace ProductService.Core.Interfaces;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<List<Product>> GetListAsync(string? category, decimal? min, decimal? max, string? sort, CancellationToken ct);

    Task AddAsync(Product product, CancellationToken ct);
    Task UpdateAsync(Product product, CancellationToken ct);
    Task DeleteAsync(Product product, CancellationToken ct);
}
