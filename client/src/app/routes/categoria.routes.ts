import { EditarCategoria } from './../components/categorias/editar/editar-categoria.component';
import { Routes } from '@angular/router';
import { ListarCategorias } from '../components/categorias/listar/listar-categorias.component';
import { CadastrarCategoria } from '../components/categorias/cadastrar/cadastrar-categoria.component';
import { ExcluirCategoria } from '../components/categorias/excluir/excluir-categoria.component';

export const categoriaRoutes: Routes = [
  { path: '', component: ListarCategorias },
  { path: 'cadastrar', component: CadastrarCategoria },
  { path: 'editar/:id', component: EditarCategoria },
  { path: 'excluir/:id', component: ExcluirCategoria },
];
