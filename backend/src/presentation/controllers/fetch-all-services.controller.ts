import { Controller, Get } from '@nestjs/common'
import { FetchAllServicesUseCase } from '@/application/use-cases/fetch-all-services'
import { RedisCacheService } from '@/infra/cache/redis-cache.service'

@Controller('/services')
export class FetchAllServicesController {
  constructor(
    private fetchAllServices: FetchAllServicesUseCase,
    private cache: RedisCacheService,
  ) {}

  @Get()
  async handle() {
    const cacheKey = 'services:all'

    const cached = await this.cache.get<object[]>(cacheKey)

    if (cached) {
      return { services: cached }
    }

    const services = await this.fetchAllServices.execute()

    const data = services.map((s) => ({
      id: s.id.toString(),
      name: s.name,
      price: s.price.value,
      isActive: s.isActive,
      createdAt: s.createdAt,
    }))

    await this.cache.set(cacheKey, data, 60)

    return { services: data }
  }
}
