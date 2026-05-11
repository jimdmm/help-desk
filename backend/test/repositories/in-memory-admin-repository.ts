import { AdminRepository } from '@/domain/ports/admin-repository';
import { Admin } from '@/domain/entities/admin';

export class InMemoryAdminRepository implements AdminRepository {
	public items: Admin[] = [];

	async create(admin: Admin): Promise<void> {
		this.items.push(admin);
	}

	async findByEmail(email: string): Promise<Admin | null> {
		return this.items.find((a) => a.email === email) ?? null;
	}
}
