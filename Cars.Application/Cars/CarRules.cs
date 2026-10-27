using Cars.Domain;
using FluentValidation;
using System.Linq.Expressions;

namespace Cars.Application.Cars;

internal static class CarRules
{
    public static void Apply<T>(
        AbstractValidator<T> validator,
        Expression<Func<T, Car>> carSelector)
    {
        validator.RuleFor(carSelector).ChildRules(car =>
        {
            car.RuleFor(item => item.Brand).NotEmpty();
            car.RuleFor(item => item.Model).NotEmpty();
            car.RuleFor(item => item.DoorsNumber).InclusiveBetween(2, 5);
            car.RuleFor(item => item.LuggageCapacity).GreaterThanOrEqualTo(0);
            car.RuleFor(item => item.EngineCapacity).GreaterThan(0);
            car.RuleFor(item => item.ProductionDate).LessThanOrEqualTo(DateTime.UtcNow);
            car.RuleFor(item => item.AverageFuelConsumption).GreaterThan(0);
        });
    }
}
