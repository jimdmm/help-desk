import type { Client as PrismaClient, Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/domain/core/unique-entity-id'
import { Client } from '@/domain/entities/client'

export class PrismaClientMapper {
  static toDomain(raw: PrismaClient): Client {
    return Client.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        profileImage: raw.profileImage ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(client: Client): Prisma.ClientUncheckedCreateInput {
    return {
      id: client.id.toString(),
      name: client.name,
      email: client.email,
      password: client.password,
      profileImage: client.profileImage ?? null,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }
  }
}
