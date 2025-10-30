import { Component, inject } from '@angular/core';
import { ShellComponent } from './components/shared/shell/shell.component';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [ShellComponent, RouterOutlet, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authService = inject(AuthService);

  protected readonly accessToken$ = this.authService.accessToken$;

  public logout(): void {}
}
