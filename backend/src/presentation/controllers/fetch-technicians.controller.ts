import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { FetchTechnicianUseCase } from '@/application/use-cases/fetch-technician'

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
})

type Query = z.infer<typeof querySchema>

@Controller('/technicians')
export class FetchTechniciansController {
  constructor(private fetchTechnician: FetchTechnicianUseCase) {}

  @Get()
  async handle(@Query(new ZodValidationPipe(querySchema)) query: Query) {
    const { page, limit } = query
    const result = await this.fetchTechnician.execute({ page, limit })

    return {
      technicians: result.items.map((t) => ({
        id: t.id.toString(),
        name: t.name,
        email: t.email,
        availability: t.availability.schedules,
        profileImage: t.profileImage ?? null,
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
