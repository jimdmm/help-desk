import type { Optional } from '../core/@types/optional';
import { Entity } from '../core/entity';
import type { UniqueEntityId } from '../core/unique-entity-id';
import { Availability } from '../value-objects/availability';

interface TechnicianProps {
  name: string;
  email: string;
  password: string;
  availability: Availability;
  profileImage?: string | undefined;
  createdAt: Date;
  updatedAt?: Date;
}

export class Technician extends Entity<TechnicianProps> {
  static create(
    props: Optional<TechnicianProps, 'createdAt'>,
    id?: UniqueEntityId,
  ): Technician {
    return new Technician(
      {
        ...props,
        availability: props.availability,
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
  get availability() {
    return this.props.availability;
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

  updateAvailability(schedules: string[]): void {
    this.props.availability = Availability.create(schedules);
    this.touch();
  }

  isAvailableAt(schedule: string): boolean {
    return this.props.availability.hasSchedule(schedule);
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
