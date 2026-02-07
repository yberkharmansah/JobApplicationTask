using Microsoft.EntityFrameworkCore;
using ProductService.Core.Entities;

namespace ProductService.Infrastructure.Persistence;

public sealed class ProductDbContext : DbContext
{
    public ProductDbContext(DbContextOptions<ProductDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.Name).IsRequired().HasMaxLength(200);
            b.Property(x => x.Description).IsRequired().HasMaxLength(2000);
            b.Property(x => x.Category).IsRequired().HasMaxLength(100);
            b.Property(x => x.ImageUrl).IsRequired().HasMaxLength(500);
            b.Property(x => x.Price).HasColumnType("numeric(18,2)");
        });
    }
}
