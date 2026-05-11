import { DomainError } from '@/domain/core/errors/domain-error';

export class ServiceAlreadyInactiveError extends DomainError {
  constructor() {
    super('Service is already inactive.');
  }
}
