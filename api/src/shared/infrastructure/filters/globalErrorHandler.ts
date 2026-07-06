import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { BaseError } from 'src/shared/domain/errors/baseError';

@Catch()
export class GlobalErrorHandler extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof BaseError) {
      const ctx = host.switchToHttp();
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
