using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductService.Application.Products;

namespace ProductService.API.Controllers;

[ApiController]
[Route("api/products")]
public sealed class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    public ProductsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public Task<List<ProductDto>> List(
        [FromQuery] string? category,
        [FromQuery] decimal? min,
        [FromQuery] decimal? max,
        [FromQuery] string? sort,
        CancellationToken ct)
        => _mediator.Send(new GetProductsQuery(category, min, max, sort), ct);

    [HttpGet("{id:guid}")]
    public Task<ProductDto> Get(Guid id, CancellationToken ct)
        => _mediator.Send(new GetProductByIdQuery(id), ct);

    [Authorize]
    [HttpPost]
    public Task<ProductDto> Create([FromBody] CreateProductRequest req, CancellationToken ct)
        => _mediator.Send(new CreateProductCommand(req.Name, req.Description, req.Price, req.Category, req.ImageUrl), ct);

    [Authorize]
    [HttpPut("{id:guid}")]
    public Task<ProductDto> Update(Guid id, [FromBody] UpdateProductRequest req, CancellationToken ct)
        => _mediator.Send(new UpdateProductCommand(id, req.Name, req.Description, req.Price, req.Category, req.ImageUrl), ct);

    [Authorize]
    [HttpDelete("{id:guid}")]
    public Task Delete(Guid id, CancellationToken ct)
        => _mediator.Send(new DeleteProductCommand(id), ct);
}
