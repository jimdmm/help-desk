import { describe, it, expect, beforeEach } from 'vitest';
import { CreateTicketUseCase } from '@/application/use-cases/create-ticket';
import { InMemoryTicketRepository } from '../repositories/in-memory-ticket-repository';
import { InMemoryClientRepository } from '../repositories/in-memory-client-repository';
import { InMemoryTechnicianRepository } from '../repositories/in-memory-technician-repository';
import { InMemoryServiceRepository } from '../repositories/in-memory-service-repository';
import { makeClient } from '../factories/make-client';
import { makeTechnician } from '../factories/make-technician';
import { makeService } from '../factories/make-service';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';

describe('CreateTicketUseCase', () => {
	let ticketRepository: InMemoryTicketRepository;
	let clientRepository: InMemoryClientRepository;
	let technicianRepository: InMemoryTechnicianRepository;
	let serviceRepository: InMemoryServiceRepository;
	let sut: CreateTicketUseCase;

	beforeEach(() => {
		ticketRepository = new InMemoryTicketRepository();
		clientRepository = new InMemoryClientRepository();
		technicianRepository = new InMemoryTechnicianRepository();
		serviceRepository = new InMemoryServiceRepository();
		sut = new CreateTicketUseCase(
			ticketRepository,
			clientRepository,
			technicianRepository,
			serviceRepository,
		);
	});

	it('should create a ticket successfully', async () => {
		const client = makeClient();
		const technician = makeTechnician();
		const service = makeService();

		await clientRepository.create(client);
		await technicianRepository.create(technician);
		await serviceRepository.create(service);

		const result = await sut.execute({
			clientId: client.id.toString(),
			technicianId: technician.id.toString(),
			title: 'Printer not working',
			description: 'The printer is offline',
			serviceIds: [service.id.toString()],
		});

		expect(result.isRight()).toBe(true);
		expect(ticketRepository.items).toHaveLength(1);
		expect(ticketRepository.items[0].title).toBe('Printer not working');
		expect(ticketRepository.items[0].services.getItems()).toHaveLength(1);
	});

	it('should return ResourceNotFoundError if client does not exist', async () => {
		const technician = makeTechnician();
		const service = makeService();

		await technicianRepository.create(technician);
		await serviceRepository.create(service);

		const result = await sut.execute({
			clientId: 'non-existent',
			technicianId: technician.id.toString(),
			title: 'Test',
			description: 'Test',
			serviceIds: [service.id.toString()],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it('should return ResourceNotFoundError if technician does not exist', async () => {
		const client = makeClient();
		const service = makeService();

		await clientRepository.create(client);
		await serviceRepository.create(service);

		const result = await sut.execute({
			clientId: client.id.toString(),
			technicianId: 'non-existent',
			title: 'Test',
			description: 'Test',
			serviceIds: [service.id.toString()],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it('should return ResourceNotFoundError if a service does not exist', async () => {
		const client = makeClient();
		const technician = makeTechnician();

		await clientRepository.create(client);
		await technicianRepository.create(technician);

		const result = await sut.execute({
			clientId: client.id.toString(),
			technicianId: technician.id.toString(),
			title: 'Test',
			description: 'Test',
			serviceIds: ['non-existent'],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
