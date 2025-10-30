import { Routes } from '@angular/router';
import { usuarioAutenticadoGuard } from '../guards/usuario-autenticado.guard';
import { usuarioDesconhecidoGuard } from '../guards/usuario-desconhecido.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('../routes/auth.routes').then((route) => route.authRoutes),
    canActivate: [usuarioDesconhecidoGuard],
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('../components/inicio/inicio.component').then((component) => component.Inicio),
    canActivate: [usuarioAutenticadoGuard],
  },
  {
    path: 'categorias',
    loadChildren: () => import('../routes/categoria.routes').then((route) => route.categoriaRoutes),
    canActivate: [usuarioAutenticadoGuard],
  },
  {
    path: 'notas',
    loadChildren: () => import('../routes/nota.routes').then((route) => route.notaRoutes),
    canActivate: [usuarioAutenticadoGuard],
  },
];
