import type { Either } from '@/domain/core/either';
import type { Ticket } from '@/domain/entities/ticket';
import type { ResourceNotFoundError } from '../errors/resource-not-found-error';
import type { NotAllowedError } from '../errors/not-allowed-error';

export interface StartTicketUseCaseRequestDTO {
  technicianId: string;
  ticketId: string;
}

export type StartTicketUseCaseResponseDTO = Either<
  ResourceNotFoundError | NotAllowedError,
  { ticket: Ticket }
>;
