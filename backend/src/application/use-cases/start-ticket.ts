import { left, right } from '@/domain/core/either';
import { TicketRepository } from '@/domain/ports/ticket-repository';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import { NotAllowedError } from '@/application/errors/not-allowed-error';
import type {
	StartTicketUseCaseRequestDTO,
	StartTicketUseCaseResponseDTO,
} from '@/application/dtos/start-ticket-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StartTicketUseCase {
	constructor(private ticketRepository: TicketRepository) { }

	async execute({
		technicianId,
		ticketId,
	}: StartTicketUseCaseRequestDTO): Promise<StartTicketUseCaseResponseDTO> {
		const ticket = await this.ticketRepository.findById(ticketId);

		if (!ticket) return left(new ResourceNotFoundError('Ticket'));

		if (ticket.technicianId.toString() !== technicianId) {
			return left(new NotAllowedError());
		}

		ticket.updateStatus('IN_PROGRESS');

		await this.ticketRepository.save(ticket);

		return right({ ticket });
	}
}
