import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteClientUseCase } from '@/application/use-cases/delete-client';
import { InMemoryClientRepository } from '../repositories/in-memory-client-repository';
import { makeClient } from '../factories/make-client';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';

describe('DeleteClientUseCase', () => {
	let clientRepository: InMemoryClientRepository;
	let sut: DeleteClientUseCase;

	beforeEach(() => {
		clientRepository = new InMemoryClientRepository();
		sut = new DeleteClientUseCase(clientRepository);
	});

	it('should delete a client successfully', async () => {
		const client = makeClient();
		await clientRepository.create(client);

		const result = await sut.execute({ clientId: client.id.toString() });

		expect(result.isRight()).toBe(true);
		expect(clientRepository.items).toHaveLength(0);
	});

	it('should return ResourceNotFoundError if client does not exist', async () => {
		const result = await sut.execute({ clientId: 'non-existent' });

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
