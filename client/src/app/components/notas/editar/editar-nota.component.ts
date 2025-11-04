import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, map, Observer, shareReplay, switchMap, take, tap } from 'rxjs';
import { ListagemCategoriasModel } from '../../../models/categoria.models';
import { NotaService } from '../../../services/nota.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import {
  DetalhesNotaApiResponse,
  EditarNotaApiResponse,
  EditarNotaModel,
} from '../../../models/nota.models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'af-editar-nota.component',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './editar-nota.component.html',
  styleUrl: './editar-nota.component.scss',
})
export class EditarNota {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly notaService = inject(NotaService);
  protected readonly notificacaoService = inject(NotificacaoService);

  protected formGroup: FormGroup = this.formBuilder.group({
    titulo: ['', [Validators.required.bind(this), Validators.minLength(3)]],
    conteudo: [''],
    categoriaId: ['', [Validators.required.bind(this)]],
  });

  public get titulo(): AbstractControl<unknown, unknown, unknown> | null {
    return this.formGroup.get('titulo');
  }

  public get conteudo(): AbstractControl<unknown, unknown, unknown> | null {
    return this.formGroup.get('conteudo');
  }

  public get categoriaId(): AbstractControl<unknown, unknown, unknown> | null {
    return this.formGroup.get('categoriaId');
  }

  protected readonly categorias$ = this.route.data.pipe(
    filter((data) => data['categorias'] as boolean),
    map((data) => data['categorias'] as ListagemCategoriasModel[]),
  );

  protected readonly nota$ = this.route.data.pipe(
    filter((data) => data['nota'] as boolean),
    map((data) => data['nota'] as DetalhesNotaApiResponse),
    tap((nota) => this.formGroup.patchValue({ ...nota, categoriaId: nota.categoria.id })),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public editar(): void {
    if (this.formGroup.invalid) return;

    const editarNotaModel: EditarNotaModel = this.formGroup.value as EditarNotaModel;

    const edicaoObserver: Observer<EditarNotaApiResponse> = {
      next: () =>
        this.notificacaoService.sucesso(
          `O registro "${editarNotaModel.titulo}" foi editado com sucesso!`,
          'OK',
        ),
      error: (err: HttpErrorResponse) => this.notificacaoService.erro(err.error as string, 'OK'),
      complete: () => void this.router.navigate(['/notas']),
    };

    this.nota$
      .pipe(
        take(1),
        switchMap((nota) => this.notaService.editar(nota.id, editarNotaModel)),
      )
      .subscribe(edicaoObserver);
  }
}
