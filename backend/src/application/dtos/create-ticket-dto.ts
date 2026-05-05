import type { Either } from '@/domain/core/either';
import type { Ticket } from '@/domain/entities/ticket';
import type { ResourceNotFoundError } from '../errors/resource-not-found-error';

export interface CreateTicketUseCaseRequestDTO {
	clientId: string;
	technicianId: string;
	title: string;
	description: string;
	serviceIds: string[];
}

export type CreateTicketUseCaseResponseDTO = Either<
	ResourceNotFoundError,
	{ ticket: Ticket }
>;
