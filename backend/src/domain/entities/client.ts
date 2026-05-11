import type { Optional } from '../core/@types/optional';
import { Entity } from '../core/entity';
import type { UniqueEntityId } from '../core/unique-entity-id';

interface ClientProps {
  name: string;
  email: string;
  password: string;
  profileImage?: string | undefined;
  createdAt: Date;
  updatedAt?: Date;
}

export class Client extends Entity<ClientProps> {
  static create(
    props: Optional<ClientProps, 'createdAt'>,
    id?: UniqueEntityId,
  ): Client {
    return new Client(
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
  get email() {
    return this.props.email;
  }
  get password() {
    return this.props.password;
  }
  get profileImage(): string | undefined {
    return this.props.profileImage;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  set profileImage(profileImage: string) {
    this.props.profileImage = profileImage;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

}
