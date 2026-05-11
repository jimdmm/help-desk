import { Ticket } from '@/domain/entities/ticket';
import { TicketServicesList } from '@/domain/entities/ticket-services-list';
import { UniqueEntityId } from '@/domain/core/unique-entity-id';
import { makeTicketServices } from './make-ticket-services';

interface MakeTicketOverrides {
	clientId?: UniqueEntityId;
	technicianId?: UniqueEntityId;
	title?: string;
	description?: string;
	services?: TicketServicesList;
}

export function makeTicket(
	overrides: MakeTicketOverrides = {},
	id?: UniqueEntityId,
): Ticket {
	const services = overrides.services ?? (() => {
		const list = new TicketServicesList();
		list.add(makeTicketServices());
		return list;
	})();

	return Ticket.create(
		{
			clientId: overrides.clientId ?? new UniqueEntityId(),
			technicianId: overrides.technicianId ?? new UniqueEntityId(),
			title: overrides.title ?? 'Default Title',
			description: overrides.description ?? 'Default Description',
			services,
		},
		id,
	);
}
