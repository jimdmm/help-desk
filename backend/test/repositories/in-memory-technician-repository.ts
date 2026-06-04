import type { PaginatedResult, PaginationParams } from '@/application/dtos/pagination-dto'
import { TechnicianRepository } from '@/domain/ports/technician-repository'
import { Technician } from '@/domain/entities/technician'

export class InMemoryTechnicianRepository implements TechnicianRepository {
	public items: Technician[] = []

	async create(technician: Technician): Promise<void> {
		this.items.push(technician)
	}

	async findById(id: string): Promise<Technician | null> {
		return this.items.find((t) => t.id.toString() === id) ?? null
	}

	async findByEmail(email: string): Promise<Technician | null> {
		return this.items.find((t) => t.email === email) ?? null
	}

	async fetchAll({ page, limit }: PaginationParams): Promise<PaginatedResult<Technician>> {
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

	async save(technician: Technician): Promise<void> {
		const index = this.items.findIndex((t) => t.id.equals(technician.id))
		if (index >= 0) this.items[index] = technician
	}

	async delete(id: string): Promise<void> {
		this.items = this.items.filter((t) => t.id.toString() !== id)
	}
}
