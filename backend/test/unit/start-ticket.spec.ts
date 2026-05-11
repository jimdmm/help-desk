import { describe, it, expect, beforeEach } from 'vitest';
import { StartTicketUseCase } from '@/application/use-cases/start-ticket';
import { InMemoryTicketRepository } from '../repositories/in-memory-ticket-repository';
import { makeTicket } from '../factories/make-ticket';
import { makeTechnician } from '../factories/make-technician';
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error';
import { NotAllowedError } from '@/application/errors/not-allowed-error';

describe('StartTicketUseCase', () => {
	let ticketRepository: InMemoryTicketRepository;
	let sut: StartTicketUseCase;

	beforeEach(() => {
		ticketRepository = new InMemoryTicketRepository();
		sut = new StartTicketUseCase(ticketRepository);
	});

	it('should start a ticket (set status to IN_PROGRESS)', async () => {
		const technician = makeTechnician();
		const ticket = makeTicket({ technicianId: technician.id });
		await ticketRepository.create(ticket);

		const result = await sut.execute({
			technicianId: technician.id.toString(),
			ticketId: ticket.id.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(ticketRepository.items[0].status.value).toBe('IN_PROGRESS');
	});

	it('should return ResourceNotFoundError if ticket does not exist', async () => {
		const result = await sut.execute({
			technicianId: 'any-tech',
			ticketId: 'non-existent',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it('should return NotAllowedError if technician is not the assigned one', async () => {
		const ticket = makeTicket();
		await ticketRepository.create(ticket);

		const result = await sut.execute({
			technicianId: 'wrong-technician',
			ticketId: ticket.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
