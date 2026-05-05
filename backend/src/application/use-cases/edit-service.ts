import { left, right } from '@/domain/core/either';
import { ServiceRepository } from '@/domain/ports/service-repository';
import { Money } from '@/domain/value-objects/money';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import type {
	EditServiceUseCaseRequestDTO,
	EditServiceUseCaseResponseDTO,
} from '@/application/dtos/edit-service-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EditServiceUseCase {
	constructor(private serviceRepository: ServiceRepository) { }

	async execute({
		serviceId,
		name,
		price,
	}: EditServiceUseCaseRequestDTO): Promise<EditServiceUseCaseResponseDTO> {
		const service = await this.serviceRepository.findById(serviceId);

		if (!service) return left(new ResourceNotFoundError('Service'));

		if (name !== undefined) service.name = name;
		if (price !== undefined) service.price = Money.create(price);

		await this.serviceRepository.save(service);

		return right({ service });
	}
}
