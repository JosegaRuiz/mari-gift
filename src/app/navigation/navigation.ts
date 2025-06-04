import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navigation">
      <div class="logo">
        <a [routerLink]="['/home']">MariGift</a>
      </div>
      <div class="nav-links">
        <a [routerLink]="['/home']" routerLinkActive="active">Inicio</a>
        <a [routerLink]="['/game']" routerLinkActive="active">Juego</a>
        <a [routerLink]="['/store']" routerLinkActive="active">Tienda</a>
        <a [routerLink]="['/progress']" routerLinkActive="active">Progreso</a>
        <a [routerLink]="['/rules']" routerLinkActive="active">Reglas</a>
      </div>
    </nav>
  `,
  styleUrl: './navigation.scss'
})
export class Navigation {}