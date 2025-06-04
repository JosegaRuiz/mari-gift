import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-victory',
  standalone: true,
  imports: [CommonModule, NgxExtendedPdfViewerModule],
  template: `
    <div class="victory-container">
      <h1>¡Felicidades!</h1>
      <p class="subtitle">Has completado todos los niveles</p>
      
      <div class="message">
        <p>Aquí está tu regalo especial:</p>
      </div>
      
      <div class="pdf-container" *ngIf="isBrowser">
        <ngx-extended-pdf-viewer
          [src]="pdfUrl"
          [height]="'600px'"
          [zoom]="'page-fit'"
        ></ngx-extended-pdf-viewer>
      </div>
      
      <div class="download-link">
        <p>Si no puedes ver el PDF, <a [href]="pdfUrl" download="Regalo.pdf">descárgalo aquí</a>.</p>
      </div>
    </div>
  `,
  styleUrl: './victory.scss'
})
export class Victory implements OnInit {
  isBrowser: boolean;
  pdfUrl: string = '';
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  ngOnInit() {
    if (this.isBrowser) {
      // Usar una ruta absoluta desde la raíz del proyecto
      this.pdfUrl = `/assets/regalo.pdf?t=${new Date().getTime()}`;
    }
  }
}