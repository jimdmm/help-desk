import { describe, it, expect, beforeEach } from 'vitest';
import { FetchClientTicketsUseCase } from '@/application/use-cases/fetch-client-tickets';
import { InMemoryTicketRepository } from '../repositories/in-memory-ticket-repository';
import { makeTicket } from '../factories/make-ticket';
import { UniqueEntityId } from '@/domain/core/unique-entity-id';

describe('FetchClientTicketsUseCase', () => {
	let ticketRepository: InMemoryTicketRepository;
	let sut: FetchClientTicketsUseCase;

	beforeEach(() => {
		ticketRepository = new InMemoryTicketRepository();
		sut = new FetchClientTicketsUseCase(ticketRepository);
	});

	it('should return tickets belonging to the given client', async () => {
		const clientId = new UniqueEntityId();

		await ticketRepository.create(makeTicket({ clientId }));
		await ticketRepository.create(makeTicket({ clientId }));
		await ticketRepository.create(makeTicket()); // belongs to another client

		const result = await sut.execute(clientId.toString());

		expect(result).toHaveLength(2);
	});

	it('should return an empty array when client has no tickets', async () => {
		const result = await sut.execute('any-client-id');

		expect(result).toHaveLength(0);
	});
});
