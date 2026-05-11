import { DomainError } from '@/domain/core/errors/domain-error';

export class NotAllowedError extends DomainError {
  constructor() {
    super('Not allowed.');
  }
}
