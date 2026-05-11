import { describe, it, expect, beforeEach } from 'vitest';
import { AddServiceToTicketUseCase } from '@/application/use-cases/add-service-to-ticket';
import { InMemoryTicketRepository } from '../repositories/in-memory-ticket-repository';
import { InMemoryServiceRepository } from '../repositories/in-memory-service-repository';
import { makeService } from '../factories/make-service';
import { makeTechnician } from '../factories/make-technician';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import { NotAllowedError } from '@/application/errors/not-allowed-error';
import { makeTicket } from '../factories/make-ticket';

describe('AddServiceToTicketUseCase', () => {
	let ticketRepository: InMemoryTicketRepository;
	let serviceRepository: InMemoryServiceRepository;
	let sut: AddServiceToTicketUseCase;

	beforeEach(() => {
		ticketRepository = new InMemoryTicketRepository();
		serviceRepository = new InMemoryServiceRepository();
		sut = new AddServiceToTicketUseCase(ticketRepository, serviceRepository);
	});

	it('should add a service to a ticket', async () => {
		const technician = makeTechnician();
		const ticket = makeTicket({ technicianId: technician.id });
		const service = makeService({ name: 'Extra Service' });

		await ticketRepository.create(ticket);
		await serviceRepository.create(service);

		const initialCount = ticket.services.getItems().length;

		const result = await sut.execute({
			technicianId: technician.id.toString(),
			ticketId: ticket.id.toString(),
			serviceId: service.id.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(ticketRepository.items[0].services.getItems()).toHaveLength(initialCount + 1);
	});

	it('should return ResourceNotFoundError if ticket does not exist', async () => {
		const service = makeService();
		await serviceRepository.create(service);

		const result = await sut.execute({
			technicianId: 'any-tech',
			ticketId: 'non-existent',
			serviceId: service.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it('should return NotAllowedError if technician is not the assigned one', async () => {
		const ticket = makeTicket();
		const service = makeService();

		await ticketRepository.create(ticket);
		await serviceRepository.create(service);

		const result = await sut.execute({
			technicianId: 'wrong-technician',
			ticketId: ticket.id.toString(),
			serviceId: service.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});

	it('should return ResourceNotFoundError if service does not exist', async () => {
		const technician = makeTechnician();
		const ticket = makeTicket({ technicianId: technician.id });

		await ticketRepository.create(ticket);

		const result = await sut.execute({
			technicianId: technician.id.toString(),
			ticketId: ticket.id.toString(),
			serviceId: 'non-existent',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
