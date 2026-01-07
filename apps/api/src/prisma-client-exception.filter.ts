import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch()
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (this.isPrismaKnownError(exception)) {
      switch (exception.code) {
        case 'P2002':
          throw new HttpException(
            'Unique constraint violation',
            HttpStatus.CONFLICT,
          );

        case 'P2025':
          throw new HttpException(
            'No record was found for an update',
            HttpStatus.NOT_FOUND,
          );
      }
    }

    super.catch(exception, host);
  }

  private isPrismaKnownError(
    error: unknown,
  ): error is Prisma.PrismaClientKnownRequestError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as { code: unknown }).code === 'string'
    );
  }
}
