using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ProductService.Infrastructure.Persistence;

public sealed class ProductDbContextFactory : IDesignTimeDbContextFactory<ProductDbContext>
{
    public ProductDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ProductDbContext>();

        optionsBuilder.UseNpgsql(
            "Host=localhost;Port=5432;Database=jobtask;Username=admin;Password=admin123"
        );

        return new ProductDbContext(optionsBuilder.Options);
    }
}
