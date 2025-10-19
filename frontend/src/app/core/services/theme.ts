import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    this.loadTheme();

    effect(() => {
      this.updateTheme();
    });
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      this.isDarkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }

  private updateTheme() {
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  isDark(): boolean {
    return this.isDarkMode();
  }

  toggleTheme() {
    this.isDarkMode.set(!this.isDarkMode());
  }
}
