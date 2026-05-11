import { Client } from '@/domain/entities/client';
import { UniqueEntityId } from '@/domain/core/unique-entity-id';

interface MakeClientOverrides {
	name?: string;
	email?: string;
	password?: string;
}

export function makeClient(
	overrides: MakeClientOverrides = {},
	id?: UniqueEntityId,
): Client {
	return Client.create(
		{
			name: overrides.name ?? 'John Doe',
			email: overrides.email ?? `client-${Date.now()}@example.com`,
			password: overrides.password ?? 'hashed-password',
		},
		id,
	);
}
