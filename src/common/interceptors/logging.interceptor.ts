/* eslint-disable prettier/prettier */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    private readonly logger = new Logger(LoggingInterceptor.name)
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, originalUrl, ip } = request;


    this.logger.log({
      message: 'Incoming request',
      method,
      path: originalUrl,  
      ip: ip || 'unknown',  
      timestamp: new Date().toISOString(),
      userAgent: request.headers['user-agent'] || 'not-provided',
    });

    return next.handle()
    .pipe(
      tap(() => {
        const responseTime = Date.now() - request['startTime'];
        this.logger.log({
          message: 'Request completed',
          status: response.status,
          path: originalUrl,
          duration: `${responseTime}ms`,
        });
      })
    );
  }
}