import type { Ticket } from '../entities/ticket';

export abstract class TicketRepository {
	abstract create(ticket: Ticket): Promise<void>;
	abstract findById(id: string): Promise<Ticket | null>;
	abstract fetchAll(): Promise<Ticket[]>;
	abstract fetchByTechnicianId(technicianId: string): Promise<Ticket[]>;
	abstract fetchByClientId(clientId: string): Promise<Ticket[]>;
	abstract save(ticket: Ticket): Promise<void>;
}
