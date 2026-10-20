using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cars.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cars",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Brand = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Model = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    DoorsNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    LuggageCapacity = table.Column<int>(type: "INTEGER", nullable: false),
                    EngineCapacity = table.Column<decimal>(type: "TEXT", precision: 5, scale: 2, nullable: false),
                    FuelType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    ProductionDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AverageFuelConsumption = table.Column<decimal>(type: "TEXT", precision: 5, scale: 2, nullable: false),
                    BodyType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cars", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cars");
        }
    }
}
