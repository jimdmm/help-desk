import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchTechnicianTicketsUseCase } from '@/application/use-cases/fetch-technician-tickets'

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
})

type Query = z.infer<typeof querySchema>

@Roles('TECHNICIAN')
@Controller('/tickets/assigned')
export class FetchTechnicianTicketsController {
  constructor(private fetchTechnicianTickets: FetchTechnicianTicketsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() currentUser: UserPayload,
    @Query(new ZodValidationPipe(querySchema)) query: Query,
  ) {
    const { page, limit } = query
    const result = await this.fetchTechnicianTickets.execute(currentUser.sub, { page, limit })

    return {
      tickets: result.items.map((t) => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description,
        status: t.status.value,
        clientId: t.clientId.toString(),
        total: t.total,
        services: t.services.getItems().map((s) => ({
          id: s.id.toString(),
          name: s.serviceName,
          price: s.price.value,
        })),
        createdAt: t.createdAt,
        updatedAt: t.updatedAt ?? null,
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
