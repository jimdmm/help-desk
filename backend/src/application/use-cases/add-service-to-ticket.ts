import { left, right } from '@/domain/core/either';
import { TicketServices } from '@/domain/entities/ticket-services';
import { TicketRepository } from '@/domain/ports/ticket-repository';
import { ServiceRepository } from '@/domain/ports/service-repository';
import { UniqueEntityId } from '@/domain/core/unique-entity-id';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import { NotAllowedError } from '@/application/errors/not-allowed-error';
import type {
	AddServiceToTicketUseCaseRequestDTO,
	AddServiceToTicketUseCaseResponseDTO,
} from '@/application/dtos/add-service-to-ticket-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AddServiceToTicketUseCase {
	constructor(
		private ticketRepository: TicketRepository,
		private serviceRepository: ServiceRepository,
	) { }

	async execute({
		technicianId,
		ticketId,
		serviceId,
	}: AddServiceToTicketUseCaseRequestDTO): Promise<AddServiceToTicketUseCaseResponseDTO> {
		const ticket = await this.ticketRepository.findById(ticketId);

		if (!ticket) return left(new ResourceNotFoundError('Ticket'));

		if (ticket.technicianId.toString() !== technicianId) {
			return left(new NotAllowedError());
		}

		const service = await this.serviceRepository.findById(serviceId);

		if (!service) return left(new ResourceNotFoundError('Service'));

		const ticketService = TicketServices.create({
			serviceId: new UniqueEntityId(service.id.toString()),
			serviceName: service.name,
			price: service.price,
		});

		ticket.addService(ticketService);

		await this.ticketRepository.save(ticket);

		return right({ ticket });
	}
}
