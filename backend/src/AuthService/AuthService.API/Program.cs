using AuthService.API.Middlewares;
using AuthService.Application.Auth;
using AuthService.Core.Interfaces;
using AuthService.Infrastructure.Persistence;
using AuthService.Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// DbContext
builder.Services.AddDbContext<AuthDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("AuthDb")));

// Repos
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Jwt options + service
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

// MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(RegisterCommand).Assembly));

// Middleware
builder.Services.AddScoped<GlobalExceptionMiddleware>();

// Hash/JWT funcs (Onion bağımlılığını “ince” tutmak için)
builder.Services.AddScoped<Func<string, (byte[] hash, byte[] salt)>>(_ => PasswordHasher.Hash);
builder.Services.AddScoped<Func<string, byte[], byte[], bool>>(_ => PasswordHasher.Verify);
builder.Services.AddScoped<Func<AuthService.Core.Entities.User, string>>(sp =>
{
    var jwt = sp.GetRequiredService<IJwtTokenService>();
    return user => jwt.CreateToken(user);
});

var app = builder.Build();
app.Lifetime.ApplicationStarted.Register(() =>
{
    var firstUrl = app.Urls.FirstOrDefault() ?? "http://localhost";
    app.Logger.LogInformation("✅ AuthService started. Swagger: {SwaggerUrl}", $"{firstUrl}/swagger");
});




app.UseSerilogRequestLogging();
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseCors("Frontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseAuthorization();
app.MapControllers();
app.Run();