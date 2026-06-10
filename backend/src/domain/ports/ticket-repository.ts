import type { PaginatedResult, PaginationParams } from '@/domain/core/pagination'
import type { Ticket } from '../entities/ticket'

export abstract class TicketRepository {
  abstract create(ticket: Ticket): Promise<void>
  abstract findById(id: string): Promise<Ticket | null>
  abstract fetchAll(params: PaginationParams): Promise<PaginatedResult<Ticket>>
  abstract fetchByTechnicianId(technicianId: string, params: PaginationParams): Promise<PaginatedResult<Ticket>>
  abstract fetchByClientId(clientId: string, params: PaginationParams): Promise<PaginatedResult<Ticket>>
  abstract save(ticket: Ticket): Promise<void>
}
