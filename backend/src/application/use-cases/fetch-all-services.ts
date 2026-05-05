import { Injectable } from '@nestjs/common';
import type { Service } from '@/domain/entities/service';
import { ServiceRepository } from '@/domain/ports/service-repository';

@Injectable()
export class FetchAllServicesUseCase {
	constructor(private serviceRepository: ServiceRepository) { }

	async execute(): Promise<Service[]> {
		return this.serviceRepository.fetchAll();
	}
}
