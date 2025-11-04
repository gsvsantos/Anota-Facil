using FluentValidation;
using Microsoft.EntityFrameworkCore;
using NoteKeeper.WebApi.Config;
using NoteKeeper.WebApi.Orm;
using NoteKeeper.WebApi.Services.Auth;
using NoteKeeper.WebApi.Services.Categorias;
using NoteKeeper.WebApi.Services.Notas;

namespace NoteKeeper.WebApi;

public class Program
{
    public static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        // Injeção de Dependências
        builder.Services.AddIdentityProviderConfig(builder.Configuration);

        builder.Services.AddScoped<CategoriaAppService>();
        builder.Services.AddScoped<NotaAppService>();
        builder.Services.AddScoped<AutenticacaoAppService>();

        builder.Services.AddCamadaInfraestruturaOrm(builder.Configuration);

        builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

        builder.Services.AddSwaggerConfig();

        builder.Services.ConfigureOptions<CorsConfig>().AddCors();

        builder.Services.AddControllers();

        WebApplication app = builder.Build();

        IServiceScope scope = app.Services.CreateScope();

        AppDbContext dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        dbContext.Database.Migrate();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
