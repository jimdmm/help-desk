import { Injectable } from '@nestjs/common';
import type { Ticket } from '@/domain/entities/ticket';
import { TicketRepository } from '@/domain/ports/ticket-repository';

@Injectable()
export class FetchClientTicketsUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(clientId: string): Promise<Ticket[]> {
    return this.ticketRepository.fetchByClientId(clientId);
  }
}
