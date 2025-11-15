import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly fullWidth = input<boolean>(false);

  readonly click = output<Event>();

  onClick(event: Event): void {
    event.stopPropagation(); // Zatrzymaj propagację do rodzica
    if (!this.disabled() && !this.loading()) {
      this.click.emit(event);
    }
  }

  get buttonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
    
    const variantClasses = {
      primary: 'bg-button-bg text-button-text hover:bg-button-hover focus:ring-button-focus-outline',
      secondary: 'bg-text-secondary text-card hover:bg-text-primary focus:ring-text-secondary',
      outline: 'border border-input-border bg-card text-text-primary hover:bg-background focus:ring-button-focus-outline',
      ghost: 'text-text-primary hover:bg-background focus:ring-button-focus-outline',
      danger: 'bg-error-text text-card hover:bg-red-700 focus:ring-error-text'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const widthClass = this.fullWidth() ? 'w-full' : '';

    return `${baseClasses} ${variantClasses[this.variant()]} ${sizeClasses[this.size()]} ${widthClass}`;
  }
}
