import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private isArabicSubject = new BehaviorSubject<boolean>(false);
  isArabic$ = this.isArabicSubject.asObservable();

  toggleLanguage() {
    this.isArabicSubject.next(!this.isArabicSubject.value);
  }

  get currentLanguage(): boolean {
    return this.isArabicSubject.value;
  }
}
