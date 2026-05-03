import type { Optional } from '../core/@types/optional';
import { Entity } from '../core/entity';
import type { UniqueEntityId } from '../core/unique-entity-id';
import type { Money } from '../value-objects/money';

interface TicketServicesProps {
  serviceId: UniqueEntityId;
  serviceName: string;
  price: Money;
  createdAt: Date;
}

export class TicketServices extends Entity<TicketServicesProps> {
  private constructor(props: TicketServicesProps, id?: UniqueEntityId) {
    super(props, id);
  }

  static create(
    props: Optional<TicketServicesProps, 'createdAt'>,
    id?: UniqueEntityId,
  ): TicketServices {
    return new TicketServices(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  get serviceId() {
    return this.props.serviceId;
  }
  get serviceName() {
    return this.props.serviceName;
  }
  get price() {
    return this.props.price;
  }
  get createdAt() {
    return this.props.createdAt;
  }
}
