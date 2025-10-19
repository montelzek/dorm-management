export interface AppError {
  id: string;
  message: string;
  code?: string;
  timestamp: Date;
  severity: ErrorSeverity;
  field?: string;
}

export type ErrorSeverity = 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  code?: string;
  duration: number;
}
