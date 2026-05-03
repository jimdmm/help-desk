import { DomainError } from '../core/errors/domain-error';

export class InvalidMoneyValueError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
