import type { Optional } from '../core/@types/optional';
import { Entity } from '../core/entity';
import type { UniqueEntityId } from '../core/unique-entity-id';
import type { Money } from '../value-objects/money';

interface ServiceProps {
  name: string;
  price: Money;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Service extends Entity<ServiceProps> {
  static create(
    props: Optional<ServiceProps, 'createdAt'>,
    id?: UniqueEntityId,
  ): Service {
    return new Service(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  get name() {
    return this.props.name;
  }
  get price() {
    return this.props.price;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get deletedAt() {
    return this.props.deletedAt;
  }
  get isActive() {
    return !this.props.deletedAt;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  set price(price: Money) {
    this.props.price = price;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  deactivate() {
    this.props.deletedAt = new Date();
    this.touch();
  }
}
