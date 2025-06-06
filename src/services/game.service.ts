import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Interfaces para el nuevo modelo de juego
export interface GameWord {
  text: string;
  unlockedLetters: string[];
}

export interface GameLevel {
  id: string; // Formato: "1.1", "1.2", etc.
  name: string;
  description: string;
  hints: string[];
  unlockedHints: number; // Número de pistas desbloqueadas
  words: GameWord[];
  isPhrase: boolean; // Si es una frase (palabras dependientes) o palabras independientes
  completed: boolean;
  guessedWords?: string[]; // Palabras ya adivinadas (para niveles de tipo lista)
  requiredGuesses?: number; // Número de aciertos requeridos para completar el nivel
}

export interface GamePhase {
  id: number;
  name: string;
  description: string;
  levels: GameLevel[];
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Estado del juego
  private _maricoins = new BehaviorSubject<number>(200);
  private _currentPhaseId = new BehaviorSubject<number>(1);
  private _currentLevelId = new BehaviorSubject<string>("1.1");
  private _phases = new BehaviorSubject<GamePhase[]>([
    {
      id: 1,
      name: "Yo y mis gustos",
      description: "Descubre los gustos y preferencias de José",
      levels: [
        {
          id: "1.1",
          name: "Nivel 1: Filosofía de vida",
          description: "Para celebrar un año juntos, Jose ha decidido hacerte un regalo, pero como todo en la vida no va a ser fácil, pero sí que nos recomienda que acabemos el juego en 1-2 semanas. Aunque pensándolo bien, un juego que dure más de eso es un lujo en la actualidad, así que aunque no pudieras disfrutar de tu regalo, habrías disfrutado del juego. Y eso pega mucho con una cita filosófica que a José le encanta aplicar en la vida. Es el momento de que escribas esa frase si quieres avanzar",
          hints: [
            "Se puede aplicar al gimnasio",
            "Realmente se puede aplicar en cualquier ámbito de la vida",
            "Habla sobre la autoestima durante un largo camino",
            "La última palabra es 'resultado'",
            "La primera palabra es un verbo en imperativo"
          ],
          unlockedHints: 0,
          words: [
            { text: "DISFRUTA", unlockedLetters: ["F", "T"] },
            { text: "DEL", unlockedLetters: [] },
            { text: "CAMINO", unlockedLetters: ["C", "M"] },
            { text: "Y", unlockedLetters: [] },
            { text: "NO", unlockedLetters: [] },
            { text: "SOLO", unlockedLetters: [] },
            { text: "DEL", unlockedLetters: [] },
            { text: "RESULTADO", unlockedLetters: ["S", "T"] }
          ],
          isPhrase: true,
          completed: false
        },
        {
          id: "1.2",
          name: "Nivel 2: Mis favoritos",
          description: "Sé que suena egocéntrico, pero es más bien confianza en ti, con lo que para avanzar quiero proponerte que trates de adivinar 7 de mis películas, videojuegos, animes o series favoritas.",
          hints: [
            "Prueba con alguna que te haya obligado a ver"
          ],
          unlockedHints: 0,
          words: [
            { text: "ONE PIECE", unlockedLetters: [] },
            { text: "MR ROBOT", unlockedLetters: [] },
            { text: "ATTACK ON TITANS", unlockedLetters: [] },
            { text: "BLEACH", unlockedLetters: [] },
            { text: "DIGIMON", unlockedLetters: [] },
            { text: "SHINGEKI NO KYOJIN", unlockedLetters: [] },
            { text: "COMO CONOCI A VUESTRA MADRE", unlockedLetters: [] },
            { text: "KINGDOM HEARTS", unlockedLetters: [] },
            { text: "DRAGON BALL", unlockedLetters: [] },
            { text: "POKEMON", unlockedLetters: [] },
            { text: "MONSTER HUNTER", unlockedLetters: [] },
            { text: "IT TAKES TWO", unlockedLetters: [] },
            { text: "HOUSE", unlockedLetters: [] },
            { text: "LA VIDA ES BELLA", unlockedLetters: [] }
          ],
          isPhrase: false,
          completed: false,
          guessedWords: [],
          requiredGuesses: 7
        }
      ],
      completed: false
    },
    {
      id: 2,
      name: "Maria y sus gustos",
      description: "Descubre los gustos y preferencias de Maria",
      levels: [
        {
          id: "2.1",
          name: "Nivel 1: Tus cualidades",
          description: "Ha llegado el momento de hablar de ti, mi vida entera, la cual no ha cobrado sentido hasta que te conocí hace poco más de un año... Desde que te conocí has hecho especial cada momento que compartimos y me has enseñado a disfrutar de los momentos de soledad o cuando no estamos juntos, aunque echándote mucho de menos. Podría regalarte los oídos, pero me apetece, ya que pienso que eres demasiado autocrítica y sobre todo mala contigo, me parece un buen momento para que empieces acertando 3 de las muchas características que tienes que me encantan.",
          hints: [
            "Pueden ser cosas físicas, cosas de la personalidad",
            "Este nivel es fácil, tienes muchas cosas, lo importante de este nivel es ver cómo tú te defines a ti misma o qué cosas eres capaz de valorar de ti misma"
          ],
          unlockedHints: 0,
          words: [
            { text: "TIERNA", unlockedLetters: [] },
            { text: "SENSIBLE", unlockedLetters: [] },
            { text: "AMOROSA", unlockedLetters: [] },
            { text: "FELIZ", unlockedLetters: [] },
            { text: "DISTINTA", unlockedLetters: [] },
            { text: "FUERTE", unlockedLetters: [] },
            { text: "SINCERA", unlockedLetters: [] },
            { text: "GUAPA", unlockedLetters: [] },
            { text: "TETAS", unlockedLetters: [] },
            { text: "CARA", unlockedLetters: [] },
            { text: "CULO", unlockedLetters: [] }
          ],
          isPhrase: false,
          completed: false,
          guessedWords: [],
          requiredGuesses: 3
        }
      ],
      completed: false
    },
    {
      id: 3,
      name: "Nuestra relación",
      description: "Momentos especiales que hemos compartido juntos",
      levels: [],
      completed: false
    }
  ]);

