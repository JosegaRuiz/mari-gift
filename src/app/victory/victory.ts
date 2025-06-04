import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-victory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="victory-container">
      <h1>¡Felicidades!</h1>
      <p class="subtitle">Has completado todos los niveles</p>
      
      <div class="message">
        <p>Aquí está tu regalo especial:</p>
      </div>
      
      <div class="pdf-container">
        <!-- Usando embed para mejor compatibilidad -->
        <embed src="assets/regalo.pdf" type="application/pdf" width="100%" height="600px">
      </div>
      
      <div class="download-link">
        <p>Si no puedes ver el PDF, <a href="assets/regalo.pdf" download="Regalo.pdf">descárgalo aquí</a>.</p>
      </div>
    </div>
  `,
  styleUrl: './victory.scss'
})
export class Victory {}