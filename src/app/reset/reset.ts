import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-reset',
  standalone: true,
  template: `<p>Reseteando...</p>`,
})
export class Reset implements OnInit {
  constructor(private router: Router, private gameService: GameService) {}

  ngOnInit() {
    // Borrar todo el localStorage
    localStorage.clear();
    console.log('LocalStorage borrado');
    
    // Forzar la reinicialización del juego con las pistas actualizadas
    this.gameService.resetGame();
    console.log('Juego reiniciado con pistas actualizadas');
    
    // Recargar la aplicación
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  }
}