export class ErrorMonitoring {
  static captureError(error: Error | string, contextInfo: string = 'General Exception'): void {
    const errorMsg = typeof error === 'string' ? error : error.message;
    console.error(`[AKM Error Monitoring] [${contextInfo}]:`, errorMsg);
  }

  static setupGlobalHandlers(): void {
    window.addEventListener('error', (event) => {
      this.captureError(event.error || event.message, 'Global Window Error');
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason || 'Unhandled Promise Rejection', 'Unhandled Async Promise');
    });
  }
}

ErrorMonitoring.setupGlobalHandlers();
