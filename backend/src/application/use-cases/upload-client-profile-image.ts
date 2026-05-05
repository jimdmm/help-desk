import { left, right } from '@/domain/core/either';
import { ClientRepository } from '@/domain/ports/client-repository';
import { Uploader } from '@/application/storage/uploader';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import type {
	UploadClientProfileImageUseCaseRequestDTO,
	UploadClientProfileImageUseCaseResponseDTO,
} from '@/application/dtos/upload-client-profile-image-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadClientProfileImageUseCase {
	constructor(
		private clientRepository: ClientRepository,
		private uploader: Uploader,
	) { }

	async execute({
		clientId,
		fileName,
		fileType,
		body,
	}: UploadClientProfileImageUseCaseRequestDTO): Promise<UploadClientProfileImageUseCaseResponseDTO> {
		const client = await this.clientRepository.findById(clientId);

		if (!client) return left(new ResourceNotFoundError('Client'));

		const { url } = await this.uploader.upload({ fileName, fileType, body });

		client.profileImage = url;

		await this.clientRepository.save(client);

		return right({ client });
	}
}
