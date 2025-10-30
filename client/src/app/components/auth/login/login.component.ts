import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { AccessTokenModel, LoginModel } from '../../../models/auth.models';
import { AuthService } from '../../../services/auth.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login.component',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class Login {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  protected readonly notificacaoService = inject(NotificacaoService);

  protected formGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required.bind(this), Validators.email.bind(this)]],
    senha: ['', [Validators.required.bind(this), Validators.minLength(6)]],
  });

  public get email(): AbstractControl<unknown, unknown, unknown> | null {
    return this.formGroup.get('email');
  }

  public get senha(): AbstractControl<unknown, unknown, unknown> | null {
    return this.formGroup.get('senha');
  }

  public entrar(): void {
    if (this.formGroup.invalid) return;

    const loginModel: LoginModel = this.formGroup.value as LoginModel;

    const loginObserver: PartialObserver<AccessTokenModel> = {
      error: (err: HttpErrorResponse) => this.notificacaoService.erro(err.message, 'OK'),
      complete: () => void this.router.navigate(['/inicio']),
    };

    this.authService.login(loginModel).subscribe(loginObserver);
  }
}
