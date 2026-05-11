import { describe, it, expect, beforeEach } from 'vitest';
import { CreateServiceUseCase } from '@/application/use-cases/create-service';
import { InMemoryServiceRepository } from '../repositories/in-memory-service-repository';

describe('CreateServiceUseCase', () => {
	let serviceRepository: InMemoryServiceRepository;
	let sut: CreateServiceUseCase;

	beforeEach(() => {
		serviceRepository = new InMemoryServiceRepository();
		sut = new CreateServiceUseCase(serviceRepository);
	});

	it('should create a service successfully', async () => {
		const result = await sut.execute({ name: 'Network Setup', price: 150 });

		expect(result.isRight()).toBe(true);
		expect(serviceRepository.items).toHaveLength(1);
		expect(serviceRepository.items[0].name).toBe('Network Setup');
		expect(serviceRepository.items[0].price.value).toBe(150);
	});

	it('should persist the service with a rounded price', async () => {
		const result = await sut.execute({ name: 'Repair', price: 99.999 });

		expect(result.isRight()).toBe(true);
		expect(serviceRepository.items[0].price.value).toBe(100);
	});
});
