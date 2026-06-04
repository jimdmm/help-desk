import type { Technician as PrismaTechnician, Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/domain/core/unique-entity-id'
import { Technician } from '@/domain/entities/technician'
import { Availability } from '@/domain/value-objects/availability'

export class PrismaTechnicianMapper {
  static toDomain(raw: PrismaTechnician): Technician {
    return Technician.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        availability: Availability.create(raw.availability),
        profileImage: raw.profileImage ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(technician: Technician): Prisma.TechnicianUncheckedCreateInput {
    return {
      id: technician.id.toString(),
      name: technician.name,
      email: technician.email,
      password: technician.password,
      availability: technician.availability.schedules,
      profileImage: technician.profileImage ?? null,
      createdAt: technician.createdAt,
      updatedAt: technician.updatedAt,
    }
  }
}
