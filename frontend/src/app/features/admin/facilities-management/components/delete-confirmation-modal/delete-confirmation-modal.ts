import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TranslateModule],
  templateUrl: './delete-confirmation-modal.html'
})
export class DeleteConfirmationModalComponent {
  readonly itemName = input.required<string>();
  readonly itemType = input.required<string>(); // 'building', 'room', 'resource'
  readonly cascadeWarning = input<string>(''); // e.g., "This will delete 5 rooms and 3 common spaces"
  readonly isLoading = input<boolean>(false);

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

