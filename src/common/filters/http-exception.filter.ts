/* eslint-disable prettier/prettier */

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorMessages } from 'src/types/errors';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
    
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : ErrorMessages.INTERNAL_SERVER_ERROR;

    this.logger.error({
        message: 'Exception caught',
        statusCode: status,
        error: exception.message,
        stack: exception instanceof Error ? exception.stack : undefined,
        path: request.url,
        timestamp: new Date().toISOString(),
    });

    response
      .status(status)
      .json({
        statusCode: status,
        message
      });
  }
}
