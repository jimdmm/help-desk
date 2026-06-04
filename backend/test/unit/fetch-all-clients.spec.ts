import { describe, it, expect, beforeEach } from 'vitest'
import { FetchAllClientsUseCase } from '@/application/use-cases/fetch-all-clients'
import { InMemoryClientRepository } from '../repositories/in-memory-client-repository'
import { makeClient } from '../factories/make-client'

describe('FetchAllClientsUseCase', () => {
	let clientRepository: InMemoryClientRepository
	let sut: FetchAllClientsUseCase

	beforeEach(() => {
		clientRepository = new InMemoryClientRepository()
		sut = new FetchAllClientsUseCase(clientRepository)
	})

	it('should return paginated clients', async () => {
		await clientRepository.create(makeClient())
		await clientRepository.create(makeClient())

		const result = await sut.execute({ page: 1, limit: 20 })

		expect(result.items).toHaveLength(2)
		expect(result.total).toBe(2)
		expect(result.totalPages).toBe(1)
	})

	it('should return empty result when there are no clients', async () => {
		const result = await sut.execute({ page: 1, limit: 20 })

		expect(result.items).toHaveLength(0)
		expect(result.total).toBe(0)
	})

	it('should respect pagination limits', async () => {
		for (let i = 0; i < 5; i++) {
			await clientRepository.create(makeClient())
		}

		const result = await sut.execute({ page: 1, limit: 3 })

		expect(result.items).toHaveLength(3)
		expect(result.total).toBe(5)
		expect(result.totalPages).toBe(2)
	})

	it('should return the correct page', async () => {
		for (let i = 0; i < 5; i++) {
			await clientRepository.create(makeClient())
		}

		const result = await sut.execute({ page: 2, limit: 3 })

		expect(result.items).toHaveLength(2)
		expect(result.page).toBe(2)
	})
})
