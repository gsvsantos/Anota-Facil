import {
  EditarCategoriaApiResponse,
  EditarCategoriaModel,
} from './../../../models/categoria.models';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaService } from '../../../services/categoria.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { filter, map, Observer, shareReplay, switchMap, take, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'af-editar-categoria.component',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './editar-categoria.component.html',
  styleUrl: './editar-categoria.component.scss',
})
export class EditarCategoria {
  private readonly notificacaoService = inject(NotificacaoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected formGroup: FormGroup = this.formBuilder.group({
    titulo: ['', [Validators.required.bind(this), Validators.minLength(3)]],
  });

  protected readonly categoria$ = this.route.paramMap.pipe(
    filter((params) => params.has('id')),
    map((params) => params.get('id')!),
    switchMap((id) => this.categoriaService.selecionarPorId(id)),
    tap((categoria) => this.formGroup.patchValue(categoria)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public get titulo(): AbstractControl<unknown, unknown, unknown> | null {
    return this.formGroup.get('titulo' as const);
  }

  public editar(): void {
    if (this.formGroup.invalid) return;

    const editarCategoriaModel: EditarCategoriaModel = this.formGroup.value as EditarCategoriaModel;

    const edicaoObserver: Observer<EditarCategoriaApiResponse> = {
      next: () =>
        this.notificacaoService.sucesso(
          `Registro "${editarCategoriaModel.titulo}" foi editado com sucesso!`,
          'OK',
        ),
      error: (err: string) => this.notificacaoService.erro(err, 'OK'),
      complete: () => void this.router.navigate(['/categorias']),
    };

    this.categoria$
      .pipe(
        take(1),
        switchMap((categoria) => this.categoriaService.editar(categoria.id, editarCategoriaModel)),
      )
      .subscribe(edicaoObserver);
  }
}
