import { describe, it, expect, beforeEach } from 'vitest';
import { FetchAllClientsUseCase } from '@/application/use-cases/fetch-all-clients';
import { InMemoryClientRepository } from '../repositories/in-memory-client-repository';
import { makeClient } from '../factories/make-client';

describe('FetchAllClientsUseCase', () => {
	let clientRepository: InMemoryClientRepository;
	let sut: FetchAllClientsUseCase;

	beforeEach(() => {
		clientRepository = new InMemoryClientRepository();
		sut = new FetchAllClientsUseCase(clientRepository);
	});

	it('should return all clients', async () => {
		await clientRepository.create(makeClient());
		await clientRepository.create(makeClient());

		const result = await sut.execute();

		expect(result).toHaveLength(2);
	});

	it('should return an empty array when there are no clients', async () => {
		const result = await sut.execute();

		expect(result).toHaveLength(0);
	});
});
