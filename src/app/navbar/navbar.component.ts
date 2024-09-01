import { Component } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../shared/translation.service'; // Import the service
/* import { HttpClientModule } from '@angular/common/http'; */

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isArabic: boolean = false;

  constructor(private renderer: Renderer2, private translationService: TranslationService) {
    this.translationService.currentLang$.subscribe((lang) => {
      this.isArabic = lang === 'ar';
      this.updateDirection();
    });
  }

  toggleDirection(): void {
    const newLang = this.isArabic ? 'en' : 'ar';
    this.translationService.setLanguage(newLang);
  }

  private updateDirection(): void {
    const direction = this.isArabic ? 'rtl' : 'ltr';
    const textAlignment = this.isArabic ? 'text-right' : 'text-left';

    this.renderer.setAttribute(document.documentElement, 'dir', direction);
    this.renderer.addClass(document.body, textAlignment);
    this.renderer.removeClass(document.body, this.isArabic ? 'text-left' : 'text-right');
  }
}
