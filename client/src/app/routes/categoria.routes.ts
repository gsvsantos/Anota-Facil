import { CategoriaService } from './../services/categoria.service';
import { EditarCategoria } from './../components/categorias/editar/editar-categoria.component';
import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { ListarCategorias } from '../components/categorias/listar/listar-categorias.component';
import { CadastrarCategoria } from '../components/categorias/cadastrar/cadastrar-categoria.component';
import { ExcluirCategoria } from '../components/categorias/excluir/excluir-categoria.component';
import { DetalhesCategoriaApiResponse, ListagemCategoriasModel } from '../models/categoria.models';
import { inject } from '@angular/core';

const listagemCategoriasResolver: ResolveFn<ListagemCategoriasModel[]> = () => {
  const categoriaService = inject(CategoriaService);
  return categoriaService.selecionarTodas();
};

const detalhesCategoriaResolver: ResolveFn<DetalhesCategoriaApiResponse> = (
  route: ActivatedRouteSnapshot,
) => {
  const categoriaService = inject(CategoriaService);

  if (!route.paramMap.has('id')) throw new Error('O parâmetro "ID" não foi fornecido.');

  const id: string = route.paramMap.get('id')!;

  return categoriaService.selecionarPorId(id);
};

export const categoriaRoutes: Routes = [
  { path: '', component: ListarCategorias, resolve: { categorias: listagemCategoriasResolver } },
  { path: 'cadastrar', component: CadastrarCategoria },
  {
    path: 'editar/:id',
    component: EditarCategoria,
    resolve: { categoria: detalhesCategoriaResolver },
  },
  {
    path: 'excluir/:id',
    component: ExcluirCategoria,
    resolve: { categoria: detalhesCategoriaResolver },
  },
];
