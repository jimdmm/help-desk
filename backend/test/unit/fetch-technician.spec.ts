import { describe, it, expect, beforeEach } from 'vitest';
import { FetchTechnicianUseCase } from '@/application/use-cases/fetch-technician';
import { InMemoryTechnicianRepository } from '../repositories/in-memory-technician-repository';
import { makeTechnician } from '../factories/make-technician';

describe('FetchTechnicianUseCase', () => {
	let technicianRepository: InMemoryTechnicianRepository;
	let sut: FetchTechnicianUseCase;

	beforeEach(() => {
		technicianRepository = new InMemoryTechnicianRepository();
		sut = new FetchTechnicianUseCase(technicianRepository);
	});

	it('should return all technicians', async () => {
		await technicianRepository.create(makeTechnician());
		await technicianRepository.create(makeTechnician());

		const result = await sut.execute();

		expect(result).toHaveLength(2);
	});

	it('should return an empty array when there are no technicians', async () => {
		const result = await sut.execute();

		expect(result).toHaveLength(0);
	});
});
