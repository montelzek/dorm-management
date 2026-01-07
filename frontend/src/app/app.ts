import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GlobalErrorComponent } from './shared/components/ui/global-error/global-error';
import { ToastComponent } from './shared/components/ui/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalErrorComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  protected readonly title = signal('frontend');

  ngOnInit(): void {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    this.translate.addLangs(['pl', 'en']);
    this.translate.setFallbackLang('pl');

    const savedLanguage = localStorage.getItem('app_language') || 'pl';
    this.translate.use(savedLanguage);
  }
}
