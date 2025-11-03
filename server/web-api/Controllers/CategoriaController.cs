using FluentResults;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NoteKeeper.WebApi.Models;
using NoteKeeper.WebApi.Services.Categorias;

namespace NoteKeeper.WebApi.Controllers;

[ApiController]
[Authorize]
[Route("categorias")]
public class CategoriaController(CategoriaAppService categoriaService) : Controller
{
    [HttpPost]
    public async Task<ActionResult<CadastrarCategoriaResponse>> Cadastrar(
          CadastrarCategoriaRequest request,
          CancellationToken cancellationToken
      )
    {
        CadastrarCategoriaCommand command = new(request.Titulo);

        Result<CadastrarCategoriaResult> result = await categoriaService.InserirAsync(command, cancellationToken);

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

        CadastrarCategoriaResponse response = new(result.Value.Id);

        return Created(string.Empty, response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<EditarCategoriaResponse>> Editar(Guid id, EditarCategoriaRequest request, CancellationToken cancellationToken)
    {
        EditarCategoriaCommand command = new(id, request.Titulo);

        Result<EditarCategoriaResult> result = await categoriaService.EditarAsync(command, cancellationToken);

        if (result.IsFailed)
        {
            return BadRequest();
        }

        EditarCategoriaResponse response = new(result.Value.Titulo);

        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Excluir(Guid id, CancellationToken cancellationToken)
    {
        ExcluirCategoriaCommand command = new(id);

        Result result = await categoriaService.ExcluirAsync(command, cancellationToken);

        if (result.IsFailed)
        {
            return BadRequest();
        }

        return NoContent();
    }

    [HttpGet]
    public async Task<ActionResult<SelecionarCategoriasResponse>> SelecionarRegistros(
        [FromQuery] SelecionarCategoriasRequest? request,
        CancellationToken cancellationToken
    )
    {
        SelecionarCategoriasQuery query = new();

        Result<SelecionarCategoriasResult> result = await categoriaService.SelecionarTodosAsync(query, cancellationToken);

        if (result.IsFailed)
        {
            return BadRequest();
        }

        SelecionarCategoriasResponse response = new(result.Value.Registros);

        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SelecionarCategoriaPorIdResponse>> SelecionarRegistroPorId(Guid id, CancellationToken cancellationToken)
    {
        SelecionarCategoriaPorIdQuery query = new(id);

        Result<SelecionarCategoriaPorIdResult> result = await categoriaService.SelecionarPorIdAsync(query, cancellationToken);

        if (result.IsFailed)
        {
            return NotFound(id);
        }

        SelecionarCategoriaPorIdResponse response = new(result.Value.Id, result.Value.Titulo);

        return Ok(response);
    }
}
