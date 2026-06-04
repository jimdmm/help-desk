import { Injectable } from '@nestjs/common'
import type { TechnicianRepository } from '@/domain/ports/technician-repository'
import type { Technician } from '@/domain/entities/technician'
import { PrismaService } from '../prisma.service'
import { PrismaTechnicianMapper } from '../mappers/prisma-technician-mapper'

@Injectable()
export class PrismaTechnicianRepository implements TechnicianRepository {
  constructor(private prisma: PrismaService) {}

  async create(technician: Technician): Promise<void> {
    const data = PrismaTechnicianMapper.toPrisma(technician)

    await this.prisma.technician.create({ data })
  }

  async findById(id: string): Promise<Technician | null> {
    const technician = await this.prisma.technician.findUnique({
      where: { id },
    })

    if (!technician) {
      return null
    }

    return PrismaTechnicianMapper.toDomain(technician)
  }

  async findByEmail(email: string): Promise<Technician | null> {
    const technician = await this.prisma.technician.findUnique({
      where: { email },
    })

    if (!technician) {
      return null
    }

    return PrismaTechnicianMapper.toDomain(technician)
  }

  async fetchAll(): Promise<Technician[]> {
    const technicians = await this.prisma.technician.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return technicians.map(PrismaTechnicianMapper.toDomain)
  }

  async save(technician: Technician): Promise<void> {
    const data = PrismaTechnicianMapper.toPrisma(technician)

    await this.prisma.technician.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.technician.delete({
      where: { id },
    })
  }
}
