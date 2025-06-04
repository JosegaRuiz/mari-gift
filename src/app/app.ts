import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './navigation/navigation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navigation],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Mari-Gift';
}
