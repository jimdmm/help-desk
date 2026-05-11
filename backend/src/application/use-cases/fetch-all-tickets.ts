import { Injectable } from '@nestjs/common';
import type { Ticket } from '@/domain/entities/ticket';
import { TicketRepository } from '@/domain/ports/ticket-repository';

@Injectable()
export class FetchAllTicketsUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(): Promise<Ticket[]> {
    return this.ticketRepository.fetchAll();
  }
}
