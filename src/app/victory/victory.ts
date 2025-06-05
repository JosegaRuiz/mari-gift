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
    </div>
  `,
  styleUrl: './victory.scss'
})
export class Victory implements OnInit {
  isBrowser: boolean;
  pdfUrl: string = '';
  safePdfUrl!: SafeResourceUrl;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sanitizer: DomSanitizer
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  ngOnInit() {
    if (this.isBrowser) {
      // Usar una ruta absoluta desde la raíz del proyecto
      this.pdfUrl = `/assets/regalo.pdf?t=${new Date().getTime()}`;
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
    }
  }
}