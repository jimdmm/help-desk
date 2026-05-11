import type { Either } from '@/domain/core/either';
import type { Ticket } from '@/domain/entities/ticket';
import type { TicketStatusType } from '@/domain/value-objects/ticketStatus';
import type { ResourceNotFoundError } from '../errors/resource-not-found-error';

export interface EditTicketStatusUseCaseRequestDTO {
  ticketId: string;
  status: TicketStatusType;
}

export type EditTicketStatusUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  { ticket: Ticket }
>;
