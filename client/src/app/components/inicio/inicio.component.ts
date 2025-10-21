import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'af-inicio',
  imports: [
    MatCard,
    MatCardContent,
    RouterLink,
    MatDivider,
    MatCardActions,
    MatButtonModule,
    MatIcon,
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {}
