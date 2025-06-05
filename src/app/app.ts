import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './navigation/navigation';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navigation],
  template: `
    <app-navigation></app-navigation>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  title = 'Mari-Gift';
  
  constructor(private gameService: GameService) {}
  
  ngOnInit() {
    // Comprobar si estamos en el navegador
    if (typeof window !== 'undefined') {
      // Comprobar si hay un parámetro secreto en la URL
      const urlParams = new URLSearchParams(window.location.search);
      const secretParam = urlParams.get('secretReset');
      
      if (secretParam === 'mariGiftReset123') {
        console.log('Reseteando el juego...');
        
        // Borrar específicamente las claves del juego
        localStorage.removeItem('mariGiftGameState');
        localStorage.removeItem('lastBonusClaim');
        console.log('Datos del juego borrados correctamente');
        
        // Reiniciar el servicio del juego
        this.gameService.resetGame();
        
        // Recargar sin el parámetro después de un breve retraso
        setTimeout(() => {
          window.location.href = window.location.pathname;
        }, 200);
      }
    }
  }
}