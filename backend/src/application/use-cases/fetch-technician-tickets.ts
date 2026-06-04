import { Injectable } from '@nestjs/common'
import type { PaginatedResult, PaginationParams } from '@/application/dtos/pagination-dto'
import type { Ticket } from '@/domain/entities/ticket'
import { TicketRepository } from '@/domain/ports/ticket-repository'

@Injectable()
export class FetchTechnicianTicketsUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(technicianId: string, params: PaginationParams): Promise<PaginatedResult<Ticket>> {
    return this.ticketRepository.fetchByTechnicianId(technicianId, params)
  }
}
