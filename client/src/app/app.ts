import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ShellComponent } from "./components/shell/shell.component";

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatCardModule, ShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('anota-facil');
}
