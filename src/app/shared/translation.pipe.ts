import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Ensure the pipe is impure so it recalculates on every change detection
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(key: string): Observable<string> {
    // Return an observable that emits the translated value
    return this.translationService.currentLang$.pipe(
      map(() => this.translationService.getTranslation(key)),
      catchError(() => of(key)) // Fallback to the key if translation fails
    );
  }
}
