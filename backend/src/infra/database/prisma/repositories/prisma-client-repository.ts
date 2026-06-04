import { Injectable } from '@nestjs/common'
import type { ClientRepository } from '@/domain/ports/client-repository'
import type { PaginatedResult, PaginationParams } from '@/application/dtos/pagination-dto'
import type { Client } from '@/domain/entities/client'
import { PrismaService } from '../prisma.service'
import { PrismaClientMapper } from '../mappers/prisma-client-mapper'

@Injectable()
export class PrismaClientRepository implements ClientRepository {
  constructor(private prisma: PrismaService) {}

  async create(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client)

    await this.prisma.client.create({ data })
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({ where: { id } })

    if (!client) return null

    return PrismaClientMapper.toDomain(client)
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({ where: { email } })

    if (!client) return null

    return PrismaClientMapper.toDomain(client)
  }

  async fetchAll({ page, limit }: PaginationParams): Promise<PaginatedResult<Client>> {
    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.client.count(),
    ])

    return {
      items: clients.map(PrismaClientMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async save(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client)

    await this.prisma.client.update({ where: { id: data.id }, data })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({ where: { id } })
  }
}
