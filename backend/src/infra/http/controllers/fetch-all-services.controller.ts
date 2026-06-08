import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { FetchAllServicesUseCase } from '@/application/use-cases/fetch-all-services'
import { RedisCacheService } from '@/infra/cache/redis-cache.service'

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
})

type Query = z.infer<typeof querySchema>

@Controller('/services')
export class FetchAllServicesController {
  constructor(
    private fetchAllServices: FetchAllServicesUseCase,
    private cache: RedisCacheService,
  ) {}

  @Get()
  async handle(@Query(new ZodValidationPipe(querySchema)) query: Query) {
    const { page, limit } = query
    const cacheKey = `services:all:p${page}:l${limit}`

    const cached = await this.cache.get<object>(cacheKey)

    if (cached) {
      return cached
    }

    const result = await this.fetchAllServices.execute({ page, limit })

    const response = {
      services: result.items.map((s) => ({
        id: s.id.toString(),
        name: s.name,
        price: s.price.value,
        isActive: s.isActive,
        createdAt: s.createdAt,
      })),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    }

    await this.cache.set(cacheKey, response, 60)

    return response
  }
}
