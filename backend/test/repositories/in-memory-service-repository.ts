import { ServiceRepository } from '@/domain/ports/service-repository';
import { Service } from '@/domain/entities/service';

export class InMemoryServiceRepository implements ServiceRepository {
	public items: Service[] = [];

	async create(service: Service): Promise<void> {
		this.items.push(service);
	}

	async findById(id: string): Promise<Service | null> {
		return this.items.find((s) => s.id.toString() === id) ?? null;
	}

	async fetchAll(): Promise<Service[]> {
		return this.items;
	}

	async save(service: Service): Promise<void> {
		const index = this.items.findIndex((s) => s.id.equals(service.id));
		if (index >= 0) this.items[index] = service;
	}
}
