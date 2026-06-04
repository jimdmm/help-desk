import { describe, it, expect, beforeEach } from 'vitest'
import { FetchTechnicianTicketsUseCase } from '@/application/use-cases/fetch-technician-tickets'
import { InMemoryTicketRepository } from '../repositories/in-memory-ticket-repository'
import { makeTicket } from '../factories/make-ticket'
import { UniqueEntityId } from '@/domain/core/unique-entity-id'

describe('FetchTechnicianTicketsUseCase', () => {
	let ticketRepository: InMemoryTicketRepository
	let sut: FetchTechnicianTicketsUseCase

	beforeEach(() => {
		ticketRepository = new InMemoryTicketRepository()
		sut = new FetchTechnicianTicketsUseCase(ticketRepository)
	})

	it('should return only tickets assigned to the technician', async () => {
		const technicianId = new UniqueEntityId()
		await ticketRepository.create(makeTicket({ technicianId }))
		await ticketRepository.create(makeTicket({ technicianId }))
		await ticketRepository.create(makeTicket())

		const result = await sut.execute(technicianId.toString(), { page: 1, limit: 20 })

		expect(result.items).toHaveLength(2)
		expect(result.total).toBe(2)
	})
})
