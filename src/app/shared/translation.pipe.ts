import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'translate',
  standalone:true,
  pure: false // Ensure the pipe is impure so it recalculates on every change detection
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(key: string): Observable<string> {
    return this.translationService.currentLang$.pipe(
      map(() => this.translationService.getTranslation(key))
    );
  }
}
