using FluentResults;
using Microsoft.AspNetCore.Mvc;
using NoteKeeper.WebApi.Models;
using NoteKeeper.WebApi.Services.Notas;

namespace NoteKeeper.WebApi.Controllers;

[ApiController]
[Route("notas")]
public class NotaController(NotaAppService notaService) : Controller
{
    [HttpPost]
    public async Task<ActionResult<CadastrarNotaResponse>> Cadastrar(
        CadastrarNotaRequest request,
        CancellationToken cancellationToken
    )
    {
        CadastrarNotaCommand command = new(request.Titulo, request.Conteudo, request.CategoriaId);

        Result<CadastrarNotaResult> result = await notaService.InserirAsync(command, cancellationToken);

        if (result.IsFailed)
        {
            if (result.HasError(e => e.HasMetadataKey("TipoErro")))
            {
                IEnumerable<string> errosDeValidacao = result.Errors
                    .SelectMany(e => e.Reasons.OfType<IError>())
                    .Select(e => e.Message);

                return BadRequest(errosDeValidacao);
            }

            return StatusCode(StatusCodes.Status500InternalServerError);
        }

        CadastrarNotaResponse response = new(result.Value.Id);

        return Created(string.Empty, response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<EditarNotaResponse>> Editar(Guid id, EditarNotaRequest request, CancellationToken cancellationToken)
    {
        EditarNotaCommand command = new(id, request.Titulo, request.Conteudo, request.CategoriaId);

        Result<EditarNotaResult> result = await notaService.EditarAsync(command, cancellationToken);

        if (result.IsFailed)
            return BadRequest();

        EditarNotaResponse response = new(result.Value.Titulo, result.Value.Conteudo, result.Value.CategoriaId);

        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Excluir(Guid id, CancellationToken cancellationToken)
    {
        ExcluirNotaCommand command = new(id);

        Result result = await notaService.ExcluirAsync(command, cancellationToken);

        if (result.IsFailed)
            return BadRequest();

        return NoContent();
    }

    [HttpGet]
    public async Task<ActionResult<SelecionarNotasResponse>> SelecionarRegistros(
        [FromQuery] SelecionarNotasRequest? request,
        CancellationToken cancellationToken
    )
    {
        SelecionarNotasQuery query = new();

        Result<SelecionarNotasResult> result = await notaService.SelecionarTodosAsync(query, cancellationToken);

        if (result.IsFailed)
            return BadRequest();

        SelecionarNotasResponse response = new(result.Value.Registros);

        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SelecionarNotaPorIdResponse>> SelecionarRegistroPorId(Guid id, CancellationToken cancellationToken)
    {
        SelecionarNotaPorIdQuery query = new(id);

        Result<SelecionarNotaPorIdResult> result = await notaService.SelecionarPorIdAsync(query, cancellationToken);

        if (result.IsFailed)
            return NotFound(id);

        SelecionarNotaPorIdResponse response = new(
            result.Value.Id,
            result.Value.Titulo,
            result.Value.Conteudo,
            result.Value.Categoria
        );

        return Ok(response);
    }
}
