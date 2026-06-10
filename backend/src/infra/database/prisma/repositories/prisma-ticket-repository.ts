import { Injectable } from '@nestjs/common'
import type { TicketRepository } from '@/domain/ports/ticket-repository'
import type { PaginatedResult, PaginationParams } from '@/domain/core/pagination'
import type { Ticket } from '@/domain/entities/ticket'
import { PrismaService } from '../prisma.service'
import { PrismaTicketMapper } from '../mappers/prisma-ticket-mapper'
import { PrismaTicketServicesMapper } from '../mappers/prisma-ticket-services-mapper'

@Injectable()
export class PrismaTicketRepository implements TicketRepository {
  constructor(private prisma: PrismaService) {}

  async create(ticket: Ticket): Promise<void> {
    const data = PrismaTicketMapper.toPrisma(ticket)

    await this.prisma.ticket.create({ data })

    const newServices = ticket.services.getNewItems()

    if (newServices.length > 0) {
      await this.prisma.ticketServices.createMany({
        data: newServices.map((ts) =>
          PrismaTicketServicesMapper.toPrisma(ts, ticket.id.toString()),
        ),
      })
    }
  }

  async findById(id: string): Promise<Ticket | null> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { ticketServices: true },
    })

    if (!ticket) return null

    return PrismaTicketMapper.toDomain(ticket)
  }

  async fetchAll({ page, limit }: PaginationParams): Promise<PaginatedResult<Ticket>> {
    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        orderBy: { createdAt: 'desc' },
        include: { ticketServices: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.ticket.count(),
    ])

    return {
      items: tickets.map(PrismaTicketMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async fetchByTechnicianId(technicianId: string, { page, limit }: PaginationParams): Promise<PaginatedResult<Ticket>> {
    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where: { technicianId },
        orderBy: { createdAt: 'desc' },
        include: { ticketServices: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.ticket.count({ where: { technicianId } }),
    ])

    return {
      items: tickets.map(PrismaTicketMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async fetchByClientId(clientId: string, { page, limit }: PaginationParams): Promise<PaginatedResult<Ticket>> {
    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        include: { ticketServices: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.ticket.count({ where: { clientId } }),
    ])

    return {
      items: tickets.map(PrismaTicketMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async save(ticket: Ticket): Promise<void> {
    const data = PrismaTicketMapper.toPrisma(ticket)

    const newServices = ticket.services.getNewItems()
    const removedServices = ticket.services.getRemovedItems()

    await Promise.all([
      this.prisma.ticket.update({ where: { id: data.id }, data }),
      newServices.length > 0
        ? this.prisma.ticketServices.createMany({
            data: newServices.map((ts) =>
              PrismaTicketServicesMapper.toPrisma(ts, ticket.id.toString()),
            ),
          })
        : Promise.resolve(),
      removedServices.length > 0
        ? this.prisma.ticketServices.deleteMany({
            where: { id: { in: removedServices.map((ts) => ts.id.toString()) } },
          })
        : Promise.resolve(),
    ])
  }
}
