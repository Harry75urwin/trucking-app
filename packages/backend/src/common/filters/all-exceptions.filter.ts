import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { status, message } = this.getStatusAndMessage(exception);

    const errorResponse = new ErrorResponseDto();
    errorResponse.statusCode = status;
    errorResponse.message = Array.isArray(message)
      ? message.join(', ')
      : String(message);
    errorResponse.timestamp = new Date().toISOString();

    response.status(status).json(errorResponse);
  }

  private getStatusAndMessage(exception: unknown): {
    status: number;
    message: string;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message || HttpException.name;
      return { status, message };
    }

    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }
}
