import { ResolveFn, Routes } from '@angular/router';
import { NotaService } from '../services/nota.service';
import { ListarNotas } from '../components/notas/listar/listar-notas.component';
import { inject } from '@angular/core';
import { ListagemNotasModel } from '../models/nota.models';

const listagemNotasResolver: ResolveFn<ListagemNotasModel[]> = () => {
  const notaService = inject(NotaService);
  return notaService.selecionarTodas();
};

export const notaRoutes: Routes = [
  {
    path: '',
    children: [{ path: '', component: ListarNotas, resolve: { notas: listagemNotasResolver } }],
    providers: [NotaService],
  },
];
