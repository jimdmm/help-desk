import { DomainError } from '@/domain/core/errors/domain-error';

export class ResourceNotFoundError extends DomainError {
  constructor(resource = 'Resource') {
    super(`${resource} not found.`);
  }
}
