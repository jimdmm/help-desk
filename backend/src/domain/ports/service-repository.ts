import type { Service } from '../entities/service';

export abstract class ServiceRepository {
	abstract create(service: Service): Promise<void>;
	abstract findById(id: string): Promise<Service | null>;
	abstract fetchAll(): Promise<Service[]>;
	abstract save(service: Service): Promise<void>;
}
