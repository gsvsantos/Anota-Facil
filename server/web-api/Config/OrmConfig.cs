using Microsoft.EntityFrameworkCore;
using NoteKeeper.WebApi.Orm;

namespace NoteKeeper.WebApi.Config;

public static class OrmConfig
{
    public static IServiceCollection AddCamadaInfraestruturaOrm(this IServiceCollection services, IConfiguration configuration)
    {
        string? connectionString = configuration["SQL_CONNECTION_STRING"];

        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connectionString, opt => opt.EnableRetryOnFailure(3)));

        return services;
    }
}
