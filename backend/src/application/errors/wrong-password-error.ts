import { DomainError } from '@/domain/core/errors/domain-error';

export class WrongPasswordError extends DomainError {
  constructor() {
    super('Wrong password');
  }
}
