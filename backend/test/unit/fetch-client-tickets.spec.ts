import { describe, it, expect, beforeEach } from 'vitest'
import { FetchClientTicketsUseCase } from '@/application/use-cases/fetch-client-tickets'
import { InMemoryTicketRepository } from '../repositories/in-memory-ticket-repository'
import { makeTicket } from '../factories/make-ticket'
import { UniqueEntityId } from '@/domain/core/unique-entity-id'

describe('FetchClientTicketsUseCase', () => {
	let ticketRepository: InMemoryTicketRepository
	let sut: FetchClientTicketsUseCase

	beforeEach(() => {
		ticketRepository = new InMemoryTicketRepository()
		sut = new FetchClientTicketsUseCase(ticketRepository)
	})

	it('should return only tickets belonging to the client', async () => {
		const clientId = new UniqueEntityId()
		await ticketRepository.create(makeTicket({ clientId }))
		await ticketRepository.create(makeTicket({ clientId }))
		await ticketRepository.create(makeTicket())

		const result = await sut.execute(clientId.toString(), { page: 1, limit: 20 })

		expect(result.items).toHaveLength(2)
		expect(result.total).toBe(2)
	})
})
