import { ResolveFn, Routes } from '@angular/router';
import { NotaService } from '../services/nota.service';
import { ListarNotas } from '../components/notas/listar/listar-notas.component';
import { inject } from '@angular/core';
import { ListagemNotasModel } from '../models/nota.models';
import { ListagemCategoriasModel } from '../models/categoria.models';
import { CategoriaService } from '../services/categoria.service';
import { CadastrarNota } from '../components/notas/cadastrar/cadastrar-nota.component';

const listagemNotasResolver: ResolveFn<ListagemNotasModel[]> = () => {
  const notaService = inject(NotaService);
  return notaService.selecionarTodas();
};

const listagemCategoriasResolver: ResolveFn<ListagemCategoriasModel[]> = () => {
  const categoriaService = inject(CategoriaService);
  return categoriaService.selecionarTodas();
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
    ],
    providers: [CategoriaService, NotaService],
  },
];
