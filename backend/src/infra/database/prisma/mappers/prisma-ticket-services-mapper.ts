import type { TicketServices as PrismaTicketServices, Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/domain/core/unique-entity-id'
import { TicketServices } from '@/domain/entities/ticket-services'
import { Money } from '@/domain/value-objects/money'

export class PrismaTicketServicesMapper {
  static toDomain(raw: PrismaTicketServices): TicketServices {
    return TicketServices.create(
      {
        serviceId: new UniqueEntityId(raw.serviceId),
        serviceName: raw.serviceName,
        price: Money.create(raw.price.toNumber()),
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    ticketServices: TicketServices,
    ticketId: string,
  ): Prisma.TicketServicesUncheckedCreateInput {
    return {
      id: ticketServices.id.toString(),
      ticketId,
      serviceId: ticketServices.serviceId.toString(),
      serviceName: ticketServices.serviceName,
      price: ticketServices.price.value,
      createdAt: ticketServices.createdAt,
    }
  }
}
