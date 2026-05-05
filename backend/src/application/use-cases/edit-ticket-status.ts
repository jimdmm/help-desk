import { left, right } from '@/domain/core/either';
import { TicketRepository } from '@/domain/ports/ticket-repository';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import type {
	EditTicketStatusUseCaseRequestDTO,
	EditTicketStatusUseCaseResponseDTO,
} from '@/application/dtos/edit-ticket-status-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EditTicketStatusUseCase {
	constructor(private ticketRepository: TicketRepository) { }

	async execute({
		ticketId,
		status,
	}: EditTicketStatusUseCaseRequestDTO): Promise<EditTicketStatusUseCaseResponseDTO> {
		const ticket = await this.ticketRepository.findById(ticketId);

		if (!ticket) return left(new ResourceNotFoundError('Ticket'));

		ticket.updateStatus(status);

		await this.ticketRepository.save(ticket);

		return right({ ticket });
	}
}
