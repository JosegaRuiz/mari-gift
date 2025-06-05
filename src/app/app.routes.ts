import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Game } from './game/game';
import { Store } from './store/store';
import { Progress } from './progress/progress';
import { Rules } from './rules/rules';
import { Victory } from './victory/victory';
import { Reset } from './reset/reset';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'game', component: Game },
  { path: 'store', component: Store },
  { path: 'progress', component: Progress },
  { path: 'rules', component: Rules },
  { path: 'victory', component: Victory },
  { path: 'reset-secret-123', component: Reset },
  { path: '**', redirectTo: 'home' } // Ruta para manejar URLs no encontradas
];