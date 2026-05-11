import { TicketServices } from '@/domain/entities/ticket-services';
import { Money } from '@/domain/value-objects/money';
import { UniqueEntityId } from '@/domain/core/unique-entity-id';

interface MakeTicketServicesOverrides {
	serviceId?: UniqueEntityId;
	serviceName?: string;
	price?: Money;
}

export function makeTicketServices(
	overrides: MakeTicketServicesOverrides = {},
	id?: UniqueEntityId,
): TicketServices {
	return TicketServices.create(
		{
			serviceId: overrides.serviceId ?? new UniqueEntityId(),
			serviceName: overrides.serviceName ?? 'Default Service',
			price: overrides.price ?? Money.create(100),
		},
		id,
	);
}
