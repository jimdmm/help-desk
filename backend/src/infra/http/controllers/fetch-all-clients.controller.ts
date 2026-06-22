import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/decorators/roles'
import { FetchAllClientsUseCase } from '@/application/use-cases/fetch-all-clients'

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
})

type Query = z.infer<typeof querySchema>

@Controller('/clients')
export class FetchAllClientsController {
  constructor(private fetchAllClients: FetchAllClientsUseCase) { }

  @Get()
  @Roles('ADMIN')
  async handle(@Query(new ZodValidationPipe(querySchema)) query: Query) {
    const { page, limit } = query
    const result = await this.fetchAllClients.execute({ page, limit })

    return {
      clients: result.items.map((c) => ({
        id: c.id.toString(),
        name: c.name,
        email: c.email,
        profileImage: c.profileImage ?? null,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt ?? null,
      })),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    }
  }
}
