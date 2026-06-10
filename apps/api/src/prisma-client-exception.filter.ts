import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

type PrismaKnownErrorLike = {
  code: string;
};

@Catch()
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (this.isPrismaKnownError(exception)) {
      switch (exception.code) {
        case 'P2002':
          throw new HttpException(
            'Zapis s ovom vrijednošću već postoji',
            HttpStatus.CONFLICT,
          );

        case 'P2025':
          throw new HttpException(
            'Zapis nije pronađen',
            HttpStatus.NOT_FOUND,
          );

        case 'P2003':
          throw new HttpException(
            'Zapis je povezan s drugim podacima',
            HttpStatus.BAD_REQUEST,
          );
      }
    }

    super.catch(exception, host);
  }

  private isPrismaKnownError(error: unknown): error is PrismaKnownErrorLike {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as { code: unknown }).code === 'string'
    );
  }
}
