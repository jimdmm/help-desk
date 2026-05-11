import { left, right } from '@/domain/core/either';
import { Ticket } from '@/domain/entities/ticket';
import { TicketServices } from '@/domain/entities/ticket-services';
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
import { TicketServicesList } from '@/domain/entities/ticket-services-list';

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

    const ticketServicesList: TicketServicesList = new TicketServicesList();

    for (const serviceId of serviceIds) {
      const service = await this.serviceRepository.findById(serviceId);

      if (!service) return left(new ResourceNotFoundError('Service'));

      ticketServicesList.add(
        TicketServices.create({
          serviceId: service.id,
          serviceName: service.name,
          price: service.price,
        }),
      );
    }

    const ticket = Ticket.create({
      clientId: client.id,
      technicianId: technician.id,
      title,
      description,
      services: ticketServicesList,
      status: TicketStatus.create(),
    });

    await this.ticketRepository.create(ticket);

    return right({ ticket });
  }
}
