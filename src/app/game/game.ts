import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService, GamePhase, GameLevel, GameWord } from '../../services/game.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
  
  // Estado del juego
  currentPhase: GamePhase | undefined;
  currentLevel: GameLevel | undefined;
  currentPhaseId: number = 1;
  currentLevelId: string = "1.1";
  selectedWordIndex: number = 0; // Para palabras independientes
  
  // Visualización
  displayWords: { text: string, display: string[] }[] = [];
  guessInput: string = '';
  letterInput: string = '';
  message: string = '';
  
  // Suscripciones
  private subscriptions: Subscription[] = [];
  
  constructor(private gameService: GameService, private router: Router) {}
  
  ngOnInit() {
    // Suscribirse a los cambios en el estado del juego
    this.subscriptions.push(
      this.gameService.maricoins$.subscribe((coins: number) => {
        this.maricoins = coins;
      }),
      
      this.gameService.currentPhaseId$.subscribe((phaseId: number) => {
        this.currentPhaseId = phaseId;
        this.loadCurrentLevel();
      }),
      
      this.gameService.currentLevelId$.subscribe((levelId: string) => {
        this.currentLevelId = levelId;
        this.loadCurrentLevel();
      }),
      
      this.gameService.phases$.subscribe(() => {
        this.loadCurrentLevel();
      })
    );
    
    this.loadCurrentLevel();
  }
  
  ngOnDestroy() {
    // Cancelar todas las suscripciones al destruir el componente
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  loadCurrentLevel() {
    this.currentPhase = this.gameService.currentPhase;
    this.currentLevel = this.gameService.currentLevel;
    
    if (this.currentLevel) {
      // Inicializar la visualización de las palabras
      this.displayWords = this.currentLevel.words.map(word => {
        const display = Array(word.text.length).fill('_');
        
        // Mostrar las letras desbloqueadas
        word.unlockedLetters.forEach(letter => {
          for (let i = 0; i < word.text.length; i++) {
            if (word.text[i] === letter) {
              display[i] = letter;
            }
          }
        });
        
        return { text: word.text, display };
      });
    }
  }
  
  // Obtener las pistas disponibles
  get availableHints(): string[] {
    if (!this.currentLevel) return [];
    return this.currentLevel.hints.slice(0, this.currentLevel.unlockedHints);
  }
  
  // Comprar una pista
  buyHint() {
    if (this.maricoins >= 20) { // Precio de una pista
      if (this.gameService.unlockHint()) {
        this.gameService.updateMaricoins(-20);
        this.message = '¡Has desbloqueado una nueva pista!';
      } else {
        this.message = 'No hay más pistas disponibles para este nivel.';
      }
    } else {
      this.message = 'No tienes suficientes MariCoins para comprar una pista.';
    }
  }
  
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
    
    if (this.maricoins >= this.vowelPrice) {
      let found = false;
      
      // Si es una frase, buscamos en todas las palabras
      if (this.currentLevel?.isPhrase) {
        for (let i = 0; i < this.currentLevel.words.length; i++) {
          if (this.currentLevel.words[i].text.includes(letter) && 
              !this.currentLevel.words[i].unlockedLetters.includes(letter)) {
            this.gameService.unlockLetter(i, letter);
            found = true;
          }
        }
      } else {
        // Si son palabras independientes, solo en la palabra seleccionada
        if (this.currentLevel && this.selectedWordIndex < this.currentLevel.words.length) {
          const word = this.currentLevel.words[this.selectedWordIndex];
          if (word.text.includes(letter) && !word.unlockedLetters.includes(letter)) {
            this.gameService.unlockLetter(this.selectedWordIndex, letter);
            found = true;
          }
        }
      }
      
      this.gameService.updateMaricoins(-this.vowelPrice);
      
      if (found) {
        this.message = `¡Has desbloqueado la vocal ${letter}!`;
        this.loadCurrentLevel(); // Actualizar la visualización
      } else {
        this.message = `La vocal ${letter} no está en la palabra o ya ha sido desbloqueada. Has perdido ${this.vowelPrice} MariCoins.`;
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
    
    if (this.maricoins >= this.consonantPrice) {
      let found = false;
      
      // Si es una frase, buscamos en todas las palabras
      if (this.currentLevel?.isPhrase) {
        for (let i = 0; i < this.currentLevel.words.length; i++) {
          if (this.currentLevel.words[i].text.includes(letter) && 
              !this.currentLevel.words[i].unlockedLetters.includes(letter)) {
            this.gameService.unlockLetter(i, letter);
            found = true;
          }
        }
      } else {
        // Si son palabras independientes, solo en la palabra seleccionada
        if (this.currentLevel && this.selectedWordIndex < this.currentLevel.words.length) {
          const word = this.currentLevel.words[this.selectedWordIndex];
          if (word.text.includes(letter) && !word.unlockedLetters.includes(letter)) {
            this.gameService.unlockLetter(this.selectedWordIndex, letter);
            found = true;
          }
        }
      }
      
      this.gameService.updateMaricoins(-this.consonantPrice);
      
      if (found) {
        this.message = `¡Has desbloqueado la consonante ${letter}!`;
        this.loadCurrentLevel(); // Actualizar la visualización
      } else {
        this.message = `La consonante ${letter} no está en la palabra o ya ha sido desbloqueada. Has perdido ${this.consonantPrice} MariCoins.`;
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
    
    const result = this.gameService.checkGuess(this.guessInput);
    
    if (result) {
      // Respuesta correcta
      this.message = '¡Correcto! ¡Has adivinado la frase!';
      
      // Revelar todas las palabras
      this.loadCurrentLevel();
      
      // Comprobar si hay más niveles
      if (this.gameService.currentLevel) {
        setTimeout(() => {
          this.guessInput = '';
          this.message = `¡Avanzando al siguiente nivel!`;
        }, 2000);
      } else {
        // Si es el último nivel de la última fase, redirigir a la página de victoria
        if (this.gameService.completedPhases === this.gameService.totalPhases) {
          setTimeout(() => {
            this.router.navigate(['/victory']);
          }, 2000);
        }
      }
    } else {
      // Respuesta incorrecta
      this.message = 'Respuesta incorrecta. Inténtalo de nuevo.';
      this.gameService.updateMaricoins(-10); // Penalización por error
    }
    
    this.guessInput = '';
  }
  
  // Seleccionar una palabra para palabras independientes
  selectWord(index: number) {
    if (!this.currentLevel?.isPhrase) {
      this.selectedWordIndex = index;
    }
  }
}