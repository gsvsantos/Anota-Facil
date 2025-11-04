import { Component, inject } from '@angular/core';
import { ShellComponent } from './components/shared/shell/shell.component';
import { Router, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from './services/auth.service';
import { PartialObserver } from 'rxjs';
import { NotificacaoService } from './services/notificacao.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [ShellComponent, RouterOutlet, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authService = inject(AuthService);
  protected readonly notificacaoService = inject(NotificacaoService);
  protected readonly router = inject(Router);
  protected readonly accessToken$ = this.authService.accessToken$;

  public logout(): void {
    const sairObserver: PartialObserver<null> = {
      error: (err: HttpErrorResponse) => this.notificacaoService.erro(err.error as string, 'OK'),
      complete: () => void this.router.navigate(['/auth', 'login']),
    };

    this.authService.sair().subscribe(sairObserver);
  }
}
