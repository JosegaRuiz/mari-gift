import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="rules-container">
      <h1>Reglas del Juego</h1>
      
      <div class="rules-section">
        <h2>Objetivo</h2>
        <p>Adivinar palabras relacionadas con nuestra relación o con nosotros mismos para avanzar en los niveles.</p>
      </div>
      
      <div class="rules-section">
        <h2>Cómo Jugar</h2>
        <ul>
          <li>En cada nivel tendrás que adivinar una o varias palabra/s oculta/s.</li>
          <li>Podrás recibir pistas para ayudarte a descubrir la/s palabra/s.</li>
          <li>Puedes comprar letras usando tus MariCoins:</li>
          <ul>
            <li>Vocales: 30 MariCoins</li>
            <li>Consonantes: 10 MariCoins</li>
          </ul>
          <li>Cuando creas saber la respuesta, escríbela y compruébala.</li>
          <li>Si aciertas, ganarás 20 MariCoins y avanzarás al siguiente nivel.</li>
          <li>Si fallas, perderás 10 MariCoins.</li>
        </ul>
      </div>
      
      <div class="rules-section">
        <h2>MariCoins</h2>
        <p>Los MariCoins son la moneda del juego:</p>
        <ul>
          <li>Empiezas con 50 MariCoins.</li>
          <li>Ganas 20 MariCoins por cada palabra adivinada.</li>
          <li>Puedes reclamar un bonus diario de 25 MariCoins en la Tienda.</li>
          <li>Puedes comprar mejoras en la Tienda usando tus MariCoins.</li>
        </ul>
      </div>
      
      <div class="rules-section">
        <h2>Progreso</h2>
        <p>En la sección de Progreso podrás ver:</p>
        <ul>
          <li>Tu nivel actual y los niveles completados.</li>
          <li>Tus MariCoins acumulados.</li>
          <li>Los logros que has desbloqueado.</li>
        </ul>
      </div>
      
      <div class="back-button">
        <a [routerLink]="['/home']" class="btn">Volver al Inicio</a>
      </div>
    </div>
  `,
  styleUrl: './rules.scss'
})
export class Rules {}