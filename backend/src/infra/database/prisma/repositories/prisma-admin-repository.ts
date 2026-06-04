import { Injectable } from '@nestjs/common'
import type { AdminRepository } from '@/domain/ports/admin-repository'
import type { Admin } from '@/domain/entities/admin'
import { PrismaService } from '../prisma.service'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'

@Injectable()
export class PrismaAdminRepository implements AdminRepository {
  constructor(private prisma: PrismaService) {}

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.admin.create({ data })
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }
}
