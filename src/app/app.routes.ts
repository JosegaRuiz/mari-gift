import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Game } from './game/game';
import { Store } from './store/store';
import { Progress } from './progress/progress';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'game', component: Game },
  { path: 'store', component: Store },
  { path: 'progress', component: Progress },
  { path: '**', redirectTo: 'home' } // Ruta para manejar URLs no encontradas
];