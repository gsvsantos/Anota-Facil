using FluentResults;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using NoteKeeper.WebApi.Domain;
using NoteKeeper.WebApi.Domain.Auth;
using NoteKeeper.WebApi.Orm;
using System.Collections.Immutable;

namespace NoteKeeper.WebApi.Services.Categorias;

public class CategoriaAppService(
    AppDbContext dbContext,
    ITenantProvider tenantProvider,
    IValidator<BaseCategoriaCommand> validator,
    ILogger<CategoriaAppService> logger
)
{
    public async Task<Result<CadastrarCategoriaResult>> InserirAsync(
        CadastrarCategoriaCommand command,
        CancellationToken cancellationToken
    )
    {
        FluentValidation.Results.ValidationResult resultadoValidacao = await validator.ValidateAsync(command, cancellationToken);

        if (!resultadoValidacao.IsValid)
        {
            List<string> erros = resultadoValidacao.Errors
                .Select(failure => failure.ErrorMessage)
                .ToList();

            return Result.Fail(ResultadosErro.RequisicaoInvalidaErro(erros));
        }

        if (dbContext.Categorias.Any(c => c.Titulo.Equals(command.Titulo)))
            return Result.Fail(ResultadosErro.RegistroDuplicadoErro($"Já existe uma categoria com o título \"{command.Titulo}\""));

        Categoria categoria = new(command.Titulo);
        categoria.UsuarioId = tenantProvider.UsuarioId.GetValueOrDefault();

        try
        {
            await dbContext.Categorias.AddAsync(categoria, cancellationToken);

            await dbContext.SaveChangesAsync(cancellationToken);

            CadastrarCategoriaResult result = new(categoria.Id);

            return Result.Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Ocorreu um erro durante o cadastro de {@Registro}.",
                command
            );

            return Result.Fail(ResultadosErro.ExcecaoInternaErro(ex));
        }
    }

    public async Task<Result<EditarCategoriaResult>> EditarAsync(
        EditarCategoriaCommand command,
        CancellationToken cancellationToken
    )
    {
        FluentValidation.Results.ValidationResult resultadoValidacao = await validator.ValidateAsync(command, cancellationToken);

        if (!resultadoValidacao.IsValid)
        {
            List<string> erros = resultadoValidacao.Errors
                .Select(failure => failure.ErrorMessage)
                .ToList();

            return Result.Fail(ResultadosErro.RequisicaoInvalidaErro(erros));
        }

        if (dbContext.Categorias.Any(c => !c.Id.Equals(command.Id) && c.Titulo.Equals(command.Titulo)))
            return Result.Fail(ResultadosErro.RegistroDuplicadoErro($"Já existe uma categoria com o título \"{command.Titulo}\""));

        Categoria? categoriaSelecionada = await dbContext.Categorias
            .FirstOrDefaultAsync(x => x.Id.Equals(command.Id), cancellationToken);

        if (categoriaSelecionada is null)
            return Result.Fail(ResultadosErro.RegistroNaoEncontradoErro(command.Id));

        try
        {
            categoriaSelecionada.Titulo = command.Titulo;

            await dbContext.SaveChangesAsync(cancellationToken);

            EditarCategoriaResult result = new(categoriaSelecionada.Titulo);

            return Result.Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Ocorreu um erro durante a edição de {@Registro}.",
                command
            );

            return Result.Fail(ResultadosErro.ExcecaoInternaErro(ex));
        }
    }

    public async Task<Result> ExcluirAsync(
        ExcluirCategoriaCommand command,
        CancellationToken cancellationToken
    )
    {
        Categoria? categoriaSelecionada = await dbContext.Categorias
            .FirstOrDefaultAsync(x => x.Id.Equals(command.Id), cancellationToken);

        if (categoriaSelecionada is null)
            return Result.Fail($"Categoria {command.Id} não encontrada");

        dbContext.Remove(categoriaSelecionada);

        await dbContext.SaveChangesAsync(cancellationToken);

        return Result.Ok();
    }

    public async Task<Result<SelecionarCategoriasResult>> SelecionarTodosAsync(SelecionarCategoriasQuery command, CancellationToken cancellationToken)
    {
        List<Categoria> categoriasSelecionadas = await dbContext.Categorias.ToListAsync(cancellationToken);

        SelecionarCategoriasResult result = new(
            categoriasSelecionadas.Select(c => new CategoriaDto(c.Id, c.Titulo)).ToImmutableList()
        );

        return Result.Ok(result);
    }

    public async Task<Result<SelecionarCategoriaPorIdResult>> SelecionarPorIdAsync(SelecionarCategoriaPorIdQuery command, CancellationToken cancellationToken)
    {
        Categoria? categoriaSelecionada = await dbContext.Categorias
            .FirstOrDefaultAsync(x => x.Id.Equals(command.Id), cancellationToken);

        if (categoriaSelecionada is null)
            return Result.Fail($"Categoria {command.Id} não encontrada");

        SelecionarCategoriaPorIdResult result = new(categoriaSelecionada.Id, categoriaSelecionada.Titulo);

        return Result.Ok(result);
    }
}
