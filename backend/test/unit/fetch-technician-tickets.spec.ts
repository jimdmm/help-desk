import { describe, it, expect, beforeEach } from 'vitest';
import { FetchTechnicianTicketsUseCase } from '@/application/use-cases/fetch-technician-tickets';
import { InMemoryTicketRepository } from '../repositories/in-memory-ticket-repository';
import { makeTicket } from '../factories/make-ticket';
import { UniqueEntityId } from '@/domain/core/unique-entity-id';

describe('FetchTechnicianTicketsUseCase', () => {
	let ticketRepository: InMemoryTicketRepository;
	let sut: FetchTechnicianTicketsUseCase;

	beforeEach(() => {
		ticketRepository = new InMemoryTicketRepository();
		sut = new FetchTechnicianTicketsUseCase(ticketRepository);
	});

	it('should return tickets assigned to the given technician', async () => {
		const technicianId = new UniqueEntityId();

		await ticketRepository.create(makeTicket({ technicianId }));
		await ticketRepository.create(makeTicket({ technicianId }));
		await ticketRepository.create(makeTicket()); // assigned to another technician

		const result = await sut.execute(technicianId.toString());

		expect(result).toHaveLength(2);
	});

	it('should return an empty array when technician has no tickets', async () => {
		const result = await sut.execute('any-technician-id');

		expect(result).toHaveLength(0);
	});
});
