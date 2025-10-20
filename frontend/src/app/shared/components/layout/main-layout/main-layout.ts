import { Component, input } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

export interface UserInfo {
  firstName?: string;
  lastName?: string;
  building?: { name?: string } | null;
  room?: { roomNumber?: string } | null;
  roles?: string[];
}

@Component({
  selector: 'app-main-layout',
  imports: [HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.html',
  styles: []
})
export class MainLayoutComponent {
  readonly user = input<UserInfo | null>(null);
  

}
