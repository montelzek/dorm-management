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
  readonly avatarUrl = input<string>('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop');
  

  get userName(): string {
    const user = this.user();
    if (!user?.firstName || !user?.lastName) return 'Guest';
    return `${user.firstName} ${user.lastName}`;
  }

  get dormName(): string {
    return this.user()?.building?.name ?? 'Brak budynku';
  }

  get roomNumber(): string {
    return this.user()?.room?.roomNumber ?? 'Brak pokoju';
  }
}
