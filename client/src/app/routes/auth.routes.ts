import { Routes } from '@angular/router';
import { Registro } from '../components/auth/registro/registro.component';
import { Login } from '../components/auth/login/login.component';

export const authRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: Login },
      { path: 'registro', component: Registro },
    ],
  },
];
