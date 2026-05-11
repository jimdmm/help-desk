import { describe, it, expect, beforeEach } from 'vitest';
import { FetchAllTicketsUseCase } from '@/application/use-cases/fetch-all-tickets';
import { InMemoryTicketRepository } from '../repositories/in-memory-ticket-repository';
import { makeTicket } from '../factories/make-ticket';

describe('FetchAllTicketsUseCase', () => {
	let ticketRepository: InMemoryTicketRepository;
	let sut: FetchAllTicketsUseCase;

	beforeEach(() => {
		ticketRepository = new InMemoryTicketRepository();
		sut = new FetchAllTicketsUseCase(ticketRepository);
	});

	it('should return all tickets', async () => {
		await ticketRepository.create(makeTicket());
		await ticketRepository.create(makeTicket());

		const result = await sut.execute();

		expect(result).toHaveLength(2);
	});

	it('should return an empty array when there are no tickets', async () => {
		const result = await sut.execute();

		expect(result).toHaveLength(0);
	});
});
