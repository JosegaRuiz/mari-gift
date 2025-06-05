import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService, GamePhase, GameLevel } from '../../services/game.service';
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
  currentPhaseId: number = 1;
  currentLevelId: string = "1.1";
  totalPhases: number = 0;
  totalLevels: number = 0;
  completedPhases: number = 0;
  completedLevels: number = 0;
  phases: GamePhase[] = [];
  
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
      description: 'Completaste la primera fase',
      icon: '🏆',
      unlocked: false
    },
    {
      id: 5,
      name: 'Maestro del Juego',
      description: 'Completaste todas las fases',
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
      
      this.gameService.currentPhaseId$.subscribe((phaseId: number) => {
        this.currentPhaseId = phaseId;
        this.updateAchievements();
      }),
      
      this.gameService.currentLevelId$.subscribe((levelId: string) => {
        this.currentLevelId = levelId;
        this.updateAchievements();
      }),
      
      this.gameService.phases$.subscribe((phases: GamePhase[]) => {
        this.phases = phases;
        this.updateProgress();
        this.updateAchievements();
      })
    );
    
    this.totalPhases = this.gameService.totalPhases;
    this.totalLevels = this.gameService.totalLevels;
    this.phases = this.gameService.phases;
    this.updateProgress();
    this.updateAchievements();
  }
  
  ngOnDestroy() {
    // Cancelar todas las suscripciones al destruir el componente
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  updateProgress() {
    this.completedPhases = this.gameService.completedPhases;
    this.completedLevels = this.gameService.completedLevels;
  }
  
  updateAchievements() {
    // Actualizar logros basados en el progreso actual
    
    // Primer nivel
    this.achievements[0].unlocked = this.completedLevels >= 1;
    
    // Coleccionista
    this.achievements[1].unlocked = this.maricoins >= 100;
    
    // Mitad del camino
    this.achievements[3].unlocked = this.completedPhases >= 1;
    
    // Maestro del juego
    this.achievements[4].unlocked = this.completedPhases >= this.totalPhases;
    
    // Lingüista (este es más complejo y requeriría lógica adicional)
    // Por ahora lo dejamos como está
  }
  
  // Obtener el nivel por su ID
  getLevel(phaseId: number, levelId: string): GameLevel | undefined {
    const phase = this.phases.find(p => p.id === phaseId);
    if (phase) {
      return phase.levels.find(l => l.id === levelId);
    }
    return undefined;
  }
  
  // Verificar si un nivel está completado
  isLevelCompleted(phaseId: number, levelId: string): boolean {
    const level = this.getLevel(phaseId, levelId);
    return level ? level.completed : false;
  }
  
  // Verificar si una fase está completada
  isPhaseCompleted(phaseId: number): boolean {
    const phase = this.phases.find(p => p.id === phaseId);
    return phase ? phase.completed : false;
  }
}