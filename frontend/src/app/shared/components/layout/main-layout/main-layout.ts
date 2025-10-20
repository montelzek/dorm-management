import { Component, input } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

export interface UserInfo {
  firstName?: string;
  lastName?: string;
  building?: { name?: string } | null;
  room?: { roomNumber?: string } | null;
}

@Component({
  selector: 'app-main-layout',
  imports: [HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.html',
  styles: []
})
export class MainLayoutComponent {
  readonly user = input<UserInfo | null>(null);
  

  get userName(): string {
    const user = this.user();
    if (!user?.firstName || !user?.lastName) return 'Guest';
    return `${user.firstName} ${user.lastName}`;
  }

  get userInitials(): string {
    const user = this.user();
    if (!user?.firstName || !user?.lastName) return 'GU';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  get dormName(): string {
    return this.user()?.building?.name ?? 'No building';
  }

  get roomNumber(): string {
    return this.user()?.room?.roomNumber ?? 'No room';
  }
}
