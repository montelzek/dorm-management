import {Component, input, output} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {ThemeToggleComponent} from '../../ui/theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [
    NgOptimizedImage,
    ThemeToggleComponent
  ],
  templateUrl: './header.html',
  styles: []
})
export class HeaderComponent {

  userName = input('Guest');

  dormName = input('Main Hall');

  roomNumber = input('101');

  avatarUrl = input('/user-placeholder.svg');

  mobileMenuToggle = output<void>();

  toggleMobileMenu(): void {
    this.mobileMenuToggle.emit();
  }
}
