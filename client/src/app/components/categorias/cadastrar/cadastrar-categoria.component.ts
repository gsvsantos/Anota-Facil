import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CadastrarCategoriaModel } from '../../../models/categoria.models';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriaService } from '../../../services/categoria.service';
import { finalize } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

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
  private readonly categoriaService = inject(CategoriaService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected formGroup: FormGroup = this.formBuilder.group({ titulo: [''] });

  public cadastrar(): void {
    if (this.formGroup.invalid) return;

    const cadastrarCategoriaModel: CadastrarCategoriaModel = this.formGroup
      .value as CadastrarCategoriaModel;

    this.categoriaService
      .cadastrar(cadastrarCategoriaModel)
      .pipe(finalize(() => void this.router.navigate(['/categorias'])))
      .subscribe((res) => console.log(res));
  }
}
