import type { Optional } from '../core/@types/optional';
import { Entity } from '../core/entity';
import type { UniqueEntityId } from '../core/unique-entity-id';
import {
  TicketStatus,
  type TicketStatusType,
} from '../value-objects/ticketStatus';
import { TicketServices } from './ticket-services';
import { TicketServicesList } from './ticket-services-list';
import { TicketAlreadyClosedError } from '../errors/ticket-already-closed-error';
import { TicketRequiresServicesError } from '../errors/ticket-requires-services-error';

interface TicketProps {
  clientId: UniqueEntityId;
  technicianId: UniqueEntityId;
  title: string;
  description: string;
  status: TicketStatus;
  services: TicketServicesList;
  createdAt: Date;
  updatedAt?: Date;
}

export class Ticket extends Entity<TicketProps> {
  private constructor(props: TicketProps, id?: UniqueEntityId) {
    super(props, id);
  }

  static create(
    props: Optional<TicketProps, 'createdAt' | 'status'>,
    id?: UniqueEntityId,
  ): Ticket {
    const services = props.services ?? new TicketServicesList();

    if (services.getItems().length === 0) {
      throw new TicketRequiresServicesError();
    }

    return new Ticket(
      {
        clientId: props.clientId,
        technicianId: props.technicianId,
        title: props.title,
        description: props.description,
        status: props.status ?? TicketStatus.create(),
        services,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  get clientId() {
    return this.props.clientId;
  }
  get technicianId() {
    return this.props.technicianId;
  }
  get status() {
    return this.props.status;
  }
  get services(): TicketServicesList {
    return this.props.services;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get title() {
    return this.props.title;
  }
  get description() {
    return this.props.description;
  }

  get total(): number {
    const cents = this.props.services.getItems().reduce(
      (acc, cs) => acc + Math.round(cs.price.value * 100),
      0,
    );
    return cents / 100;
  }

  set title(value: string) {
    if (this.props.status.isClosed()) {
      throw new TicketAlreadyClosedError();
    }
    this.props.title = value;
    this.touch();
  }

  set status(value: TicketStatus) {
    if (value.isClosed() && this.props.services.getItems().length === 0) {
      throw new TicketRequiresServicesError();
    }
    this.props.status = value;
    this.touch();
  }

  set description(value: string) {
    if (this.props.status.isClosed()) {
      throw new TicketAlreadyClosedError();
    }
    this.props.description = value;
    this.touch();
  }

  addService(service: TicketServices): void {
    if (this.props.status.isClosed()) {
      throw new TicketAlreadyClosedError();
    }

    this.props.services.add(service);
    this.touch();
  }

  removeService(service: TicketServices): void {
    if (this.props.status.isClosed()) {
      throw new TicketAlreadyClosedError();
    }

    this.props.services.remove(service);
    this.touch();
  }

  updateStatus(next: TicketStatusType): void {
    this.props.status = this.props.status.transitionTo(next);
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
