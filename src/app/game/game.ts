import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService, GameLevel } from '../../services/game.service';
import { Subscription } from 'rxjs';

interface Level {
  word: string;
  hint: string;
  unlockedLetters: string[];
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class Game implements OnInit, OnDestroy {
  // Configuración del juego
  maricoins: number = 0;
  vowelPrice: number = 30;
  consonantPrice: number = 15;
  currentLevel: number = 1;
  totalLevels: number = 5;
  
  // Estado del juego
  currentWord: string = '';
  displayWord: string[] = [];
  hint: string = '';
  guessInput: string = '';
  message: string = '';
  
  // Suscripciones
  private subscriptions: Subscription[] = [];
  
  constructor(private gameService: GameService) {}
  
  ngOnInit() {
    // Suscribirse a los cambios en el estado del juego
    this.subscriptions.push(
      this.gameService.maricoins$.subscribe((coins: number) => {
        this.maricoins = coins;
      }),
      
      this.gameService.currentLevel$.subscribe((level: number) => {
        this.currentLevel = level;
        this.loadLevel();
      }),
      
      this.gameService.levels$.subscribe(() => {
        this.loadLevel();
      })
    );
    
    this.totalLevels = this.gameService.totalLevels;
    this.loadLevel();
  }
  
  ngOnDestroy() {
    // Cancelar todas las suscripciones al destruir el componente
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  loadLevel() {
    const levels = this.gameService.levels;
    if (this.currentLevel > 0 && this.currentLevel <= levels.length) {
      const gameLevel = levels[this.currentLevel - 1];
      this.currentWord = gameLevel.word;
      this.hint = gameLevel.hint;
      
      // Inicializar la palabra mostrada con guiones bajos
      this.displayWord = Array(this.currentWord.length).fill('_');
      
      // Mostrar las letras desbloqueadas
      gameLevel.unlockedLetters.forEach(letter => {
        this.revealLetter(letter);
      });
    }
  }
  
  revealLetter(letter: string) {
    letter = letter.toUpperCase();
    let found = false;
    
    for (let i = 0; i < this.currentWord.length; i++) {
      if (this.currentWord[i] === letter) {
        this.displayWord[i] = letter;
        found = true;
      }
    }
    
    return found;
  }
  
  // Variables para la entrada de letras
  letterInput: string = '';
  
  buyVowel() {
    if (!this.letterInput) {
      this.message = 'Por favor, introduce una vocal (A, E, I, O, U).';
      return;
    }
    
    const letter = this.letterInput.toUpperCase();
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    
    if (!vowels.includes(letter)) {
      this.message = 'Por favor, introduce una vocal válida (A, E, I, O, U).';
      return;
    }
    
    if (this.displayWord.includes(letter)) {
      this.message = `La letra ${letter} ya ha sido desbloqueada.`;
      return;
    }
    
    if (this.maricoins >= this.vowelPrice) {
      if (this.currentWord.includes(letter)) {
        this.gameService.updateMaricoins(-this.vowelPrice);
        
        // Desbloquear la letra en el servicio
        this.gameService.unlockLetter(letter);
        
        // Actualizar la visualización
        this.revealLetter(letter);
        this.message = `¡Has desbloqueado la letra ${letter}!`;
      } else {
        this.gameService.updateMaricoins(-this.vowelPrice);
        this.message = `La letra ${letter} no está en la palabra. Has perdido ${this.vowelPrice} MariCoins.`;
      }
      
      // Limpiar el input
      this.letterInput = '';
    } else {
      this.message = `No tienes suficientes MariCoins. Necesitas ${this.vowelPrice} MariCoins.`;
    }
  }
  
  buyConsonant() {
    if (!this.letterInput) {
      this.message = 'Por favor, introduce una consonante.';
      return;
    }
    
    const letter = this.letterInput.toUpperCase();
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    
    if (vowels.includes(letter)) {
      this.message = 'Has introducido una vocal. Por favor, introduce una consonante.';
      return;
    }
    
    if (!/^[A-Z]$/.test(letter)) {
      this.message = 'Por favor, introduce una letra válida.';
      return;
    }
    
    if (this.displayWord.includes(letter)) {
      this.message = `La letra ${letter} ya ha sido desbloqueada.`;
      return;
    }
    
    if (this.maricoins >= this.consonantPrice) {
      if (this.currentWord.includes(letter)) {
        this.gameService.updateMaricoins(-this.consonantPrice);
        
        // Desbloquear la letra en el servicio
        this.gameService.unlockLetter(letter);
        
        // Actualizar la visualización
        this.revealLetter(letter);
        this.message = `¡Has desbloqueado la letra ${letter}!`;
      } else {
        this.gameService.updateMaricoins(-this.consonantPrice);
        this.message = `La letra ${letter} no está en la palabra. Has perdido ${this.consonantPrice} MariCoins.`;
      }
      
      // Limpiar el input
      this.letterInput = '';
    } else {
      this.message = `No tienes suficientes MariCoins. Necesitas ${this.consonantPrice} MariCoins.`;
    }
  }
  
  checkGuess() {
    if (!this.guessInput) {
      this.message = 'Por favor, escribe una respuesta.';
      return;
    }
    
    if (this.guessInput.toUpperCase() === this.currentWord) {
      // Respuesta correcta
      this.message = '¡Correcto! ¡Has adivinado la palabra!';
      this.gameService.updateMaricoins(20); // Recompensa por adivinar
      
      // Revelar toda la palabra
      this.displayWord = this.currentWord.split('');
      
      // Marcar el nivel como completado
      this.gameService.completeCurrentLevel();
      
      // Comprobar si hay más niveles
      if (this.currentLevel < this.totalLevels) {
        setTimeout(() => {
          this.guessInput = '';
          this.message = `¡Avanzando a la fase ${this.currentLevel}!`;
        }, 2000);
      } else {
        this.message = '¡Felicidades! ¡Has completado todas las fases!';
      }
    } else {
      // Respuesta incorrecta
      this.message = 'Respuesta incorrecta. Inténtalo de nuevo.';
      this.gameService.updateMaricoins(-10); // Penalización por error
    }
    
    this.guessInput = '';
  }
}