  // Observables públicos
  maricoins$ = this._maricoins.asObservable();
  currentPhaseId$ = this._currentPhaseId.asObservable();
  currentLevelId$ = this._currentLevelId.asObservable();
  phases$ = this._phases.asObservable();

  constructor() {
    this.loadGameState();
  }

  // Getters para acceder al estado actual
  get maricoins(): number {
    return this._maricoins.value;
  }

  get currentPhaseId(): number {
    return this._currentPhaseId.value;
  }

  get currentLevelId(): string {
    return this._currentLevelId.value;
  }

  get phases(): GamePhase[] {
    return this._phases.value;
  }

  get currentPhase(): GamePhase | undefined {
    return this._phases.value.find(phase => phase.id === this._currentPhaseId.value);
  }

  get currentLevel(): GameLevel | undefined {
    const phase = this.currentPhase;
    if (!phase) return undefined;
    return phase.levels.find(level => level.id === this._currentLevelId.value);
  }

  get totalPhases(): number {
    return this._phases.value.length;
  }

  get completedPhases(): number {
    return this._phases.value.filter(phase => phase.completed).length;
  }

  get completedLevels(): number {
    return this._phases.value.reduce((total, phase) => 
      total + phase.levels.filter(level => level.completed).length, 0);
  }

  get totalLevels(): number {
    return this._phases.value.reduce((total, phase) => 
      total + phase.levels.length, 0);
  }

  // Métodos para modificar el estado
  updateMaricoins(amount: number): void {
    const newAmount = this._maricoins.value + amount;
    this._maricoins.next(newAmount >= 0 ? newAmount : 0);
    this.saveGameState();
  }

  setCurrentPhase(phaseId: number): void {
    if (phaseId > 0 && phaseId <= this.totalPhases) {
      this._currentPhaseId.next(phaseId);
      this.saveGameState();
    }
  }

