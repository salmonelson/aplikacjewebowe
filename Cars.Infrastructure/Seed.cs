using Cars.Domain;

namespace Cars.Infrastructure;

public static class Seed
{
    public static void SeedData(DataContext context)
    {
        if (context.Cars.Any())
        {
            return;
        }

        context.Cars.AddRange(
            new Car
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Brand = "Toyota",
                Model = "Corolla",
                DoorsNumber = 5,
                LuggageCapacity = 361,
                EngineCapacity = 1.8m,
                FuelType = "Hybrid",
                ProductionDate = new DateTime(2022, 6, 1),
                AverageFuelConsumption = 4.5m,
                BodyType = "Hatchback"
            },
            new Car
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Brand = "Ford",
                Model = "Mustang",
                DoorsNumber = 2,
                LuggageCapacity = 408,
                EngineCapacity = 5.0m,
                FuelType = "Petrol",
                ProductionDate = new DateTime(2021, 4, 15),
                AverageFuelConsumption = 12.1m,
                BodyType = "Coupe"
            },
            new Car
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Brand = "Skoda",
                Model = "Octavia",
                DoorsNumber = 5,
                LuggageCapacity = 600,
                EngineCapacity = 2.0m,
                FuelType = "Diesel",
                ProductionDate = new DateTime(2020, 9, 20),
                AverageFuelConsumption = 5.2m,
                BodyType = "Combi"
            });

        context.SaveChanges();
    }
}
