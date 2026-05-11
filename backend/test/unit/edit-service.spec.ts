import { describe, it, expect, beforeEach } from 'vitest';
import { EditServiceUseCase } from '@/application/use-cases/edit-service';
import { InMemoryServiceRepository } from '../repositories/in-memory-service-repository';
import { makeService } from '../factories/make-service';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';

describe('EditServiceUseCase', () => {
	let serviceRepository: InMemoryServiceRepository;
	let sut: EditServiceUseCase;

	beforeEach(() => {
		serviceRepository = new InMemoryServiceRepository();
		sut = new EditServiceUseCase(serviceRepository);
	});

	it('should edit service name and price', async () => {
		const service = makeService({ name: 'Old Service' });
		await serviceRepository.create(service);

		const result = await sut.execute({
			serviceId: service.id.toString(),
			name: 'New Service',
			price: 200,
		});

		expect(result.isRight()).toBe(true);
		expect(serviceRepository.items[0].name).toBe('New Service');
		expect(serviceRepository.items[0].price.value).toBe(200);
	});

	it('should only update fields that are provided', async () => {
		const service = makeService({ name: 'Old Service' });
		await serviceRepository.create(service);

		await sut.execute({ serviceId: service.id.toString(), name: 'New Service' });

		expect(serviceRepository.items[0].name).toBe('New Service');
		expect(serviceRepository.items[0].price.value).toBe(100);
	});

	it('should return ResourceNotFoundError if service does not exist', async () => {
		const result = await sut.execute({ serviceId: 'non-existent', name: 'X' });

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
