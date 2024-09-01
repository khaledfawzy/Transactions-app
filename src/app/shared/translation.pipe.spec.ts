import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {

  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const translation = this.translationService.getTranslation(key);
    // Handle both `null` and `undefined` cases
    return translation !== null && translation !== undefined ? translation : key;
  }
}
