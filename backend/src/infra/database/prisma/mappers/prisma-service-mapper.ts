import type { Service as PrismaService, Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/domain/core/unique-entity-id'
import { Service } from '@/domain/entities/service'
import { Money } from '@/domain/value-objects/money'

export class PrismaServiceMapper {
  static toDomain(raw: PrismaService): Service {
    return Service.create(
      {
        name: raw.name,
        price: Money.create(raw.price.toNumber()),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
        deletedAt: raw.deletedAt ?? undefined,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(service: Service): Prisma.ServiceUncheckedCreateInput {
    return {
      id: service.id.toString(),
      name: service.name,
      price: service.price.value,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      deletedAt: service.deletedAt ?? null,
    }
  }
}
