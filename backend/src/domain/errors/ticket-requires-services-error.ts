import { DomainError } from '../core/errors/domain-error';

export class TicketRequiresServicesError extends DomainError {
  constructor() {
    super('Ticket must have at least 1 Service.');
  }
}
