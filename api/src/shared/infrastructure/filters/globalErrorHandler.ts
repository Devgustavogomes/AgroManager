import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { BaseError } from 'src/shared/domain/errors/baseError';
import { PinoLogger } from 'nestjs-pino';
import { AuthenticatedRequest } from 'src/shared/application/types/authenticatedRequest';

@Catch()
export class GlobalErrorHandler extends BaseExceptionFilter {
  constructor(
    private readonly logger: PinoLogger,
    httpAdapterHost: HttpAdapterHost,
  ) {
    super(httpAdapterHost.httpAdapter);
    this.logger.setContext(GlobalErrorHandler.name);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<AuthenticatedRequest>();

    const isBusinessError =
      exception instanceof BaseError && exception.statusCode < 500;

    const logPayload = {
      err: exception,
      path: request.url,
      method: request.method,
      producerId: request.producer?.id ?? 'not authenticated',
    };

    if (isBusinessError) {
      this.logger.warn(logPayload, `Business error: ${exception.errorMessage}`);
    } else {
      this.logger.error(logPayload, 'Critical error');
    }

    if (exception instanceof BaseError) {
      const response = ctx.getResponse<Response>();
      const errorResponse = {
        statusCode: exception.statusCode,
        error: exception.errorName,
        message: exception.errorMessage,
      };

      return response.status(exception.statusCode).json(errorResponse);
    }

    super.catch(exception, host);
  }
}