  setCurrentLevel(levelId: string): void {
    const phase = this.currentPhase;
    if (phase && phase.levels.some(level => level.id === levelId)) {
      this._currentLevelId.next(levelId);
      this.saveGameState();
    }
  }

  unlockHint(): boolean {
    const phases = [...this._phases.value];
    const phaseIndex = phases.findIndex(p => p.id === this.currentPhaseId);
    
    if (phaseIndex === -1) {
      console.log('Fase no encontrada:', this.currentPhaseId);
      return false;
    }
    
    const levelIndex = phases[phaseIndex].levels.findIndex(l => l.id === this.currentLevelId);
    
    if (levelIndex === -1) {
      console.log('Nivel no encontrado:', this.currentLevelId);
      return false;
    }
    
    const level = phases[phaseIndex].levels[levelIndex];
    console.log('Pistas desbloqueadas:', level.unlockedHints, 'de', level.hints.length);
    
    if (level.unlockedHints < level.hints.length) {
      level.unlockedHints++;
      console.log('Nueva pista desbloqueada. Total:', level.unlockedHints);
      this._phases.next(phases);
      this.saveGameState();
      return true;
    }
    
    console.log('No hay más pistas para desbloquear');
    return false;
  }

  unlockLetter(word: number, letter: string): boolean {
    const phases = [...this._phases.value];
    const phaseIndex = phases.findIndex(p => p.id === this.currentPhaseId);
    
    if (phaseIndex === -1) return false;
    
    const levelIndex = phases[phaseIndex].levels.findIndex(l => l.id === this.currentLevelId);
    
    if (levelIndex === -1) return false;
    
    const level = phases[phaseIndex].levels[levelIndex];
    
    if (word < 0 || word >= level.words.length) return false;
    
    const gameWord = level.words[word];
    
    // Verificar si la letra está en la palabra y no ha sido desbloqueada
    if (
      gameWord.text.includes(letter) && 
      !gameWord.unlockedLetters.includes(letter)
    ) {
      gameWord.unlockedLetters.push(letter);
      this._phases.next(phases);
      this.saveGameState();
      return true;
    }
    
    return false;
  }

  checkGuess(guess: string): boolean {
    const level = this.currentLevel;
    if (!level) return false;
    
    // Normalizar la entrada (quitar espacios extra, convertir a mayúsculas)
    const normalizedGuess = guess.trim().toUpperCase();
    
    // Si es una frase, comparamos con todas las palabras juntas
    if (level.isPhrase) {
      const fullPhrase = level.words.map(w => w.text).join(' ');
      if (normalizedGuess === fullPhrase) {
        this.completeCurrentLevel();
        this.updateMaricoins(20); // Recompensa por adivinar una frase
        return true;
      }
    } else {
      // Si son palabras independientes, comprobamos si alguna coincide
      for (let i = 0; i < level.words.length; i++) {
        if (normalizedGuess === level.words[i].text) {
          // Verificar si es un nivel de tipo lista (con requiredGuesses)
          if (level.requiredGuesses !== undefined) {
            // Inicializar el array de palabras adivinadas si no existe
            if (!level.guessedWords) {
              level.guessedWords = [];
            }
            
            // Verificar si la palabra ya ha sido adivinada
            if (level.guessedWords.includes(level.words[i].text)) {
              return false; // La palabra ya fue adivinada
            }
            
            // Añadir la palabra a la lista de adivinadas
            level.guessedWords.push(level.words[i].text);
            this.updateMaricoins(5); // Recompensa por adivinar una palabra
            
            // Guardar el estado actualizado
            this.saveGameState();
            
            // Comprobar si se ha alcanzado el número requerido de aciertos
            if (level.guessedWords.length >= level.requiredGuesses) {
              this.completeCurrentLevel();
            }
            
            return true;
          } else {
            // Comportamiento normal para palabras independientes
            this.updateMaricoins(5); // Recompensa por adivinar una palabra
            this.completeCurrentLevel();
            return true;
          }
        }
      }
    }
    
    return false;
  }

