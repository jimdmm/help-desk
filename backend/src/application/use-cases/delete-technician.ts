import { left, right } from '@/domain/core/either';
import { TechnicianRepository } from '@/domain/ports/technician-repository';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import type {
	DeleteTechnicianUseCaseRequestDTO,
	DeleteTechnicianUseCaseResponseDTO,
} from '@/application/dtos/delete-technician-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteTechnicianUseCase {
	constructor(private technicianRepository: TechnicianRepository) { }

	async execute({
		technicianId,
	}: DeleteTechnicianUseCaseRequestDTO): Promise<DeleteTechnicianUseCaseResponseDTO> {
		const technician = await this.technicianRepository.findById(technicianId);

		if (!technician) return left(new ResourceNotFoundError('Technician'));

		await this.technicianRepository.delete(technicianId);

		return right(null);
	}
}
