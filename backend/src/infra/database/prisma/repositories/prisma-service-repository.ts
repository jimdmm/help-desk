import { Injectable } from '@nestjs/common'
import type { ServiceRepository } from '@/domain/ports/service-repository'
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
    const service = await this.prisma.service.findUnique({
      where: { id },
    })

    if (!service) {
      return null
    }

    return PrismaServiceMapper.toDomain(service)
  }

  async fetchAll(): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return services.map(PrismaServiceMapper.toDomain)
  }

  async save(service: Service): Promise<void> {
    const data = PrismaServiceMapper.toPrisma(service)

    await this.prisma.service.update({
      where: { id: data.id },
      data,
    })
  }
}
