import { Technician } from '@/domain/entities/technician';
import { Availability } from '@/domain/value-objects/availability';
import { UniqueEntityId } from '@/domain/core/unique-entity-id';

interface MakeTechnicianOverrides {
	name?: string;
	email?: string;
	password?: string;
	availability?: Availability;
}

export function makeTechnician(
	overrides: MakeTechnicianOverrides = {},
	id?: UniqueEntityId,
): Technician {
	return Technician.create(
		{
			name: overrides.name ?? 'Tech User',
			email: overrides.email ?? `tech-${Date.now()}@example.com`,
			password: overrides.password ?? 'hashed-password',
			availability:
				overrides.availability ?? Availability.create(['08:00', '09:00']),
		},
		id,
	);
}
