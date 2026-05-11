import { describe, it, expect, beforeEach } from 'vitest';
import { DeactivateServiceUseCase } from '@/application/use-cases/deactivate-service';
import { InMemoryServiceRepository } from '../repositories/in-memory-service-repository';
import { makeService } from '../factories/make-service';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import { ServiceAlreadyInactiveError } from '@/application/errors/service-already-inactive-error';

describe('DeactivateServiceUseCase', () => {
	let serviceRepository: InMemoryServiceRepository;
	let sut: DeactivateServiceUseCase;

	beforeEach(() => {
		serviceRepository = new InMemoryServiceRepository();
		sut = new DeactivateServiceUseCase(serviceRepository);
	});

	it('should deactivate a service successfully', async () => {
		const service = makeService();
		await serviceRepository.create(service);

		const result = await sut.execute({ serviceId: service.id.toString() });

		expect(result.isRight()).toBe(true);
		expect(serviceRepository.items[0].isActive).toBe(false);
	});

	it('should return ResourceNotFoundError if service does not exist', async () => {
		const result = await sut.execute({ serviceId: 'non-existent' });

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it('should return ServiceAlreadyInactiveError if service is already inactive', async () => {
		const service = makeService();
		service.deactivate();
		await serviceRepository.create(service);

		const result = await sut.execute({ serviceId: service.id.toString() });

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ServiceAlreadyInactiveError);
	});
});
