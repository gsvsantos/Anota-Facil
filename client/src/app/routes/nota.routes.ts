import { Routes } from '@angular/router';
import { NotaService } from '../services/nota.service';
export const notaRoutes: Routes = [
  {
    path: '',
    children: [
      //   { path: '', component: ListarNotas, resolve: { notas: listagemNotasResolver } },
    ],
    providers: [NotaService],
  },
];
