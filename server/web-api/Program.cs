using FluentValidation;
using Microsoft.EntityFrameworkCore;
using NoteKeeper.WebApi.Config;
using NoteKeeper.WebApi.Orm;
using NoteKeeper.WebApi.Services.Categorias;
using NoteKeeper.WebApi.Services.Notas;

namespace NoteKeeper.WebApi;

public class Program
{
    public static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        // Injeção de Dependências
        builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

        builder.Services.AddScoped<CategoriaAppService>();
        builder.Services.AddScoped<NotaAppService>();

        builder.Services
            .AddCamadaInfraestruturaOrm(builder.Configuration);

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        WebApplication app = builder.Build();

        // Migrações do EntityFramework
        if (app.Environment.IsDevelopment())
        {
            IServiceScope scope = app.Services.CreateScope();

            AppDbContext dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            dbContext.Database.Migrate();
        }

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseCors(policy =>
            {
                policy
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
