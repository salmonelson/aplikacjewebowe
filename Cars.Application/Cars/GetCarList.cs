using Cars.Domain;
using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public sealed record GetCarListQuery : IRequest<IReadOnlyList<Car>>;

public sealed class GetCarListHandler(DataContext context) : IRequestHandler<GetCarListQuery, IReadOnlyList<Car>>
{
    public async Task<IReadOnlyList<Car>> Handle(
        GetCarListQuery request,
        CancellationToken cancellationToken)
    {
        return await context.Cars.AsNoTracking().ToListAsync(cancellationToken);
    }
}
