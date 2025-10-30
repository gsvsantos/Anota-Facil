import { UsuarioAutenticadoModel } from './../../../models/auth.models';
import { Component, DOCUMENT, EventEmitter, inject, Input, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'af-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatSlideToggleModule,
    MatMenuModule,
    AsyncPipe,
    RouterLink,
  ],
})
export class ShellComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private document = inject(DOCUMENT);

  @Input({ required: true }) public usuarioAutenticado?: UsuarioAutenticadoModel;
  @Output() public logoutRequisitado = new EventEmitter<void>();

  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Handset])
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  public itensNavbar = [
    {
      titulo: 'Início',
      icone: 'home',
      link: '/inicio',
    },
    {
      titulo: 'Categorias',
      icone: 'bookmark',
      link: '/categorias',
    },
    {
      titulo: 'Notas',
      icone: 'add_notes',
      link: '/notas',
    },
  ];

  public onThemeChange(___: MatSlideToggleChange): void {
    void this.document.body.classList.toggle('dark');
  }
}
