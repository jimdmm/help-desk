import { ClientRepository } from '@/domain/ports/client-repository';
import { Client } from '@/domain/entities/client';

export class InMemoryClientRepository implements ClientRepository {
	public items: Client[] = [];

	async create(client: Client): Promise<void> {
		this.items.push(client);
	}

	async findById(id: string): Promise<Client | null> {
		return this.items.find((c) => c.id.toString() === id) ?? null;
	}

	async findByEmail(email: string): Promise<Client | null> {
		return this.items.find((c) => c.email === email) ?? null;
	}

	async fetchAll(): Promise<Client[]> {
		return this.items;
	}

	async save(client: Client): Promise<void> {
		const index = this.items.findIndex((c) => c.id.equals(client.id));
		if (index >= 0) this.items[index] = client;
	}

	async delete(id: string): Promise<void> {
		this.items = this.items.filter((c) => c.id.toString() !== id);
	}
}
