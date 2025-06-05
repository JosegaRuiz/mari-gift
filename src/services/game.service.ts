import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GameLevel {
  name: string;
  word: string;
  hint: string;
  completed: boolean;
  unlockedLetters: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Estado del juego
  private _maricoins = new BehaviorSubject<number>(50);
  private _currentLevel = new BehaviorSubject<number>(1);
  private _levels = new BehaviorSubject<GameLevel[]>([
    {
      name: 'Nivel 1',
      word: 'AMOR',
      hint: 'Lo que siento por ti',
      completed: false,
      unlockedLetters: ['A']
    },
    {
      name: 'Nivel 2',
      word: 'SIEMPRE',
      hint: 'Cuánto tiempo estaré contigo',
      completed: false,
      unlockedLetters: ['S']
    },
    {
      name: 'Nivel 3',
      word: 'JUNTOS',
      hint: 'Cómo quiero que estemos',
      completed: false,
      unlockedLetters: ['J']
    },
    {
      name: 'Nivel 4',
      word: 'FELICIDAD',
      hint: 'Lo que me das cada día',
      completed: false,
      unlockedLetters: ['F']
    },
    {
      name: 'Nivel 5',
      word: 'MARIPOSA',
      hint: 'Lo que siento en el estómago cuando te veo',
      completed: false,
      unlockedLetters: ['M']
    }
  ]);

  // Observables públicos
  maricoins$ = this._maricoins.asObservable();
  currentLevel$ = this._currentLevel.asObservable();
  levels$ = this._levels.asObservable();

  constructor() {
    this.loadGameState();
  }

  // Getters para acceder al estado actual
  get maricoins(): number {
    return this._maricoins.value;
  }

  get currentLevel(): number {
    return this._currentLevel.value;
  }

  get levels(): GameLevel[] {
    return this._levels.value;
  }

  get totalLevels(): number {
    return this._levels.value.length;
  }

  get completedLevels(): number {
    return this._levels.value.filter(level => level.completed).length;
  }

  // Métodos para modificar el estado
  updateMaricoins(amount: number): void {
    const newAmount = this._maricoins.value + amount;
    this._maricoins.next(newAmount >= 0 ? newAmount : 0);
    this.saveGameState();
  }

  setCurrentLevel(level: number): void {
    if (level > 0 && level <= this.totalLevels) {
      this._currentLevel.next(level);
      this.saveGameState();
    }
  }

  completeCurrentLevel(): void {
    const levels = [...this._levels.value];
    const currentLevelIndex = this.currentLevel - 1;
    
    if (currentLevelIndex >= 0 && currentLevelIndex < levels.length) {
      levels[currentLevelIndex].completed = true;
      this._levels.next(levels);
      
      // Avanzar al siguiente nivel si no es el último
      if (this.currentLevel < this.totalLevels) {
        this._currentLevel.next(this.currentLevel + 1);
      }
      
      this.saveGameState();
    }
  }

  unlockLetter(letter: string): boolean {
    const levels = [...this._levels.value];
    const currentLevelIndex = this.currentLevel - 1;
    
    if (currentLevelIndex >= 0 && currentLevelIndex < levels.length) {
      const currentLevel = levels[currentLevelIndex];
      
      // Verificar si la letra está en la palabra y no ha sido desbloqueada
      if (
        currentLevel.word.includes(letter) && 
        !currentLevel.unlockedLetters.includes(letter)
      ) {
        currentLevel.unlockedLetters.push(letter);
        this._levels.next(levels);
        this.saveGameState();
        return true;
      }
    }
    
    return false;
  }

  // Verificar si estamos en el navegador
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Persistencia local
  private saveGameState(): void {
    if (!this.isBrowser()) return;
    
    const gameState = {
      maricoins: this.maricoins,
      currentLevel: this.currentLevel,
      levels: this.levels
    };
    
    localStorage.setItem('mariGiftGameState', JSON.stringify(gameState));
  }

  private loadGameState(): void {
    if (!this.isBrowser()) return;
    
    const savedState = localStorage.getItem('mariGiftGameState');
    
    if (savedState) {
      try {
        const gameState = JSON.parse(savedState);
        
        if (gameState.maricoins !== undefined) {
          this._maricoins.next(gameState.maricoins);
        }
        
        if (gameState.currentLevel !== undefined) {
          this._currentLevel.next(gameState.currentLevel);
        }
        
        if (gameState.levels !== undefined) {
          this._levels.next(gameState.levels);
        }
      } catch (error) {
        console.error('Error al cargar el estado del juego:', error);
      }
    }
  }

  resetGame(): void {
    // Reiniciar a los valores iniciales
    this._maricoins.next(50);
    this._currentLevel.next(1);
    
    // Reiniciar los niveles
    this._levels.next([
      {
        name: 'Nivel 1',
        word: 'AMOR',
        hint: 'Lo que siento por ti',
        completed: false,
        unlockedLetters: ['A']
      },
      {
        name: 'Nivel 2',
        word: 'SIEMPRE',
        hint: 'Cuánto tiempo estaré contigo',
        completed: false,
        unlockedLetters: ['S']
      },
      {
        name: 'Nivel 3',
        word: 'JUNTOS',
        hint: 'Cómo quiero que estemos',
        completed: false,
        unlockedLetters: ['J']
      },
      {
        name: 'Nivel 4',
        word: 'FELICIDAD',
        hint: 'Lo que me das cada día',
        completed: false,
        unlockedLetters: ['F']
      },
      {
        name: 'Nivel 5',
        word: 'MARIPOSA',
        hint: 'Lo que siento en el estómago cuando te veo',
        completed: false,
        unlockedLetters: ['M']
      }
    ]);
    
    // Borrar el estado guardado
    if (this.isBrowser()) {
      localStorage.removeItem('mariGiftGameState');
      localStorage.removeItem('lastBonusClaim');
      console.log('Estado del juego reiniciado correctamente');
    }
  }
}