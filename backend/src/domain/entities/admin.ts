import type { Optional } from '../core/@types/optional';
import { Entity } from '../core/entity';
import type { UniqueEntityId } from '../core/unique-entity-id';

interface AdminProps {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Admin extends Entity<AdminProps> {
  static create(
    props: Optional<AdminProps, 'createdAt'>,
    id?: UniqueEntityId,
  ): Admin {
    return new Admin(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );
  }

  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
  get password() {
    return this.props.password;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
