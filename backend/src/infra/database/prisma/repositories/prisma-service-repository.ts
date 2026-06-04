import { Injectable } from '@nestjs/common'
import type { ServiceRepository } from '@/domain/ports/service-repository'
import type { PaginatedResult, PaginationParams } from '@/application/dtos/pagination-dto'
import type { Service } from '@/domain/entities/service'
import { PrismaService } from '../prisma.service'
import { PrismaServiceMapper } from '../mappers/prisma-service-mapper'

@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
  constructor(private prisma: PrismaService) {}

  async create(service: Service): Promise<void> {
    const data = PrismaServiceMapper.toPrisma(service)

    await this.prisma.service.create({ data })
  }

  async findById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({ where: { id } })

    if (!service) return null

    return PrismaServiceMapper.toDomain(service)
  }

  async fetchAll({ page, limit }: PaginationParams): Promise<PaginatedResult<Service>> {
    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.service.count(),
    ])

    return {
      items: services.map(PrismaServiceMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async save(service: Service): Promise<void> {
    const data = PrismaServiceMapper.toPrisma(service)

    await this.prisma.service.update({ where: { id: data.id }, data })
  }
}
