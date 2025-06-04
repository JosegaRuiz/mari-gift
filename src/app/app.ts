import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './navigation/navigation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navigation],
  template: `
    <app-navigation></app-navigation>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Mari-Gift';
}
