using Cars.Domain;
using Cars.Infrastructure;
using FluentValidation;
using MediatR;

namespace Cars.Application.Cars;

public sealed record CreateCommand(Car Car) : IRequest<Car>;

public sealed class CreateValidator : AbstractValidator<CreateCommand>
{
    public CreateValidator()
    {
        CarRules.Apply(this, command => command.Car);
    }
}

public sealed class CreateHandler(DataContext context) : IRequestHandler<CreateCommand, Car>
{
    public async Task<Car> Handle(CreateCommand request, CancellationToken cancellationToken)
    {
        var car = request.Car;
        if (car.Id == Guid.Empty)
        {
            car.Id = Guid.NewGuid();
        }

        context.Cars.Add(car);
        await context.SaveChangesAsync(cancellationToken);
        return car;
    }
}
