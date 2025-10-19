import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  imports: [CommonModule],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css'
})
export class FormFieldComponent {
  readonly label = input<string>('');
  readonly required = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly helpText = input<string>('');
  
}
