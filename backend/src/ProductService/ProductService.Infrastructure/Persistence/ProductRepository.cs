using Microsoft.EntityFrameworkCore;
using ProductService.Core.Entities;
using ProductService.Core.Interfaces;

namespace ProductService.Infrastructure.Persistence;

public sealed class ProductRepository : IProductRepository
{
    private readonly ProductDbContext _db;
    public ProductRepository(ProductDbContext db) => _db = db;

    public Task<Product?> GetByIdAsync(Guid id, CancellationToken ct)
        => _db.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<List<Product>> GetListAsync(string? category, decimal? min, decimal? max, string? sort, CancellationToken ct)
    {
        IQueryable<Product> q = _db.Products.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(category)) q = q.Where(x => x.Category == category);
        if (min.HasValue) q = q.Where(x => x.Price >= min.Value);
        if (max.HasValue) q = q.Where(x => x.Price <= max.Value);

        q = (sort?.ToLower()) switch
        {
            "price_asc" => q.OrderBy(x => x.Price),
            "price_desc" => q.OrderByDescending(x => x.Price),
            _ => q.OrderByDescending(x => x.UpdatedAtUtc)
        };

        return await q.ToListAsync(ct);
    }

    public async Task AddAsync(Product product, CancellationToken ct)
    {
        await _db.Products.AddAsync(product, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Product product, CancellationToken ct)
    {
        _db.Products.Update(product);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Product product, CancellationToken ct)
    {
        _db.Products.Remove(product);
        await _db.SaveChangesAsync(ct);
    }
}
