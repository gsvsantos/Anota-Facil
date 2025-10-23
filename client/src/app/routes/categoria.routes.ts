import { Routes } from '@angular/router';
import { ListarCategorias } from '../components/categorias/listar/listar-categorias';
import { CadastrarCategoria } from '../components/categorias/cadastrar/cadastrar-categoria';

export const categoriaRoutes: Routes = [
  { path: '', component: ListarCategorias },
  { path: 'cadastrar', component: CadastrarCategoria },
];
