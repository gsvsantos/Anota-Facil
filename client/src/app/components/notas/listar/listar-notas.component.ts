import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { ListagemNotasModel } from '../../../models/nota.models';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardHeader,
  MatCardContent,
  MatCardActions,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-listar-notas.component',
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
    MatChipsModule,
  ],
  templateUrl: './listar-notas.component.html',
  styleUrl: './listar-notas.component.scss',
})
export class ListarNotas {
  protected readonly route = inject(ActivatedRoute);

  protected readonly notas$ = this.route.data.pipe(
    filter((data) => data['notas'] as boolean),
    map((data) => data['notas'] as ListagemNotasModel[]),
  );
}
