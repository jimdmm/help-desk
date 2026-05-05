import { left, right } from '@/domain/core/either';
import { ServiceRepository } from '@/domain/ports/service-repository';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import { ServiceAlreadyInactiveError } from '@/application/errors/service-already-inactive-error';
import type {
	DeactivateServiceUseCaseRequestDTO,
	DeactivateServiceUseCaseResponseDTO,
} from '@/application/dtos/deactivate-service-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeactivateServiceUseCase {
	constructor(private serviceRepository: ServiceRepository) { }

	async execute({
		serviceId,
	}: DeactivateServiceUseCaseRequestDTO): Promise<DeactivateServiceUseCaseResponseDTO> {
		const service = await this.serviceRepository.findById(serviceId);

		if (!service) return left(new ResourceNotFoundError('Service'));
		if (!service.isActive) return left(new ServiceAlreadyInactiveError());

		service.deactivate();

		await this.serviceRepository.save(service);

		return right(null);
	}
}
