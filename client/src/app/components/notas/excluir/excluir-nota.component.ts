import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificacaoService } from '../../../services/notificacao.service';
import { Observable, filter, map, shareReplay, Observer, take, switchMap } from 'rxjs';
import { DetalhesNotaApiResponse } from '../../../models/nota.models';
import { NotaService } from '../../../services/nota.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-excluir-nota.component',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    AsyncPipe,
    FormsModule,
  ],
  templateUrl: './excluir-nota.component.html',
  styleUrl: './excluir-nota.component.scss',
})
export class ExcluirNota {
  private readonly notificacaoService = inject(NotificacaoService);
  private readonly notaService = inject(NotaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly nota$: Observable<DetalhesNotaApiResponse> = this.route.data.pipe(
    filter((data) => data['nota'] as boolean),
    map((data) => data['nota'] as DetalhesNotaApiResponse),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public excluir(): void {
    const exclusaoObserver: Observer<null> = {
      next: () => this.notificacaoService.sucesso('O registro foi excluído com sucesso!', 'OK'),
      error: (err: HttpErrorResponse) => this.notificacaoService.erro(err.error as string, 'OK'),
      complete: () => void this.router.navigate(['/notas']),
    };

    this.nota$
      .pipe(
        take(1),
        switchMap((nota) => this.notaService.excluir(nota.id)),
      )
      .subscribe(exclusaoObserver);
  }
}
