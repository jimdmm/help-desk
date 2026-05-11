import { describe, it, expect, beforeEach } from 'vitest';
import { FetchAllServicesUseCase } from '@/application/use-cases/fetch-all-services';
import { InMemoryServiceRepository } from '../repositories/in-memory-service-repository';
import { makeService } from '../factories/make-service';

describe('FetchAllServicesUseCase', () => {
	let serviceRepository: InMemoryServiceRepository;
	let sut: FetchAllServicesUseCase;

	beforeEach(() => {
		serviceRepository = new InMemoryServiceRepository();
		sut = new FetchAllServicesUseCase(serviceRepository);
	});

	it('should return all services', async () => {
		await serviceRepository.create(makeService());
		await serviceRepository.create(makeService());

		const result = await sut.execute();

		expect(result).toHaveLength(2);
	});

	it('should return an empty array when there are no services', async () => {
		const result = await sut.execute();

		expect(result).toHaveLength(0);
	});
});
