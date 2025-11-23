import {Component, input, output, computed, inject} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {ThemeToggleComponent} from '../../ui/theme-toggle/theme-toggle';
import {LanguageSelectorComponent} from '../../ui/language-selector/language-selector';
import {UserInfo} from '../main-layout/main-layout';

@Component({
  selector: 'app-header',
  imports: [
    TranslateModule,
    ThemeToggleComponent,
    LanguageSelectorComponent
  ],
  templateUrl: './header.html',
  styles: []
})
export class HeaderComponent {
  private readonly translate = inject(TranslateService);

  user = input<UserInfo | null>(null);

  mobileMenuToggle = output<void>();

  // Computed properties based on user role
  readonly userName = computed(() => {
    const user = this.user();
    if (!user?.firstName || !user?.lastName) return 'Guest';
    return `${user.firstName} ${user.lastName}`;
  });

  readonly userInitials = computed(() => {
    const user = this.user();
    if (!user?.firstName || !user?.lastName) return 'GU';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  });

  readonly userRole = computed(() => {
    const user = this.user();
    if (!user?.role) return 'header.role.resident';
    
    switch (user.role) {
      case 'ROLE_ADMIN':
        return 'header.role.admin';
      case 'ROLE_TECHNICIAN':
        return 'header.role.technician';
      case 'ROLE_RECEPTIONIST':
        return 'header.role.receptionist';
      case 'ROLE_RESIDENT':
      default:
        return 'header.role.resident';
    }
  });

  readonly roleInfo = computed(() => {
    const user = this.user();
    if (!user?.role) {
      return {
        title: 'header.resident',
        subtitle: user?.building?.name ?? 'header.noBuilding',
        showBuildingInfo: true,
        subtitleIsKey: !user?.building?.name
      };
    }
    
    switch (user.role) {
      case 'ROLE_ADMIN':
        return {
          title: 'header.systemAdministrator',
          subtitle: 'header.fullSystemAccess',
          showBuildingInfo: false,
          subtitleIsKey: true
        };
      case 'ROLE_TECHNICIAN':
        return {
          title: 'header.maintenanceTechnician',
          subtitle: 'header.equipmentMaintenance',
          showBuildingInfo: false,
          subtitleIsKey: true
        };
      case 'ROLE_RECEPTIONIST':
        return {
          title: 'header.receptionStaff',
          subtitle: 'header.guestServices',
          showBuildingInfo: false,
          subtitleIsKey: true
        };
      default: // Resident
        return {
          title: 'header.resident',
          subtitle: user?.building?.name ?? 'header.noBuilding',
          showBuildingInfo: true,
          subtitleIsKey: !user?.building?.name
        };
    }
  });

  readonly dormName = computed(() => {
    const user = this.user();
    return user?.building?.name ?? 'header.noBuilding';
  });

  readonly isDormNameKey = computed(() => {
    const user = this.user();
    return !user?.building?.name;
  });

  readonly roomNumber = computed(() => {
    const user = this.user();
    return user?.room?.roomNumber ?? 'header.noRoom';
  });

  readonly isRoomNumberKey = computed(() => {
    const user = this.user();
    return !user?.room?.roomNumber;
  });

  toggleMobileMenu(): void {
    this.mobileMenuToggle.emit();
  }
}
