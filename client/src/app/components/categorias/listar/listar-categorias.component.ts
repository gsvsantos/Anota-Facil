import { ListagemCategoriasModel } from './../../../models/categoria.models';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatCard,
  MatCardHeader,
  MatCardContent,
  MatCardActions,
  MatCardTitle,
} from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'af-listar-categorias',
  imports: [
    MatButtonModule,
    AsyncPipe,
    MatIcon,
    RouterLink,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardTitle,
  ],
  templateUrl: './listar-categorias.component.html',
  styleUrl: './listar-categorias.component.scss',
})
export class ListarCategorias {
  protected readonly route = inject(ActivatedRoute);

  protected readonly categorias$ = this.route.data.pipe(
    filter((data) => data['categorias'] as boolean),
    map((data) => data['categorias'] as ListagemCategoriasModel[]),
  );
}