  completeCurrentLevel(): void {
    const phases = [...this._phases.value];
    const phaseIndex = phases.findIndex(p => p.id === this.currentPhaseId);
    
    if (phaseIndex === -1) return;
    
    const levelIndex = phases[phaseIndex].levels.findIndex(l => l.id === this.currentLevelId);
    
    if (levelIndex === -1) return;
    
    // Marcar el nivel como completado
    phases[phaseIndex].levels[levelIndex].completed = true;
    
    // Comprobar si todos los niveles de la fase están completados
    const allLevelsCompleted = phases[phaseIndex].levels.every(l => l.completed);
    if (allLevelsCompleted) {
      phases[phaseIndex].completed = true;
    }
    
    this._phases.next(phases);
    
    // Avanzar al siguiente nivel o fase
    this.advanceToNextLevel();
    
    this.saveGameState();
  }

  advanceToNextLevel(): void {
    const phases = this._phases.value;
    const currentPhaseId = this.currentPhaseId;
    const currentLevelId = this.currentLevelId;
    
    // Encontrar el índice actual
    const phaseIndex = phases.findIndex(p => p.id === currentPhaseId);
    if (phaseIndex === -1) return;
    
    const phase = phases[phaseIndex];
    const levelIndex = phase.levels.findIndex(l => l.id === currentLevelId);
    if (levelIndex === -1) return;
    
    // Comprobar si hay más niveles en esta fase
    if (levelIndex < phase.levels.length - 1) {
      // Avanzar al siguiente nivel de esta fase
      this._currentLevelId.next(phase.levels[levelIndex + 1].id);
    } else {
      // Comprobar si hay más fases
      if (phaseIndex < phases.length - 1) {
        // Avanzar a la primera fase del siguiente nivel
        this._currentPhaseId.next(phases[phaseIndex + 1].id);
        if (phases[phaseIndex + 1].levels.length > 0) {
          this._currentLevelId.next(phases[phaseIndex + 1].levels[0].id);
        }
      }
    }
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
      currentPhaseId: this.currentPhaseId,
      currentLevelId: this.currentLevelId,
      phases: this.phases
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
        
        if (gameState.currentPhaseId !== undefined) {
          this._currentPhaseId.next(gameState.currentPhaseId);
        }
        
        if (gameState.currentLevelId !== undefined) {
          this._currentLevelId.next(gameState.currentLevelId);
        }
        
        if (gameState.phases !== undefined) {
          this._phases.next(gameState.phases);
        }
      } catch (error) {
        console.error('Error al cargar el estado del juego:', error);
      }
    }
  }

  resetGame(): void {
    // Borrar el estado guardado primero para evitar problemas de caché
    if (this.isBrowser()) {
      localStorage.clear(); // Limpiamos todo el localStorage para asegurar
      console.log('LocalStorage limpiado completamente');
    }
    
    // Reiniciar a los valores iniciales
    this._maricoins.next(200);
    this._currentPhaseId.next(1);
    this._currentLevelId.next("1.1");
    
    // Reiniciar las fases y niveles con la configuración inicial
    const initialPhases = [
      {
        id: 1,
        name: "Yo y mis gustos",
        description: "Descubre los gustos y preferencias de José",
        levels: [
          {
            id: "1.1",
            name: "Nivel 1: Filosofía de vida",
            description: "Para celebrar un año juntos, José ha decidido hacerte un regalo, pero como todo en la vida no va a ser fácil, pero sí que nos recomienda que acabemos el juego en 1-2 semanas. Aunque pensándolo bien, un juego que dure más de eso es un lujo en la actualidad, así que aunque no pudieras disfrutar de tu regalo, habrías disfrutado del juego. Y eso pega mucho con una cita filosófica que a José le encanta aplicar en la vida. Es el momento de que escribas esa frase si quieres avanzar",
            hints: [
              "Se puede aplicar al gimnasio",
              "Realmente se puede aplicar en cualquier ámbito de la vida",
              "Habla sobre la autoestima durante un largo camino",
              "La última palabra es 'resultado'",
              "La primera palabra es un verbo en imperativo"
            ],
            unlockedHints: 0,
            words: [
              { text: "DISFRUTA", unlockedLetters: ["F", "T"] },
              { text: "DEL", unlockedLetters: [] },
              { text: "CAMINO", unlockedLetters: ["C", "M"] },
              { text: "Y", unlockedLetters: [] },
              { text: "NO", unlockedLetters: [] },
              { text: "SOLO", unlockedLetters: ["L"] },
              { text: "DEL", unlockedLetters: [] },
              { text: "RESULTADO", unlockedLetters: ["S", "T"] }
            ],
            isPhrase: true,
            completed: false
          },
          {
            id: "1.2",
            name: "Nivel 2: Mis favoritos",
            description: "Sé que suena egocéntrico, pero es más bien confianza en ti, con lo que para avanzar quiero proponerte que trates de adivinar 7 de mis películas, videojuegos, animes o series favoritas.",
            hints: [
              "Prueba con alguna que te haya obligado a ver"
            ],
            unlockedHints: 0,
            words: [
              { text: "ONE PIECE", unlockedLetters: [] },
              { text: "MR ROBOT", unlockedLetters: [] },
              { text: "ATTACK ON TITANS", unlockedLetters: [] },
              { text: "BLEACH", unlockedLetters: [] },
              { text: "DIGIMON", unlockedLetters: [] },
              { text: "SHINGEKI NO KYOJIN", unlockedLetters: [] },
              { text: "COMO CONOCI A VUESTRA MADRE", unlockedLetters: [] },
              { text: "KINGDOM HEARTS", unlockedLetters: [] },
              { text: "DRAGON BALL", unlockedLetters: [] },
              { text: "POKEMON", unlockedLetters: [] },
              { text: "MONSTER HUNTER", unlockedLetters: [] },
              { text: "IT TAKES TWO", unlockedLetters: [] },
              { text: "HOUSE", unlockedLetters: [] },
              { text: "LA VIDA ES BELLA", unlockedLetters: [] }
            ],
            isPhrase: false,
            completed: false,
            guessedWords: [],
            requiredGuesses: 7
          }
        ],
        completed: false
      },
      {
        id: 2,
        name: "Maria y sus gustos",
        description: "Descubre los gustos y preferencias de Maria",
        levels: [
          {
            id: "2.1",
            name: "Nivel 1: Tus cualidades",
            description: "Ha llegado el momento de hablar de ti, mi vida entera, la cual no ha cobrado sentido hasta que te conocí hace poco más de un año... Desde que te conocí has hecho especial cada momento que compartimos y me has enseñado a disfrutar de los momentos de soledad o cuando no estamos juntos, aunque echándote mucho de menos. Podría regalarte los oídos, pero me apetece, ya que pienso que eres demasiado autocrítica y sobre todo mala contigo, me parece un buen momento para que empieces acertando 3 de las muchas características que tienes que me encantan.",
            hints: [
              "Pueden ser cosas físicas, cosas de la personalidad",
              "Este nivel es fácil, tienes muchas cosas, lo importante de este nivel es ver cómo tú te defines a ti misma o qué cosas eres capaz de valorar de ti misma"
            ],
            unlockedHints: 0,
            words: [
              { text: "TIERNA", unlockedLetters: [] },
              { text: "SENSIBLE", unlockedLetters: [] },
              { text: "AMOROSA", unlockedLetters: [] },
              { text: "FELIZ", unlockedLetters: [] },
              { text: "DISTINTA", unlockedLetters: [] },
              { text: "FUERTE", unlockedLetters: [] },
              { text: "SINCERA", unlockedLetters: [] },
              { text: "GUAPA", unlockedLetters: [] },
              { text: "TETAS", unlockedLetters: [] },
              { text: "CARA", unlockedLetters: [] },
              { text: "CULO", unlockedLetters: [] }
            ],
            isPhrase: false,
            completed: false,
            guessedWords: [],
            requiredGuesses: 3
          }
        ],
        completed: false
      },
      {
        id: 3,
        name: "Nuestra relación",
        description: "Momentos especiales que hemos compartido juntos",
        levels: [],
        completed: false
      }
    ];
    
    this._phases.next(initialPhases);
    
    console.log('Juego reiniciado correctamente');
  }
}