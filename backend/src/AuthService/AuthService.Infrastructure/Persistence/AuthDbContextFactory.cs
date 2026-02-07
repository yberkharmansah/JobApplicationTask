using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace AuthService.Infrastructure.Persistence;

public sealed class AuthDbContextFactory : IDesignTimeDbContextFactory<AuthDbContext>
{
    public AuthDbContext CreateDbContext(string[] args)
    {
        // EF Tools çalışırken çalışma dizini genelde startup projenin klasörü olur.
        // Bu yüzden appsettings.Development.json'u API projesinden okuyacağız.
        var basePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "AuthService.API");

        var config = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connStr = config.GetConnectionString("AuthDb");

        var optionsBuilder = new DbContextOptionsBuilder<AuthDbContext>();
        optionsBuilder.UseNpgsql(connStr);

        return new AuthDbContext(optionsBuilder.Options);
    }
}
