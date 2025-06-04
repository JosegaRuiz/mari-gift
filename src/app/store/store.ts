import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';

interface StoreItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store.html',
  styleUrl: './store.scss'
})
export class Store implements OnInit, OnDestroy {
  maricoins: number = 0;
  bonusAvailable: boolean = true;
  nextBonusTime: string = '24:00:00';
  message: string = '';
  
  storeItems: StoreItem[] = [
    {
      id: 1,
      name: 'Pista Extra',
      description: 'Recibe una pista adicional para el nivel actual',
      price: 30
    },
    {
      id: 2,
      name: 'Letra Gratis',
      description: 'Desbloquea una letra aleatoria sin coste',
      price: 25
    },
    {
      id: 3,
      name: 'Bonus de Coins',
      description: 'Recibe 20 MariCoins adicionales',
      price: 50
    },
    {
      id: 4,
      name: 'Saltar Nivel',
      description: 'Avanza al siguiente nivel automáticamente',
      price: 100
    }
  ];
  
  private subscriptions: Subscription[] = [];
  
  constructor(private gameService: GameService) {}
  
  private timerInterval: any;

  ngOnInit() {
    // Suscribirse a los cambios en el estado del juego
    this.subscriptions.push(
      this.gameService.maricoins$.subscribe((coins: number) => {
        this.maricoins = coins;
      })
    );
    
    this.checkDailyBonus();
    
    // Actualizar el temporizador cada segundo
    this.timerInterval = setInterval(() => {
      if (!this.bonusAvailable) {
        this.updateBonusTimer();
      }
    }, 1000);
  }
  
  ngOnDestroy() {
    // Cancelar todas las suscripciones al destruir el componente
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Limpiar el intervalo
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  
  checkDailyBonus() {
    // Comprobar si estamos en el navegador
    if (!this.isBrowser()) {
      this.bonusAvailable = false;
      return;
    }
    
    // Comprobar si el usuario ya ha reclamado el bonus hoy
    const lastClaimDate = localStorage.getItem('lastBonusClaim');
    
    if (lastClaimDate) {
      const lastDate = new Date(lastClaimDate);
      const today = new Date();
      
      // Comprobar si la última reclamación fue hoy
      const isSameDay = 
        lastDate.getDate() === today.getDate() &&
        lastDate.getMonth() === today.getMonth() &&
        lastDate.getFullYear() === today.getFullYear();
      
      this.bonusAvailable = !isSameDay;
    } else {
      this.bonusAvailable = true;
    }
    
    this.updateBonusTimer();
  }
  
  updateBonusTimer() {
    if (!this.bonusAvailable) {
      // Si ya se reclamó hoy, mostrar tiempo hasta mañana
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeLeft = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      this.nextBonusTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      this.nextBonusTime = 'Disponible ahora';
    }
  }
  
  // Verificar si estamos en el navegador
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
  
  claimDailyBonus() {
    if (this.bonusAvailable) {
      const bonusAmount = 25;
      this.gameService.updateMaricoins(bonusAmount);
      this.bonusAvailable = false;
      this.message = `¡Has reclamado tu bonus diario de ${bonusAmount} MariCoins!`;
      
      // Guardar la fecha del último reclamo
      if (this.isBrowser()) {
        localStorage.setItem('lastBonusClaim', new Date().toISOString());
      }
      
      // Actualizar el temporizador
      this.updateBonusTimer();
      
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
  
  purchaseItem(item: StoreItem) {
    if (this.maricoins >= item.price) {
      this.gameService.updateMaricoins(-item.price);
      
      // Aplicar el efecto del item según su ID
      switch(item.id) {
        case 1: // Pista Extra
          // Aquí implementaríamos la lógica para mostrar una pista adicional
          break;
        case 2: // Letra Gratis
          // Desbloquear una letra aleatoria
          // (Esta lógica debería estar en el componente de juego)
          break;
        case 3: // Bonus de Coins
          this.gameService.updateMaricoins(20);
          break;
        case 4: // Saltar Nivel
          if (this.gameService.currentLevel < this.gameService.totalLevels) {
            this.gameService.completeCurrentLevel();
          }
          break;
      }
      
      this.message = `¡Has comprado ${item.name}!`;
      
      setTimeout(() => {
        this.message = '';
      }, 3000);
    } else {
      this.message = 'No tienes suficientes MariCoins para comprar este item.';
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
}
