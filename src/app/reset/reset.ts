import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-reset',
  standalone: true,
  template: `<div class="reset-container">
    <h1>Reseteando el juego...</h1>
    <p>Por favor, espera un momento.</p>
    <div class="loading-spinner"></div>
  </div>`,
  styles: [`
    .reset-container {
      text-align: center;
      padding: 2rem;
    }
    .loading-spinner {
      margin: 2rem auto;
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #ff41f8;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class Reset implements OnInit {
  constructor(private router: Router, private gameService: GameService) {}

  ngOnInit() {
    // Primero, borrar todo el localStorage
    localStorage.clear();
    console.log('LocalStorage borrado');
    
    // Esperar un momento para asegurarnos de que el localStorage se ha limpiado
    setTimeout(() => {
      // Reiniciar el juego con el estado inicial
      this.gameService.resetGame();
      console.log('Juego reiniciado');
      
      // Esperar otro momento para asegurarnos de que el estado se ha actualizado
      setTimeout(() => {
        // Navegar a la página de inicio en lugar de recargar
        this.router.navigate(['/home']).then(() => {
          console.log('Navegación completada');
        });
      }, 1000);
    }, 1000);
  }
}