import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles'
import { DeactivateServiceUseCase } from '@/application/use-cases/deactivate-service'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { ServiceAlreadyInactiveError } from '@/application/errors/service-already-inactive-error'
import { DomainError } from '@/domain/core/errors/domain-error'
import { RedisCacheService } from '@/infra/cache/redis-cache.service'

@Roles('ADMIN')
@Controller('/services/:id/deactivate')
export class DeactivateServiceController {
  constructor(
    private deactivateService: DeactivateServiceUseCase,
    private cache: RedisCacheService,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') serviceId: string) {
    const result = await this.deactivateService.execute({ serviceId })

    if (result.isLeft()) {
      const error = result.value as DomainError

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      if (error instanceof ServiceAlreadyInactiveError) {
        throw new BadRequestException(error.message)
      }

      throw new BadRequestException(error.message)
    }

    await this.cache.del('services:all')
  }
}
