import { left, right } from '@/domain/core/either';
import { TicketRepository } from '@/domain/ports/ticket-repository';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import { NotAllowedError } from '@/application/errors/not-allowed-error';
import type {
  CloseTicketUseCaseRequestDTO,
  CloseTicketUseCaseResponseDTO,
} from '@/application/dtos/close-ticket-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloseTicketUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute({
    technicianId,
    ticketId,
  }: CloseTicketUseCaseRequestDTO): Promise<CloseTicketUseCaseResponseDTO> {
    const ticket = await this.ticketRepository.findById(ticketId);

    if (!ticket) return left(new ResourceNotFoundError('Ticket'));

    if (ticket.technicianId.toString() !== technicianId) {
      return left(new NotAllowedError());
    }

    ticket.updateStatus('CLOSED');

    await this.ticketRepository.save(ticket);

    return right({ ticket });
  }
}
