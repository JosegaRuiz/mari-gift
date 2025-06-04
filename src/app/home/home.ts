import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-container">
      <h1>Bienvenida a Mari-Gift</h1>
      <p class="subtitle">Un regalo especial para ti</p>
      
      <div class="intro-text">
        <p>Este es un juego de escape room virtual creado especialmente para ti.</p>
        <p>Tendrás que resolver acertijos y adivinar palabras para avanzar.</p>
        <p>¡Vamos a empezar esta aventura juntos!</p>
      </div>
      
      <div class="start-button">
        <a [routerLink]="['/game']" class="btn">Comenzar Juego</a>
      </div>
    </div>
  `,
  styleUrl: './home.scss'
})
export class Home {}