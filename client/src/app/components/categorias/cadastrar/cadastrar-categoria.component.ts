import { CadastrarCategoriaApiResponse } from './../../../models/categoria.models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CadastrarCategoriaModel } from '../../../models/categoria.models';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriaService } from '../../../services/categoria.service';
import { Observer } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { NotificacaoService } from '../../../services/notificacao.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'af-cadastrar-categoria',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './cadastrar-categoria.component.html',
  styleUrl: './cadastrar-categoria.component.scss',
})
export class CadastrarCategoria {
  private readonly notificacaoService = inject(NotificacaoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected formGroup: FormGroup = this.formBuilder.group({
    titulo: ['', [Validators.required.bind(this), Validators.minLength(3)]],
  });

  public get titulo(): AbstractControl<unknown, unknown, unknown> | null {
    return this.formGroup.get('titulo');
  }

  public cadastrar(): void {
    if (this.formGroup.invalid) return;

    const cadastrarCategoriaModel: CadastrarCategoriaModel = this.formGroup
      .value as CadastrarCategoriaModel;

    const cadastroObserver: Observer<CadastrarCategoriaApiResponse> = {
      next: () =>
        this.notificacaoService.sucesso(
          `Registro "${cadastrarCategoriaModel.titulo}" cadastrado com sucesso!`,
          'OK',
        ),
      error: (err: HttpErrorResponse) => this.notificacaoService.erro(err.error as string, 'OK'),
      complete: () => void this.router.navigate(['/categorias']),
    };

    this.categoriaService.cadastrar(cadastrarCategoriaModel).subscribe(cadastroObserver);
  }
}
