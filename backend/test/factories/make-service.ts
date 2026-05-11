import { Service } from '@/domain/entities/service';
import { Money } from '@/domain/value-objects/money';
import { UniqueEntityId } from '@/domain/core/unique-entity-id';

interface MakeServiceOverrides {
	name?: string;
	price?: Money;
}

export function makeService(
	overrides: MakeServiceOverrides = {},
	id?: UniqueEntityId,
): Service {
	return Service.create(
		{
			name: overrides.name ?? 'Default Service',
			price: overrides.price ?? Money.create(100),
		},
		id,
	);
}
