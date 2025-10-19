import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-message',
  imports: [CommonModule],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class MessageComponent {
  readonly message = input<string>('');
  readonly type = input<MessageType>('info');
  readonly dismissible = input<boolean>(false);

  get messageClasses(): string {
    const baseClasses = 'rounded-md p-4 text-sm ring-1';
    const typeClasses = {
      success: 'bg-green-100 text-green-800 ring-green-200',
      error: 'bg-red-100 text-red-800 ring-red-200',
      warning: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
      info: 'bg-blue-100 text-blue-800 ring-blue-200'
    };
    
    return `${baseClasses} ${typeClasses[this.type()]}`;
  }
}
