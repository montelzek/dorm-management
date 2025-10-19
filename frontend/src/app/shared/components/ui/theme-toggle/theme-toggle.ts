import {Component, inject} from '@angular/core';
import {ThemeService} from '../../../../core/services/theme';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  imports: [
    NgClass
  ],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css'
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
