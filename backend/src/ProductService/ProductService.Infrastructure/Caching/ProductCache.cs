using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using ProductService.Core.Entities;
using ProductService.Core.Interfaces;
using StackExchange.Redis;

namespace ProductService.Infrastructure.Caching;

public sealed class ProductCache : IProductCache
{
    private static readonly DistributedCacheEntryOptions CacheOptions =
        new() { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) };
    private const string ListIndexKey = "products:list:index";

    private readonly IDistributedCache _cache;
    private readonly IConnectionMultiplexer _redis;
    private readonly IDatabase _db;

    public ProductCache(IDistributedCache cache, IConnectionMultiplexer redis)
    {
        _cache = cache;
        _redis = redis;
        _db = _redis.GetDatabase();
    }

    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var payload = await _cache.GetStringAsync(ProductKey(id), ct);
        return payload is null ? null : JsonSerializer.Deserialize<Product>(payload);
    }

    public async Task<List<Product>?> GetListAsync(string? category, decimal? min, decimal? max, string? sort, CancellationToken ct)
    {
        var payload = await _cache.GetStringAsync(ListKey(category, min, max, sort), ct);
        return payload is null ? null : JsonSerializer.Deserialize<List<Product>>(payload);
    }

    public Task SetByIdAsync(Product product, CancellationToken ct)
    {
        var payload = JsonSerializer.Serialize(product);
        return _cache.SetStringAsync(ProductKey(product.Id), payload, CacheOptions, ct);
    }

    public Task SetListAsync(string? category, decimal? min, decimal? max, string? sort, List<Product> products, CancellationToken ct)
    {
        var payload = JsonSerializer.Serialize(products);
        var key = ListKey(category, min, max, sort);
        return Task.WhenAll(
            _cache.SetStringAsync(key, payload, CacheOptions, ct),
            _db.SetAddAsync(ListIndexKey, key)
        );
    }

    public Task InvalidateProductAsync(Guid id, CancellationToken ct)
        => _cache.RemoveAsync(ProductKey(id), ct);

    public async Task InvalidateListAsync(CancellationToken ct)
    {
        var keys = await _db.SetMembersAsync(ListIndexKey);
        if (keys.Length == 0)
        {
            return;
        }

        var removeTasks = keys.Select(key => _cache.RemoveAsync(key.ToString(), ct));
        await Task.WhenAll(removeTasks);
        await _db.KeyDeleteAsync(ListIndexKey);
    }

    private static string ProductKey(Guid id) => $"products:byid:{id}";

    private static string ListKey(string? category, decimal? min, decimal? max, string? sort)
        => $"products:list:cat={category ?? "all"};min={min?.ToString() ?? "any"};max={max?.ToString() ?? "any"};sort={sort ?? "none"}";
}