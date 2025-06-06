import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
      
      <div class="pdf-container" *ngIf="isBrowser">
        <object [data]="safePdfUrl" type="application/pdf" width="100%" height="600px">
          <p>Tu navegador no puede mostrar el PDF. 
            <a [href]="pdfUrl" download="Regalo.pdf">Descárgalo aquí</a>.</p>
        </object>
      </div>
      
      <div class="download-link">
        <p>Si no puedes ver el PDF, <a [href]="pdfUrl" download="Regalo.pdf">descárgalo aquí</a>.</p>
      </div>
      
      <div class="debug-info" *ngIf="isBrowser" style="margin-top: 20px; padding: 10px; background-color: #f5f5f5; border: 1px solid #ddd;">
        <h3>Información de depuración:</h3>
        <p>URL base: {{ baseUrl }}</p>
        <p>URL del PDF: {{ pdfUrl }}</p>
        <p>URL completa: {{ fullPdfUrl }}</p>
        <p>Ruta actual: {{ currentPath }}</p>
      </div>
    </div>
  `,
  styleUrl: './victory.scss'
})
export class Victory implements OnInit {
  isBrowser: boolean;
  pdfUrl: string = '';
  safePdfUrl!: SafeResourceUrl;
  baseUrl: string = '';
  fullPdfUrl: string = '';
  currentPath: string = '';
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  ngOnInit() {
    if (this.isBrowser) {
      // Información de depuración
      this.baseUrl = window.location.origin;
      this.currentPath = window.location.pathname;
      
      // Solución simple que funciona en ambos entornos
      this.pdfUrl = './assets/regalo.pdf';
      
      // URL completa para depuración
      this.fullPdfUrl = new URL(this.pdfUrl, window.location.href).href;
      
      // Para la visualización en el objeto, usar una URL absoluta
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.pdfUrl + '?t=' + new Date().getTime()
      );
      
      console.log('Información de depuración:');
      console.log('URL base:', this.baseUrl);
      console.log('URL del PDF:', this.pdfUrl);
      console.log('URL completa:', this.fullPdfUrl);
      console.log('Ruta actual:', this.currentPath);
      console.log('Href completo:', window.location.href);
    }
  }
}