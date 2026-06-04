import type {
  Ticket as PrismaTicket,
  TicketServices as PrismaTicketServices,
  TicketStatus,
  Prisma,
} from '@prisma/client'
import { UniqueEntityId } from '@/domain/core/unique-entity-id'
import { Ticket } from '@/domain/entities/ticket'
import { TicketServicesList } from '@/domain/entities/ticket-services-list'
import { TicketStatus as DomainTicketStatus, type TicketStatusType } from '@/domain/value-objects/ticketStatus'
import { PrismaTicketServicesMapper } from './prisma-ticket-services-mapper'

type PrismaTicketWithServices = PrismaTicket & {
  ticketServices: PrismaTicketServices[]
}

export class PrismaTicketMapper {
  static toDomain(raw: PrismaTicketWithServices): Ticket {
    const services = raw.ticketServices.map(PrismaTicketServicesMapper.toDomain)
    const servicesList = new TicketServicesList(services)

    return Ticket.create(
      {
        clientId: new UniqueEntityId(raw.clientId),
        technicianId: new UniqueEntityId(raw.technicianId),
        title: raw.title,
        description: raw.description,
        status: DomainTicketStatus.create(raw.status as TicketStatusType),
        services: servicesList,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(ticket: Ticket): Prisma.TicketUncheckedCreateInput {
    return {
      id: ticket.id.toString(),
      title: ticket.title,
      description: ticket.description,
      status: ticket.status.value as TicketStatus,
      clientId: ticket.clientId.toString(),
      technicianId: ticket.technicianId.toString(),
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    }
  }
}
