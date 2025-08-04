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
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.log('exception message', exception.message);

    switch (exception.code) {
      case 'P2002':
        throw new HttpException(
          'Unique constraint violation',
          HttpStatus.CONFLICT,
        );
      default:
        super.catch(exception, host);
    }
  }
}
