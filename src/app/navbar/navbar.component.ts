// src/app/navbar/navbar.component.ts

import { Component } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isArabic: boolean = false;

  constructor(private renderer: Renderer2) {}

  toggleDirection(): void {
    this.isArabic = !this.isArabic;
    const direction = this.isArabic ? 'rtl' : 'ltr';
    const textAlignment = this.isArabic ? 'text-right' : 'text-left';

    // Set the document's direction and text alignment
    this.renderer.setAttribute(document.documentElement, 'dir', direction);
    this.renderer.addClass(document.body, textAlignment);
    this.renderer.removeClass(document.body, this.isArabic ? 'text-left' : 'text-right');
  }
}
