import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  imports: [],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.css'
})
export class LanguageSelectorComponent {
  private readonly translate = inject(TranslateService);

  get currentLanguage(): string {
    return this.translate.currentLang || 'pl';
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage === 'pl' ? 'en' : 'pl';
    this.translate.use(newLang);
    localStorage.setItem('app_language', newLang);
  }

  isPolish(): boolean {
    return this.currentLanguage === 'pl';
  }

  isEnglish(): boolean {
    return this.currentLanguage === 'en';
  }
}
