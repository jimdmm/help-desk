import { describe, it, expect, beforeEach } from 'vitest';
import { CreateClientUseCase } from '@/application/use-cases/create-client';
import { InMemoryClientRepository } from '../repositories/in-memory-client-repository';
import { FakeHasher } from '../cryptography/fake-hasher';
import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error';

describe('CreateClientUseCase', () => {
	let clientRepository: InMemoryClientRepository;
	let hasher: FakeHasher;
	let sut: CreateClientUseCase;

	beforeEach(() => {
		clientRepository = new InMemoryClientRepository();
		hasher = new FakeHasher();
		sut = new CreateClientUseCase(clientRepository, hasher);
	});

	it('should create a client successfully', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		expect(result.isRight()).toBe(true);
		expect(clientRepository.items).toHaveLength(1);
		expect(clientRepository.items[0].name).toBe('John Doe');
	});

	it('should hash the password on creation', async () => {
		await sut.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		expect(clientRepository.items[0].password).toBe('123456-hashed');
	});

	it('should return UserAlreadyExistsError if email is already in use', async () => {
		await sut.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
		});

		const result = await sut.execute({
			name: 'Other User',
			email: 'john@example.com',
			password: 'abcdef',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
	});
});
