import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteTechnicianUseCase } from '@/application/use-cases/delete-technician';
import { InMemoryTechnicianRepository } from '../repositories/in-memory-technician-repository';
import { makeTechnician } from '../factories/make-technician';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';

describe('DeleteTechnicianUseCase', () => {
	let technicianRepository: InMemoryTechnicianRepository;
	let sut: DeleteTechnicianUseCase;

	beforeEach(() => {
		technicianRepository = new InMemoryTechnicianRepository();
		sut = new DeleteTechnicianUseCase(technicianRepository);
	});

	it('should delete a technician successfully', async () => {
		const technician = makeTechnician();
		await technicianRepository.create(technician);

		const result = await sut.execute({ technicianId: technician.id.toString() });

		expect(result.isRight()).toBe(true);
		expect(technicianRepository.items).toHaveLength(0);
	});

	it('should return ResourceNotFoundError if technician does not exist', async () => {
		const result = await sut.execute({ technicianId: 'non-existent' });

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
