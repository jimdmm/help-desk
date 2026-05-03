import { DomainError } from '../core/errors/domain-error';

export class InvalidTransactionError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
