import { Admin } from '@/domain/entities/admin';
import { UniqueEntityId } from '@/domain/core/unique-entity-id';

interface MakeAdminOverrides {
	name?: string;
	email?: string;
	password?: string;
}

export function makeAdmin(
	overrides: MakeAdminOverrides = {},
	id?: UniqueEntityId,
): Admin {
	return Admin.create(
		{
			name: overrides.name ?? 'Admin User',
			email: overrides.email ?? 'admin@example.com',
			password: overrides.password ?? 'hashed-password',
		},
		id,
	);
}
