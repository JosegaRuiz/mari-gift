import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  standalone: true,
  template: `<p>Reseteando...</p>`,
})
export class Reset implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Borrar todo el localStorage
    localStorage.clear();
    console.log('LocalStorage borrado');
    
    // Recargar la aplicación
    window.location.href = '/';
  }
}