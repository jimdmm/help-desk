import { left, right } from '@/domain/core/either';
import { Ticket } from '@/domain/entities/ticket';
import { TicketServices } from '@/domain/entities/ticket-services';
import { UniqueEntityId } from '@/domain/core/unique-entity-id';
import { TicketRepository } from '@/domain/ports/ticket-repository';
import { ClientRepository } from '@/domain/ports/client-repository';
import { TechnicianRepository } from '@/domain/ports/technician-repository';
import { ServiceRepository } from '@/domain/ports/service-repository';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import type {
	CreateTicketUseCaseRequestDTO,
	CreateTicketUseCaseResponseDTO,
} from '@/application/dtos/create-ticket-dto';
import { Injectable } from '@nestjs/common';
import { TicketStatus } from '@/domain/value-objects/ticketStatus';

@Injectable()
export class CreateTicketUseCase {
	constructor(
		private ticketRepository: TicketRepository,
		private clientRepository: ClientRepository,
		private technicianRepository: TechnicianRepository,
		private serviceRepository: ServiceRepository,
	) { }

	async execute({
		clientId,
		technicianId,
		title,
		description,
		serviceIds,
	}: CreateTicketUseCaseRequestDTO): Promise<CreateTicketUseCaseResponseDTO> {
		const client = await this.clientRepository.findById(clientId);
		if (!client) return left(new ResourceNotFoundError('Client'));

		const technician = await this.technicianRepository.findById(technicianId);
		if (!technician) return left(new ResourceNotFoundError('Technician'));

		const ticketServices: TicketServices[] = [];

		for (const serviceId of serviceIds) {
			const service = await this.serviceRepository.findById(serviceId);

			if (!service) return left(new ResourceNotFoundError('Service'));

			ticketServices.push(
				TicketServices.create({
					serviceId: new UniqueEntityId(service.id.toString()),
					serviceName: service.name,
					price: service.price,
				}),
			);
		}

		const ticket = Ticket.create({
			clientId: new UniqueEntityId(clientId),
			technicianId: new UniqueEntityId(technicianId),
			title,
			description,
			services: ticketServices,
			status: TicketStatus.create(),
		});

		await this.ticketRepository.create(ticket);

		client.createTicket(ticket.id.toString());
		await this.clientRepository.save(client);

		technician.assignToTicket(ticket.id.toString());
		await this.technicianRepository.save(technician);

		return right({ ticket });
	}
}
