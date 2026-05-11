import { TicketRepository } from '@/domain/ports/ticket-repository';
import { Ticket } from '@/domain/entities/ticket';

export class InMemoryTicketRepository implements TicketRepository {
	public items: Ticket[] = [];

	async create(ticket: Ticket): Promise<void> {
		this.items.push(ticket);
	}

	async findById(id: string): Promise<Ticket | null> {
		return this.items.find((t) => t.id.toString() === id) ?? null;
	}

	async fetchAll(): Promise<Ticket[]> {
		return this.items;
	}

	async fetchByTechnicianId(technicianId: string): Promise<Ticket[]> {
		return this.items.filter((t) => t.technicianId.toString() === technicianId);
	}

	async fetchByClientId(clientId: string): Promise<Ticket[]> {
		return this.items.filter((t) => t.clientId.toString() === clientId);
	}

	async save(ticket: Ticket): Promise<void> {
		const index = this.items.findIndex((t) => t.id.equals(ticket.id));
		if (index >= 0) this.items[index] = ticket;
	}
}
