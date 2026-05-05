import { left, right } from '@/domain/core/either';
import { TechnicianRepository } from '@/domain/ports/technician-repository';
import { Uploader } from '@/application/storage/uploader';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import type {
	UploadTechnicianProfileImageUseCaseRequestDTO,
	UploadTechnicianProfileImageUseCaseResponseDTO,
} from '@/application/dtos/upload-technician-profile-image-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadTechnicianProfileImageUseCase {
	constructor(
		private technicianRepository: TechnicianRepository,
		private uploader: Uploader,
	) { }

	async execute({
		technicianId,
		fileName,
		fileType,
		body,
	}: UploadTechnicianProfileImageUseCaseRequestDTO): Promise<UploadTechnicianProfileImageUseCaseResponseDTO> {
		const technician = await this.technicianRepository.findById(technicianId);

		if (!technician) return left(new ResourceNotFoundError('Technician'));

		const { url } = await this.uploader.upload({ fileName, fileType, body });

		technician.profileImage = url;

		await this.technicianRepository.save(technician);

		return right({ technician });
	}
}
