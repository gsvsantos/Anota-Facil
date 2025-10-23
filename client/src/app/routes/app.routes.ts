import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    loadComponent: () =>
      import('../components/inicio/inicio.component').then((component) => component.Inicio),
  },
  {
    path: 'categorias',
    loadChildren: () => import('../routes/categoria.routes').then((route) => route.categoriaRoutes),
  },
];
