import { left, right } from '@/domain/core/either';
import { TechnicianRepository } from '@/domain/ports/technician-repository';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import type {
	EditTechnicianUseCaseRequestDTO,
	EditTechnicianUseCaseResponseDTO,
} from '@/application/dtos/edit-technician-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EditTechnicianUseCase {
	constructor(private technicianRepository: TechnicianRepository) { }

	async execute({
		technicianId,
		name,
		email,
		availability,
	}: EditTechnicianUseCaseRequestDTO): Promise<EditTechnicianUseCaseResponseDTO> {
		const technician = await this.technicianRepository.findById(technicianId);

		if (!technician) return left(new ResourceNotFoundError('Technician'));

		if (name !== undefined) technician.name = name;
		if (email !== undefined) technician.email = email;
		if (availability !== undefined) technician.updateAvailability(availability);

		await this.technicianRepository.save(technician);

		return right({ technician });
	}
}
