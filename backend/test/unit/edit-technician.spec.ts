import { describe, it, expect, beforeEach } from 'vitest';
import { EditTechnicianUseCase } from '@/application/use-cases/edit-technician';
import { InMemoryTechnicianRepository } from '../repositories/in-memory-technician-repository';
import { makeTechnician } from '../factories/make-technician';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';

describe('EditTechnicianUseCase', () => {
	let technicianRepository: InMemoryTechnicianRepository;
	let sut: EditTechnicianUseCase;

	beforeEach(() => {
		technicianRepository = new InMemoryTechnicianRepository();
		sut = new EditTechnicianUseCase(technicianRepository);
	});

	it('should edit technician name and email', async () => {
		const technician = makeTechnician({ name: 'Old Name', email: 'old@example.com' });
		await technicianRepository.create(technician);

		const result = await sut.execute({
			technicianId: technician.id.toString(),
			name: 'New Name',
			email: 'new@example.com',
		});

		expect(result.isRight()).toBe(true);
		expect(technicianRepository.items[0].name).toBe('New Name');
		expect(technicianRepository.items[0].email).toBe('new@example.com');
	});

	it('should update availability when provided', async () => {
		const technician = makeTechnician();
		await technicianRepository.create(technician);

		await sut.execute({
			technicianId: technician.id.toString(),
			availability: ['14:00', '15:00'],
		});

		expect(technicianRepository.items[0].availability.hasSchedule('14:00')).toBe(true);
	});

	it('should return ResourceNotFoundError if technician does not exist', async () => {
		const result = await sut.execute({
			technicianId: 'non-existent',
			name: 'New Name',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
