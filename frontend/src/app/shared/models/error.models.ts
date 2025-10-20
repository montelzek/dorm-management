export interface AppError {
  id: string;
  message: string;
  timestamp: Date;
  severity: ErrorSeverity;
}

export type ErrorSeverity = 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}
