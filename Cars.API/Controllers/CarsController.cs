using Cars.Application.Cars;
using Cars.Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Cars.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Car>>> GetCars(CancellationToken cancellationToken)
    {
        return Ok(await sender.Send(new GetCarListQuery(), cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Car>> GetCar(Guid id, CancellationToken cancellationToken)
    {
        var car = await sender.Send(new DetailsQuery(id), cancellationToken);
        return car is null ? NotFound() : Ok(car);
    }

    [HttpPost]
    public async Task<ActionResult<Car>> CreateCar(
        Car car,
        CancellationToken cancellationToken)
    {
        try
        {
            var createdCar = await sender.Send(new CreateCommand(car), cancellationToken);
            return CreatedAtAction(nameof(GetCar), new { id = createdCar.Id }, createdCar);
        }
        catch (ValidationException exception)
        {
            return BadRequest(ToValidationErrors(exception));
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCar(
        Guid id,
        Car car,
        CancellationToken cancellationToken)
    {
        try
        {
            return await sender.Send(new EditCommand(id, car), cancellationToken)
                ? NoContent()
                : NotFound();
        }
        catch (ValidationException exception)
        {
            return BadRequest(ToValidationErrors(exception));
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCar(Guid id, CancellationToken cancellationToken)
    {
        return await sender.Send(new DeleteCommand(id), cancellationToken)
            ? NoContent()
            : NotFound();
    }

    private static IDictionary<string, string[]> ToValidationErrors(ValidationException exception)
    {
        return exception.Errors
            .GroupBy(error => error.PropertyName)
            .ToDictionary(
                group => group.Key,
                group => group.Select(error => error.ErrorMessage).ToArray());
    }
}
