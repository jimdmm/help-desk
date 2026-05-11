import { describe, it, expect, beforeEach } from 'vitest';
import { CreateTechnicianUseCase } from '@/application/use-cases/create-technician';
import { InMemoryTechnicianRepository } from '../repositories/in-memory-technician-repository';
import { FakeHasher } from '../cryptography/fake-hasher';
import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error';

describe('CreateTechnicianUseCase', () => {
	let technicianRepository: InMemoryTechnicianRepository;
	let hasher: FakeHasher;
	let sut: CreateTechnicianUseCase;

	beforeEach(() => {
		technicianRepository = new InMemoryTechnicianRepository();
		hasher = new FakeHasher();
		sut = new CreateTechnicianUseCase(technicianRepository, hasher);
	});

	it('should create a technician successfully', async () => {
		const result = await sut.execute({
			name: 'Jane Tech',
			email: 'jane@example.com',
			password: '123456',
			availability: ['08:00', '09:00'],
		});

		expect(result.isRight()).toBe(true);
		expect(technicianRepository.items).toHaveLength(1);
		expect(technicianRepository.items[0].name).toBe('Jane Tech');
	});

	it('should hash the password on creation', async () => {
		await sut.execute({
			name: 'Jane Tech',
			email: 'jane@example.com',
			password: '123456',
			availability: ['08:00'],
		});

		expect(technicianRepository.items[0].password).toBe('123456-hashed');
	});

	it('should use default availability when an empty array is provided', async () => {
		await sut.execute({
			name: 'Jane Tech',
			email: 'jane@example.com',
			password: '123456',
			availability: [],
		});

		expect(technicianRepository.items[0].availability.schedules.length).toBeGreaterThan(0);
	});

	it('should return UserAlreadyExistsError if email is already in use', async () => {
		await sut.execute({
			name: 'Jane Tech',
			email: 'jane@example.com',
			password: '123456',
			availability: ['08:00'],
		});

		const result = await sut.execute({
			name: 'Other Tech',
			email: 'jane@example.com',
			password: 'abcdef',
			availability: ['09:00'],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
	});
});
