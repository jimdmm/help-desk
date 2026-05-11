import { ValueObject } from '../core/value-object';
import { InvalidTransactionError } from '../errors/invalid-transaction-error';

export type TicketStatusType = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

const VALID_TRANSITIONS: Record<TicketStatusType, TicketStatusType[]> = {
  OPEN: ['IN_PROGRESS'],
  IN_PROGRESS: ['CLOSED'],
  CLOSED: [],
};

export class TicketStatus extends ValueObject<{ value: TicketStatusType }> {
  private constructor(props: { value: TicketStatusType }) {
    super(props);
  }

  static create(value: TicketStatusType = 'OPEN') {
    return new TicketStatus({ value });
  }

  get value() {
    return this.props.value;
  }

  transitionTo(next: TicketStatusType): TicketStatus {
    const allowed = VALID_TRANSITIONS[this.props.value];

    if (!allowed.includes(next)) {
      throw new InvalidTransactionError(
        `Invalid Transaction: ${this.props.value} → ${next}`,
      );
    }

    return new TicketStatus({ value: next });
  }

  isClosed() {
    return this.props.value === 'CLOSED';
  }
}
