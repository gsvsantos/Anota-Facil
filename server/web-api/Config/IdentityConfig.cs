using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using NoteKeeper.WebApi.Domain.Auth;
using NoteKeeper.WebApi.Orm;
using NoteKeeper.WebApi.Services.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NoteKeeper.WebApi.Config;

public static class IdentityConfig
{
    public static void AddIdentityProviderConfig(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ITenantProvider, IdentityTenantProvider>();
        services.AddScoped<AccessTokenProvider>();

        services.AddIdentity<Usuario, Cargo>(options =>
        {
            options.User.RequireUniqueEmail = true;
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 6;
        })
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();

        services.AddJwtAuthentication(configuration);
    }

    private static void AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        string? chaveAssinaturaJwt = configuration["JWT_GENERATION_KEY"];

        if (chaveAssinaturaJwt is null)
        {
            throw new ArgumentException("Não foi possível obter a chave de assinatura de tokens.");
        }

        byte[] chaveEmBytes = Encoding.ASCII.GetBytes(chaveAssinaturaJwt);

        string? audienciaValida = configuration["JWT_AUDIENCE_DOMAIN"];

        if (audienciaValida is null)
        {
            throw new ArgumentException("Não foi possível obter o domínio da audiência dos tokens.");
        }

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = true;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(chaveEmBytes),
                ValidAudience = audienciaValida,
                ValidIssuer = "NoteKeeper",
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateLifetime = true
            };

            options.Events = new JwtBearerEvents
            {
                OnTokenValidated = async context =>
                {
                    UserManager<Usuario> userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<Usuario>>();
                    string? userId = context.Principal!.FindFirstValue(JwtRegisteredClaimNames.Sub)
                                ?? context.Principal!.FindFirstValue(ClaimTypes.NameIdentifier);

                    if (!Guid.TryParse(userId, out Guid uid))
                    {
                        context.Fail("ID de Usuário inválido.");
                        return;
                    }

                    Usuario? user = await userManager.FindByIdAsync(uid.ToString());

                    if (user is null)
                    {
                        context.Fail("Usuário não encontrado");

                        return;
                    }

                    string? verClaim = context.Principal?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;

                    if (!Guid.TryParse(verClaim, out Guid tokenVer) || !tokenVer.Equals(user.AccessTokenVersionId))
                    {
                        context.Fail("Token de acesso revogado.");
                    }

                },

                OnChallenge = ctx => { return Task.CompletedTask; }
            };
        });
    }
}