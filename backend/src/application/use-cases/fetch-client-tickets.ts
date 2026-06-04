import { Injectable } from '@nestjs/common'
import type { PaginatedResult, PaginationParams } from '@/application/dtos/pagination-dto'
import type { Ticket } from '@/domain/entities/ticket'
import { TicketRepository } from '@/domain/ports/ticket-repository'

@Injectable()
export class FetchClientTicketsUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(clientId: string, params: PaginationParams): Promise<PaginatedResult<Ticket>> {
    return this.ticketRepository.fetchByClientId(clientId, params)
  }
}
