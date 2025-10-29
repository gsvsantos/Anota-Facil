import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { NotaService } from '../services/nota.service';
import { ListarNotas } from '../components/notas/listar/listar-notas.component';
import { inject } from '@angular/core';
import { DetalhesNotaApiResponse, ListagemNotasModel } from '../models/nota.models';
import { ListagemCategoriasModel } from '../models/categoria.models';
import { CategoriaService } from '../services/categoria.service';
import { CadastrarNota } from '../components/notas/cadastrar/cadastrar-nota.component';
import { EditarNota } from '../components/notas/editar/editar-nota.component';

const listagemNotasResolver: ResolveFn<ListagemNotasModel[]> = () => {
  const notaService = inject(NotaService);
  return notaService.selecionarTodas();
};

const listagemCategoriasResolver: ResolveFn<ListagemCategoriasModel[]> = () => {
  const categoriaService = inject(CategoriaService);
  return categoriaService.selecionarTodas();
};

const detalhesNotaResolver: ResolveFn<DetalhesNotaApiResponse> = (
  route: ActivatedRouteSnapshot,
) => {
  const notaService = inject(NotaService);

  if (!route.paramMap.has('id')) throw new Error('O parâmetro "ID" não foi fornecido.');

  const id: string = route.paramMap.get('id')!;

  return notaService.selecionarPorId(id);
};

export const notaRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ListarNotas, resolve: { notas: listagemNotasResolver } },
      {
        path: 'cadastrar',
        component: CadastrarNota,
        resolve: { categorias: listagemCategoriasResolver },
      },
      {
        path: 'editar/:id',
        component: EditarNota,
        resolve: { nota: detalhesNotaResolver, categorias: listagemCategoriasResolver },
      },
    ],
    providers: [CategoriaService, NotaService],
  },
];
