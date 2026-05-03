import type { Optional } from '../core/@types/optional';
import { Entity } from '../core/entity';
import type { UniqueEntityId } from '../core/unique-entity-id';
import { Availability } from '../value-objects/availability';

interface TechnicianProps {
  name: string;
  email: string;
  password: string;
  ticketsAssigned: string[];
  availability: Availability;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Technician extends Entity<TechnicianProps> {
  static create(
    props: Optional<TechnicianProps, 'createdAt'> & {
      availability?: string[];
    },
    id?: UniqueEntityId,
  ): Technician {
    return new Technician(
      {
        ...props,
        availability: props.availability
          ? Availability.create(props.availability)
          : Availability.createDefault(),
        ticketsAssigned: [],
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
  get ticketsAssigned() {
    return this.props.ticketsAssigned;
  }
  get availability() {
    return this.props.availability;
  }
  get profileImage() {
    return this.props.profileImage;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  updateAvailability(schedules: string[]): void {
    this.props.availability = Availability.create(schedules);
    this.touch();
  }

  isAvailableAt(schedule: string): boolean {
    return this.props.availability.hasSchedule(schedule);
  }

  assignToTicket(ticketId: string) {
    this.props.ticketsAssigned.push(ticketId);
  }

  unassignToTicket(ticketId: string): boolean {
    const ticketIndex = this.props.ticketsAssigned.findIndex(
      (id) => id === ticketId,
    );

    if (ticketIndex === -1) {
      return false;
    }

    this.props.ticketsAssigned.splice(ticketIndex, 1);
    return true;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
