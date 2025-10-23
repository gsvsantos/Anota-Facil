import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CategoriaService } from '../../../services/categoria.service';
import { MatIcon } from '@angular/material/icon';
import {
  MatCard,
  MatCardHeader,
  MatCardContent,
  MatCardActions,
  MatCardTitle,
} from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-categorias',
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
  templateUrl: './listar-categorias.html',
  styleUrl: './listar-categorias.scss',
})
export class ListarCategorias {
  protected readonly categoriaService = inject(CategoriaService);

  protected readonly categorias$ = this.categoriaService.selecionarTodas();
}
