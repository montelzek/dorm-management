import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalErrorComponent } from './shared/components/ui/global-error/global-error';
import { ToastComponent } from './shared/components/ui/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalErrorComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('frontend');
}
