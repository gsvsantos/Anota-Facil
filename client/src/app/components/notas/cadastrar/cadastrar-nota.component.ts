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
import { CategoriaService } from '../../../services/categoria.service';
import { NotaService } from '../../../services/nota.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { filter, map, Observer } from 'rxjs';
import { ListagemCategoriasModel } from '../../../models/categoria.models';
import { CadastrarNotaApiResponse, CadastrarNotaModel } from '../../../models/nota.models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'af-cadastrar-nota.component',
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
  templateUrl: './cadastrar-nota.component.html',
  styleUrl: './cadastrar-nota.component.scss',
})
export class CadastrarNota {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly categoriaService = inject(CategoriaService);
  protected readonly notaService = inject(NotaService);
  protected readonly notificacaoService = inject(NotificacaoService);
  protected readonly categorias$ = this.route.data.pipe(
    filter((data) => data['categorias'] as boolean),
    map((data) => data['categorias'] as ListagemCategoriasModel[]),
  );

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

  public cadastrar(): void {
    if (this.formGroup.invalid) return;

    const cadastrarNotaModel: CadastrarNotaModel = this.formGroup.value as CadastrarNotaModel;

    const cadastroObserver: Observer<CadastrarNotaApiResponse> = {
      next: () =>
        this.notificacaoService.sucesso(
          `O registro "${cadastrarNotaModel.titulo}" foi cadastrado com sucesso!`,
          'OK',
        ),
      error: (err: HttpErrorResponse) => this.notificacaoService.erro(err.error as string, 'OK'),
      complete: () => void this.router.navigate(['/notas']),
    };

    this.notaService.cadastrar(cadastrarNotaModel).subscribe(cadastroObserver);
  }
}
