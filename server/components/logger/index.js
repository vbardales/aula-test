export default class Logger {
  constructor() {
    process.on('uncaughtException', err => this.error(`Uncaught exception: ${err.message}`, err));
    process.on('exit', code => {
      if (code === 0) {
        return;
      }
      this.error(`Exit with code: ${code}`);
    });
    process.on('unhandledRejection', err => this.error(`Unhandled rejection: ${err.message}`, err));
    process.on('rejectionHandled', err => this.error(`Rejection handled: ${err.message}`, err));
  }

  log(...args) {
    console.log(...args);
  }

  error(...args) {
    console.error(...args);
  }
}
