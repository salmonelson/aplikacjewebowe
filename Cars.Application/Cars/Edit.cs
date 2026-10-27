using Cars.Domain;
using Cars.Infrastructure;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public sealed record EditCommand(Guid Id, Car Car) : IRequest<bool>;

public sealed class EditValidator : AbstractValidator<EditCommand>
{
    public EditValidator()
    {
        CarRules.Apply(this, command => command.Car);
    }
}

public sealed class EditHandler(DataContext context) : IRequestHandler<EditCommand, bool>
{
    public async Task<bool> Handle(EditCommand request, CancellationToken cancellationToken)
    {
        var existingCar = await context.Cars.FirstOrDefaultAsync(
            car => car.Id == request.Id,
            cancellationToken);
        if (existingCar is null)
        {
            return false;
        }

        existingCar.Brand = request.Car.Brand;
        existingCar.Model = request.Car.Model;
        existingCar.DoorsNumber = request.Car.DoorsNumber;
        existingCar.LuggageCapacity = request.Car.LuggageCapacity;
        existingCar.EngineCapacity = request.Car.EngineCapacity;
        existingCar.FuelType = request.Car.FuelType;
        existingCar.ProductionDate = request.Car.ProductionDate;
        existingCar.AverageFuelConsumption = request.Car.AverageFuelConsumption;
        existingCar.BodyType = request.Car.BodyType;

        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
