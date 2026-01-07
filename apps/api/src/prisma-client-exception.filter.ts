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
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
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
}
