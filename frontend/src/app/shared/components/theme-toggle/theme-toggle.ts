import {Component, inject} from '@angular/core';
import {ThemeService} from '../../../core/theme.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  imports: [
    NgClass
  ],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css'
})
export class ThemeToggle {
  themeService = inject(ThemeService);
}
