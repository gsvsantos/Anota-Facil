using FluentResults;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using NoteKeeper.WebApi.Domain;
using NoteKeeper.WebApi.Domain.Auth;
using NoteKeeper.WebApi.Orm;
using NoteKeeper.WebApi.Services.Categorias;
using System.Collections.Immutable;

namespace NoteKeeper.WebApi.Services.Notas;

public class NotaAppService(
    AppDbContext dbContext,
    ITenantProvider tenantProvider,
    IValidator<BaseNotaCommand> validator,
    ILogger<NotaAppService> logger
)
{
    public async Task<Result<CadastrarNotaResult>> InserirAsync(
        CadastrarNotaCommand command,
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

        if (dbContext.Notas.Any(c => c.Titulo.Equals(command.Titulo)))
            return Result.Fail(ResultadosErro.RegistroDuplicadoErro($"Já existe uma nota com o título \"{command.Titulo}\""));

        Nota nota = new(command.Titulo, command.Conteudo, command.CategoriaId);
        nota.UsuarioId = tenantProvider.UsuarioId.GetValueOrDefault();

        try
        {
            await dbContext.Notas.AddAsync(nota, cancellationToken);

            await dbContext.SaveChangesAsync(cancellationToken);

            CadastrarNotaResult result = new(nota.Id);

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

    public async Task<Result<EditarNotaResult>> EditarAsync(
        EditarNotaCommand command,
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

        if (dbContext.Notas.Any(c => !c.Id.Equals(command.Id) && c.Titulo.Equals(command.Titulo)))
            return Result.Fail(ResultadosErro.RegistroDuplicadoErro($"Já existe uma nota com o título \"{command.Titulo}\""));

        Nota? notaSelecionada = await dbContext.Notas
            .Include(x => x.Categoria)
            .FirstOrDefaultAsync(x => x.Id.Equals(command.Id), cancellationToken);

        if (notaSelecionada is null)
            return Result.Fail(ResultadosErro.RegistroNaoEncontradoErro(command.Id));

        try
        {
            notaSelecionada.Titulo = command.Titulo;
            notaSelecionada.Conteudo = command.Conteudo;
            notaSelecionada.CategoriaId = command.CategoriaId;

            await dbContext.SaveChangesAsync(cancellationToken);

            EditarNotaResult result = new(notaSelecionada.Titulo, notaSelecionada.Conteudo, notaSelecionada.CategoriaId);

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
        ExcluirNotaCommand command,
        CancellationToken cancellationToken
    )
    {
        Nota? NotaSelecionada = await dbContext.Notas
            .FirstOrDefaultAsync(x => x.Id.Equals(command.Id), cancellationToken);

        if (NotaSelecionada is null)
            return Result.Fail($"Nota {command.Id} não encontrada");

        dbContext.Remove(NotaSelecionada);

        await dbContext.SaveChangesAsync(cancellationToken);

        return Result.Ok();
    }

    public async Task<Result<SelecionarNotasResult>> SelecionarTodosAsync(SelecionarNotasQuery command, CancellationToken cancellationToken)
    {
        List<Nota> notasSelecionadas = await dbContext.Notas.Include(x => x.Categoria).ToListAsync(cancellationToken);

        SelecionarNotasResult result = new(
            notasSelecionadas.Select(c => new NotaDto(c.Id, c.Titulo, c.Conteudo, c.Categoria!.Titulo)).ToImmutableList()
        );

        return Result.Ok(result);
    }

    public async Task<Result<SelecionarNotaPorIdResult>> SelecionarPorIdAsync(SelecionarNotaPorIdQuery command, CancellationToken cancellationToken)
    {
        Nota? notaSelecionada = await dbContext.Notas
            .Include(x => x.Categoria)
            .FirstOrDefaultAsync(x => x.Id.Equals(command.Id), cancellationToken);

        if (notaSelecionada is null)
            return Result.Fail($"Nota {command.Id} não encontrada");

        SelecionarNotaPorIdResult result = new(
            notaSelecionada.Id,
            notaSelecionada.Titulo,
            notaSelecionada.Conteudo,
            new CategoriaDto(notaSelecionada.Categoria!.Id, notaSelecionada.Categoria.Titulo)
        );

        return Result.Ok(result);
    }
}
