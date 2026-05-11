import { describe, it, expect, beforeEach } from 'vitest';
import { AuthenticateUserUseCase } from '@/application/use-cases/authenticate-user';
import { InMemoryClientRepository } from '../repositories/in-memory-client-repository';
import { InMemoryTechnicianRepository } from '../repositories/in-memory-technician-repository';
import { FakeHasher } from '../cryptography/fake-hasher';
import { FakeEncrypter } from '../cryptography/fake-encrypter';
import { makeClient } from '../factories/make-client';
import { makeTechnician } from '../factories/make-technician';
import { InvalidCredentialsError } from '@/application/errors/invalid-credentials-error';

describe('AuthenticateUserUseCase', () => {
	let clientRepository: InMemoryClientRepository;
	let technicianRepository: InMemoryTechnicianRepository;
	let hasher: FakeHasher;
	let encrypter: FakeEncrypter;
	let sut: AuthenticateUserUseCase;

	beforeEach(() => {
		clientRepository = new InMemoryClientRepository();
		technicianRepository = new InMemoryTechnicianRepository();
		hasher = new FakeHasher();
		encrypter = new FakeEncrypter();
		sut = new AuthenticateUserUseCase(
			clientRepository,
			technicianRepository,
			hasher,
			encrypter,
		);
	});

	it('should authenticate a client and return an access token', async () => {
		const client = makeClient({ email: 'client@example.com', password: '123456-hashed' });
		await clientRepository.create(client);

		const result = await sut.execute({
			email: 'client@example.com',
			password: '123456',
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			const payload = JSON.parse(result.value.accessToken);
			expect(payload.role).toBe('CLIENT');
			expect(payload.sub).toBe(client.id.toString());
		}
	});

	it('should authenticate a technician and return an access token', async () => {
		const technician = makeTechnician({ email: 'tech@example.com', password: '123456-hashed' });
		await technicianRepository.create(technician);

		const result = await sut.execute({
			email: 'tech@example.com',
			password: '123456',
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			const payload = JSON.parse(result.value.accessToken);
			expect(payload.role).toBe('TECHNICIAN');
		}
	});

	it('should return InvalidCredentialsError if user does not exist', async () => {
		const result = await sut.execute({
			email: 'nobody@example.com',
			password: '123456',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidCredentialsError);
	});

	it('should return InvalidCredentialsError if password is wrong', async () => {
		const client = makeClient({ email: 'client@example.com', password: '123456-hashed' });
		await clientRepository.create(client);

		const result = await sut.execute({
			email: 'client@example.com',
			password: 'wrong-password',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidCredentialsError);
	});
});
