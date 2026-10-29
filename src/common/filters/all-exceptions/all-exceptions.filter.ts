import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    let messages: string[] = ['An unexpected error occured'];

    // kung ang exception response kay string
    if (typeof exceptionResponse === 'string') {
      // i store exception response , usa sa index/object sa array messages na variable
      messages = [exceptionResponse];
    } else if (
      // if dele kani string ang exception response pero object siya + dele syah null + naay value ang message sulod sa object name sa exceptionResponse
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      // i store ang exceptionResponse.message isip rawMessage
      const rawMessage = (exceptionResponse as { message: unknown }).message;

      // Array ang rawMessage na value ? If oo, i map ang value nya i type cast as string , if dele syah array, usa ra ka value den i typecast ra ang value to String
      messages = Array.isArray(rawMessage)
        ? rawMessage.map(String)
        : [String(rawMessage)];
    }
    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} -> ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} -> ${status}: ${messages.join(', ')}`,
      );
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      messages,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
