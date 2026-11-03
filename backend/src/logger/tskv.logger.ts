import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private format(
    level: string,
    message: any,
    ...optionalParams: any[]
  ): string {
    const fields: Record<string, string> = {
      level,
      message: this.stringify(message),
    };

    // Добавляем optionalParams как отдельные поля (если это объекты) или как один массив
    optionalParams.forEach((param, index) => {
      if (
        typeof param === 'object' &&
        param !== null &&
        !Array.isArray(param)
      ) {
        Object.entries(param).forEach(([key, value]) => {
          fields[key] = this.stringify(value);
        });
      } else {
        fields[`param${index}`] = this.stringify(param);
      }
    });

    return Object.entries(fields)
      .map(([key, value]) => `${key}=${value}`)
      .join('\t');
  }

  private stringify(value: any): string {
    if (typeof value === 'string') return value;
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.format('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.format('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.format('warn', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.format('debug', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.format('verbose', message, ...optionalParams));
  }
}
