using AuthService.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Infrastructure.Persistence;

public sealed class AuthDbContext : DbContext
{
    public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(b =>
        {
            b.HasKey(x => x.Id);

            b.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(320);

            b.HasIndex(x => x.Email).IsUnique();

            b.Property(x => x.PasswordHash).IsRequired();
            b.Property(x => x.PasswordSalt).IsRequired();
            b.Property(x => x.CreatedAtUtc).IsRequired();
        });
    }
}
