import type { PaginatedResult, PaginationParams } from '@/application/dtos/pagination-dto'
import { TicketRepository } from '@/domain/ports/ticket-repository'
import { Ticket } from '@/domain/entities/ticket'

export class InMemoryTicketRepository implements TicketRepository {
	public items: Ticket[] = []

	async create(ticket: Ticket): Promise<void> {
		this.items.push(ticket)
	}

	async findById(id: string): Promise<Ticket | null> {
		return this.items.find((t) => t.id.toString() === id) ?? null
	}

	async fetchAll({ page, limit }: PaginationParams): Promise<PaginatedResult<Ticket>> {
		const start = (page - 1) * limit
		const items = this.items.slice(start, start + limit)
		return {
			items,
			total: this.items.length,
			page,
			limit,
			totalPages: Math.ceil(this.items.length / limit),
		}
	}

	async fetchByTechnicianId(technicianId: string, { page, limit }: PaginationParams): Promise<PaginatedResult<Ticket>> {
		const filtered = this.items.filter((t) => t.technicianId.toString() === technicianId)
		const start = (page - 1) * limit
		return {
			items: filtered.slice(start, start + limit),
			total: filtered.length,
			page,
			limit,
			totalPages: Math.ceil(filtered.length / limit),
		}
	}

	async fetchByClientId(clientId: string, { page, limit }: PaginationParams): Promise<PaginatedResult<Ticket>> {
		const filtered = this.items.filter((t) => t.clientId.toString() === clientId)
		const start = (page - 1) * limit
		return {
			items: filtered.slice(start, start + limit),
			total: filtered.length,
			page,
			limit,
			totalPages: Math.ceil(filtered.length / limit),
		}
	}

	async save(ticket: Ticket): Promise<void> {
		const index = this.items.findIndex((t) => t.id.equals(ticket.id))
		if (index >= 0) this.items[index] = ticket
	}
}
