import { SystemLogService } from '../modules/systemLog';
import { schema } from '../db';
import { FastifyRequest } from 'fastify';

export abstract class BaseService {
  protected readonly systemLogService = new SystemLogService();

  protected serviceName: string = '';

  private log(logLevel: keyof typeof schema.LogLevel, action: string, data: any, request?: FastifyRequest) {
    void this.systemLogService.logEvent({
      logLevel,
      data,
      eventType: `${this.serviceName}/${action}`,
    }, request);
  };

  protected logError(action: string, data: any, request?: FastifyRequest) {
    void this.log(schema.LogLevel.ERROR, action, data, request);
  };

  protected logInfo(action: string, data: any, request?: FastifyRequest) {
    void this.log(schema.LogLevel.INFO, action, data, request);
  };

  protected logSuccess(action: string, data: any, request?: FastifyRequest) {
    void this.log(schema.LogLevel.SUCCESS, action, data, request);
  };

  protected logWarning(action: string, data: any, request?: FastifyRequest) {
    void this.log(schema.LogLevel.WARNING, action, data, request);
  };

  protected logDebug(action: string, data: any, request?: FastifyRequest) {
    void this.log(schema.LogLevel.DEBUG, action, data, request);
  };

  protected logCritical(action: string, data: any, request?: FastifyRequest) {
    void this.log(schema.LogLevel.CRITICAL, action, data, request);
  };
}
