import { Injectable } from '@nestjs/common';
import type { Ticket } from '@/domain/entities/ticket';
import { TicketRepository } from '@/domain/ports/ticket-repository';

@Injectable()
export class FetchTechnicianTicketsUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(technicianId: string): Promise<Ticket[]> {
    return this.ticketRepository.fetchByTechnicianId(technicianId);
  }
}
