import { describe, it, expect, beforeEach } from 'vitest';
import { EditClientUseCase } from '@/application/use-cases/edit-client';
import { InMemoryClientRepository } from '../repositories/in-memory-client-repository';
import { makeClient } from '../factories/make-client';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';

describe('EditClientUseCase', () => {
	let clientRepository: InMemoryClientRepository;
	let sut: EditClientUseCase;

	beforeEach(() => {
		clientRepository = new InMemoryClientRepository();
		sut = new EditClientUseCase(clientRepository);
	});

	it('should edit client name and email', async () => {
		const client = makeClient({ name: 'Old Name', email: 'old@example.com' });
		await clientRepository.create(client);

		const result = await sut.execute({
			clientId: client.id.toString(),
			name: 'New Name',
			email: 'new@example.com',
		});

		expect(result.isRight()).toBe(true);
		expect(clientRepository.items[0].name).toBe('New Name');
		expect(clientRepository.items[0].email).toBe('new@example.com');
	});

	it('should only update fields that are provided', async () => {
		const client = makeClient({ name: 'Old Name', email: 'old@example.com' });
		await clientRepository.create(client);

		await sut.execute({ clientId: client.id.toString(), name: 'New Name' });

		expect(clientRepository.items[0].name).toBe('New Name');
		expect(clientRepository.items[0].email).toBe('old@example.com');
	});

	it('should return ResourceNotFoundError if client does not exist', async () => {
		const result = await sut.execute({
			clientId: 'non-existent',
			name: 'New Name',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
