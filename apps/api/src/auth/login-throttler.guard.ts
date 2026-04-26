import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected getErrorMessage(): Promise<string> {
    return Promise.resolve(
      'Previše pokušaja prijave. Pokušajte ponovno za minutu.',
    );
  }
}
