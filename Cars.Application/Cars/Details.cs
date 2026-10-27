using Cars.Domain;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public sealed record DetailsQuery(Guid Id) : IRequest<Car?>;

public sealed class DetailsHandler(DataContext context) : IRequestHandler<DetailsQuery, Car?>
{
    public Task<Car?> Handle(DetailsQuery request, CancellationToken cancellationToken)
    {
        return context.Cars.AsNoTracking().FirstOrDefaultAsync(
            car => car.Id == request.Id,
            cancellationToken);
    }
}
