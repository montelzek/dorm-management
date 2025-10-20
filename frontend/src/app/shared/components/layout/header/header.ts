import {Component, input, output} from '@angular/core';
import {ThemeToggleComponent} from '../../ui/theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [
    ThemeToggleComponent
  ],
  templateUrl: './header.html',
  styles: []
})
export class HeaderComponent {

  userName = input('Guest');

  dormName = input('Main Hall');

  roomNumber = input('101');

  userInitials = input('GU');

  mobileMenuToggle = output<void>();

  toggleMobileMenu(): void {
    this.mobileMenuToggle.emit();
  }
}
