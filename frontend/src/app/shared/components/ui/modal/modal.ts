import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.html',
  styles: []
})
export class ModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly title = input<string>('');
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly closable = input<boolean>(true);

  readonly close = output<void>();

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && this.closable()) {
      this.close.emit();
    }
  }

  onCloseClick(): void {
    if (this.closable()) {
      this.close.emit();
    }
  }

  get sizeClasses(): string {
    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    };
    return sizes[this.size()];
  }
}
