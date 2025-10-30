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
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { PartialObserver } from 'rxjs';
import { RegistroModel, AccessTokenModel } from '../../../models/auth.models';

@Component({
  selector: 'af-registro.component',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class Registro {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  protected readonly notificacaoService = inject(NotificacaoService);

  protected formGroup: FormGroup = this.formBuilder.group({
    nomeCompleto: ['', [Validators.required.bind(this), Validators.minLength(3)]],
    email: ['', [Validators.required.bind(this), Validators.email.bind(this)]],
    senha: ['', [Validators.required.bind(this), Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required.bind(this), Validators.minLength(6)]],
  });

  public get nomeCompleto(): AbstractControl<unknown, unknown, unknown> | null {
    return this.formGroup.get('nomeCompleto');
  }

  public get email(): AbstractControl<unknown, unknown, unknown> | null {
    return this.formGroup.get('email');
  }

  public get senha(): AbstractControl<unknown, unknown, unknown> | null {
    return this.formGroup.get('senha');
  }

  public get confirmarSenha(): AbstractControl<unknown, unknown, unknown> | null {
    return this.formGroup.get('confirmarSenha');
  }

  public cadastrar(): void {
    if (this.formGroup.invalid) return;

    const registroModel: RegistroModel = this.formGroup.value as RegistroModel;

    const registroObserver: PartialObserver<AccessTokenModel> = {
      error: (err) => this.notificacaoService.erro(err.message, 'OK'),
      complete: () => void this.router.navigate(['/inicio']),
    };

    this.authService.registro(registroModel).subscribe(registroObserver);
  }
}
