using Microsoft.IdentityModel.Tokens;
using NoteKeeper.WebApi.Domain.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NoteKeeper.WebApi.Services.Auth;

public class AccessTokenProvider
{
    private readonly string audienciaValida;
    private readonly string chaveAssinaturaJwt;
    private readonly DateTime expiracaoJwt;

    public AccessTokenProvider(IConfiguration config)
    {
        if (string.IsNullOrEmpty(config["JWT_GENERATION_KEY"]))
        {
            throw new ArgumentException("Cifra de geração de tokens não configurada");
        }

        this.chaveAssinaturaJwt = config["JWT_GENERATION_KEY"]!;

        if (string.IsNullOrEmpty(config["JWT_AUDIENCE_DOMAIN"]))
        {
            throw new ArgumentException("Audiência válida para transmissão de tokens não configurada");
        }

        this.audienciaValida = config["JWT_AUDIENCE_DOMAIN"]!;

        this.expiracaoJwt = DateTime.UtcNow.AddMinutes(5);
    }

    public AccessToken GerarAccessToken(Usuario usuario)
    {
        JwtSecurityTokenHandler tokenHandler = new();

        byte[] chaveEmBytes = Encoding.ASCII.GetBytes(this.chaveAssinaturaJwt!);

        SecurityTokenDescriptor tokenDescriptor = new()
        {
            Issuer = "NoteKeeper",
            Audience = this.audienciaValida,
            Subject = new ClaimsIdentity(
            [
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, usuario.UserName!),
                new Claim(JwtRegisteredClaimNames.Email, usuario.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, usuario.AccessTokenVersionId.ToString())
            ]),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(chaveEmBytes),
                SecurityAlgorithms.HmacSha256Signature
            ),
            Expires = this.expiracaoJwt
        };

        SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

        string tokenString = tokenHandler.WriteToken(token);

        return new AccessToken(
            tokenString,
            this.expiracaoJwt,
             new UsuarioAutenticado(
                usuario.Id,
                usuario.FullName ?? string.Empty,
                usuario.Email ?? string.Empty
            )
        );
    }
}