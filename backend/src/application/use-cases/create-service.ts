import { right } from '@/domain/core/either';
import { Service } from '@/domain/entities/service';
import { ServiceRepository } from '@/domain/ports/service-repository';
import { Money } from '@/domain/value-objects/money';
import type {
	CreateServiceUseCaseRequestDTO,
	CreateServiceUseCaseResponseDTO,
} from '@/application/dtos/create-service-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateServiceUseCase {
	constructor(private serviceRepository: ServiceRepository) { }

	async execute({
		name,
		price,
	}: CreateServiceUseCaseRequestDTO): Promise<CreateServiceUseCaseResponseDTO> {
		const service = Service.create({ name, price: Money.create(price) });

		await this.serviceRepository.create(service);

		return right({ service });
	}
}
