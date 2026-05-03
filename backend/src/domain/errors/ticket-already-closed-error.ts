import { DomainError } from '../core/errors/domain-error';

export class TicketAlreadyClosedError extends DomainError {
  constructor() {
    super('Cannot add services to a closed ticket.');
  }
}
