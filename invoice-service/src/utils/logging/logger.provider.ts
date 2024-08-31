import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomLoggerProvider {
  private colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
  };

  info(message: string) {
    console.log(`${this.colors.green}info${this.colors.reset}: ${message}`);
  }

  error(message: string, trace: string) {
    console.error(`${this.colors.red}${message}${this.colors.reset}`, trace);
  }

  warn(message: string) {
    console.warn(`${this.colors.yellow}${message}${this.colors.reset}`);
  }

  debug(message: string) {
    console.debug(`${this.colors.blue}debug${this.colors.reset}: ${message}`);
  }

  verbose(message: string) {
    console.debug(`${this.colors.blue}${message}${this.colors.reset}`);
  }

  logIncomingRequest(url: string) {
    this.info(`Incoming Request URL: ${url}`);
  }
}
