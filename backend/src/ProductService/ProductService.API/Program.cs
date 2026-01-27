using System.Text;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProductService.API.Middlewares;
using ProductService.Application.Products;
using ProductService.Core.Interfaces;
using ProductService.Infrastructure.Persistence;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
builder.Services.AddDbContext<ProductDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("ProductDb")));

// Repo
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// MediatR (handlers ProductService.Application assembly'sinde)
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(ProductDto).Assembly));

// JWT AuthN/AuthZ
var jwtSection = builder.Configuration.GetSection("Jwt");
var issuer = jwtSection["Issuer"]!;
var audience = jwtSection["Audience"]!;
var key = jwtSection["Key"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });

builder.Services.AddAuthorization();

// Global exception middleware
builder.Services.AddScoped<GlobalExceptionMiddleware>();

var app = builder.Build();

// Startup log (tek satır)
app.Lifetime.ApplicationStarted.Register(() =>
{
    var firstUrl = app.Urls.FirstOrDefault() ?? "http://localhost";
    app.Logger.LogInformation("✅ ProductService started. Swagger: {SwaggerUrl}", $"{firstUrl}/swagger");
});

app.UseSerilogRequestLogging();
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
