import { Injectable } from '@nestjs/common'
import type { PaginatedResult, PaginationParams } from '@/application/dtos/pagination-dto'
import type { Ticket } from '@/domain/entities/ticket'
import { TicketRepository } from '@/domain/ports/ticket-repository'

@Injectable()
export class FetchAllTicketsUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<Ticket>> {
    return this.ticketRepository.fetchAll(params)
  }
}
