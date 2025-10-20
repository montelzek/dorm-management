import {Component, input, output, computed} from '@angular/core';
import {ThemeToggleComponent} from '../../ui/theme-toggle/theme-toggle';
import {UserInfo} from '../main-layout/main-layout';

@Component({
  selector: 'app-header',
  imports: [
    ThemeToggleComponent
  ],
  templateUrl: './header.html',
  styles: []
})
export class HeaderComponent {

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
    if (!user?.roles || user.roles.length === 0) return 'Resident';
    
    // Priority: Admin > Technician > Receptionist > Resident
    if (user.roles.includes('ROLE_ADMIN')) return 'Administrator';
    if (user.roles.includes('ROLE_TECHNICIAN')) return 'Technician';
    if (user.roles.includes('ROLE_RECEPTIONIST')) return 'Receptionist';
    
    return 'Resident';
  });

  readonly roleInfo = computed(() => {
    const user = this.user();
    const role = this.userRole();
    
    switch (role) {
      case 'Administrator':
        return {
          title: 'System Administrator',
          subtitle: 'Full system access',
          showBuildingInfo: false
        };
      case 'Technician':
        return {
          title: 'Maintenance Technician',
          subtitle: 'Equipment & maintenance',
          showBuildingInfo: false
        };
      case 'Receptionist':
        return {
          title: 'Reception Staff',
          subtitle: 'Guest services',
          showBuildingInfo: false
        };
      default: // Resident
        return {
          title: 'Resident',
          subtitle: user?.building?.name ?? 'No building',
          showBuildingInfo: true
        };
    }
  });

  readonly dormName = computed(() => {
    const user = this.user();
    return user?.building?.name ?? 'No building';
  });

  readonly roomNumber = computed(() => {
    const user = this.user();
    return user?.room?.roomNumber ?? 'No room';
  });

  toggleMobileMenu(): void {
    this.mobileMenuToggle.emit();
  }
}
