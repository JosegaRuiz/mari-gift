import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService, GameLevel } from '../../services/game.service';
import { Subscription } from 'rxjs';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.html',
  styleUrl: './progress.scss'
})
export class Progress implements OnInit, OnDestroy {
  maricoins: number = 0;
  currentLevel: number = 1;
  totalLevels: number = 5;
  completedLevels: number = 0;
  levels: any[] = [];
  
  achievements: Achievement[] = [
    {
      id: 1,
      name: 'Primer Nivel',
      description: 'Completaste el primer nivel del juego',
      icon: '🎮',
      unlocked: false
    },
    {
      id: 2,
      name: 'Coleccionista',
      description: 'Acumulaste 100 MariCoins',
      icon: '💰',
      unlocked: false
    },
    {
      id: 3,
      name: 'Lingüista',
      description: 'Desbloqueaste todas las letras de un nivel sin fallar',
      icon: '📚',
      unlocked: false
    },
    {
      id: 4,
      name: 'Mitad del Camino',
      description: 'Llegaste al nivel 3',
      icon: '🏆',
      unlocked: false
    },
    {
      id: 5,
      name: 'Maestro del Juego',
      description: 'Completaste todos los niveles',
      icon: '👑',
      unlocked: false
    }
  ];
  
  private subscriptions: Subscription[] = [];
  
  constructor(private gameService: GameService) {}
  
  ngOnInit() {
    // Suscribirse a los cambios en el estado del juego
    this.subscriptions.push(
      this.gameService.maricoins$.subscribe((coins: number) => {
        this.maricoins = coins;
        this.updateAchievements();
      }),
      
      this.gameService.currentLevel$.subscribe((level: number) => {
        this.currentLevel = level;
        this.updateAchievements();
      }),
      
      this.gameService.levels$.subscribe((levels: GameLevel[]) => {
        this.levels = levels;
        this.updateCompletedLevels();
        this.updateAchievements();
      })
    );
    
    this.totalLevels = this.gameService.totalLevels;
    this.levels = this.gameService.levels;
    this.updateCompletedLevels();
    this.updateAchievements();
  }
  
  ngOnDestroy() {
    // Cancelar todas las suscripciones al destruir el componente
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  updateCompletedLevels() {
    this.completedLevels = this.levels.filter(level => level.completed).length;
  }
  
  updateAchievements() {
    // Actualizar logros basados en el progreso actual
    
    // Primer nivel
    this.achievements[0].unlocked = this.completedLevels >= 1;
    
    // Coleccionista
    this.achievements[1].unlocked = this.maricoins >= 100;
    
    // Mitad del camino
    this.achievements[3].unlocked = this.currentLevel >= 3;
    
    // Maestro del juego
    this.achievements[4].unlocked = this.completedLevels >= this.totalLevels;
    
    // Lingüista (este es más complejo y requeriría lógica adicional)
    // Por ahora lo dejamos como está
  }
  
  isLetterRevealed(levelIndex: number, letter: string): boolean {
    if (levelIndex >= 0 && levelIndex < this.levels.length) {
      return this.levels[levelIndex].unlockedLetters.includes(letter);
    }
    return false;
  }
}
