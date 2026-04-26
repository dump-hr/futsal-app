import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected async getErrorMessage(): Promise<string> {
    return 'Previše pokušaja prijave. Pokušajte ponovno za minutu.';
  }
}
