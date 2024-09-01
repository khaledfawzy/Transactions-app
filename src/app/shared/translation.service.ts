import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = new BehaviorSubject<string>('en'); // اللغة الافتراضية
  currentLang$ = this.currentLang.asObservable();

  private translations: { [key: string]: string } = {}; // تخزين النصوص المترجمة هنا

  constructor(private http: HttpClient) {}

  setLanguage(lang: string): void {
    this.currentLang.next(lang);
    this.loadTranslations(lang);
  }

  private loadTranslations(lang: string): void {
    const path = `assets/i18n/${lang}.json`;
    this.http.get<{ [key: string]: string }>(path).subscribe({
      next: (translations) => {
        this.translations = translations;
      },
      error: (err) => {
        console.error(`Error loading translations for language ${lang}:`, err);
      }
    });
  }

  getTranslation(key: string): string {
    return this.translations[key] || key; // إرجاع الترجمة أو المفتاح نفسه إذا لم يتم العثور على الترجمة
  }
}
