import type { Admin as PrismaAdmin, Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/domain/core/unique-entity-id'
import { Admin } from '@/domain/entities/admin'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaAdmin): Admin {
    return Admin.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.AdminUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      password: admin.password,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    }
  }
}
