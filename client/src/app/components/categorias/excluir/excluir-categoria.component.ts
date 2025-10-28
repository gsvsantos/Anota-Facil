import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, map, switchMap, shareReplay, take, Observer } from 'rxjs';
import { CategoriaService } from '../../../services/categoria.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DetalhesCategoriaApiResponse } from '../../../models/categoria.models';

@Component({
  selector: 'af-excluir-categoria.component',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    AsyncPipe,
    FormsModule,
  ],
  templateUrl: './excluir-categoria.component.html',
  styleUrl: './excluir-categoria.component.scss',
})
export class ExcluirCategoria {
  private readonly notificacaoService = inject(NotificacaoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly categoria$ = this.route.data.pipe(
    filter((data) => data['categoria'] as boolean),
    map((data) => data['categoria'] as DetalhesCategoriaApiResponse),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public excluir(): void {
    const exclusaoObserver: Observer<null> = {
      next: () => this.notificacaoService.sucesso(`Registro excluído com sucesso!`, 'OK'),
      error: (err: string) => this.notificacaoService.erro(err, 'OK'),
      complete: () => void this.router.navigate(['/categorias']),
    };

    this.categoria$
      .pipe(
        take(1),
        switchMap((categoria) => this.categoriaService.excluir(categoria.id)),
      )
      .subscribe(exclusaoObserver);
  }
}
