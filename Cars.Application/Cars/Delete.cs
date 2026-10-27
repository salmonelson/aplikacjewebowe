using Cars.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Cars.Application.Cars;

public sealed record DeleteCommand(Guid Id) : IRequest<bool>;

public sealed class DeleteHandler(DataContext context) : IRequestHandler<DeleteCommand, bool>
{
    public async Task<bool> Handle(DeleteCommand request, CancellationToken cancellationToken)
    {
        var car = await context.Cars.FirstOrDefaultAsync(
            item => item.Id == request.Id,
            cancellationToken);
        if (car is null)
        {
            return false;
        }

        context.Cars.Remove(car);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
