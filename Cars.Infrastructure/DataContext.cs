using Cars.Domain;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure;

public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    public DbSet<Car> Cars => Set<Car>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Car>(entity =>
        {
            entity.HasKey(car => car.Id);
            entity.Property(car => car.Brand).IsRequired().HasMaxLength(100);
            entity.Property(car => car.Model).IsRequired().HasMaxLength(100);
            entity.Property(car => car.FuelType).IsRequired().HasMaxLength(50);
            entity.Property(car => car.BodyType).IsRequired().HasMaxLength(50);
            entity.Property(car => car.EngineCapacity).HasPrecision(5, 2);
            entity.Property(car => car.AverageFuelConsumption).HasPrecision(5, 2);
        });
    }
}
