import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles'
import { EditServiceUseCase } from '@/application/use-cases/edit-service'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { DomainError } from '@/domain/core/errors/domain-error'
import { RedisCacheService } from '@/infra/cache/redis-cache.service'

const bodySchema = z.object({
  name: z.string().min(2).optional(),
  price: z.number().positive().optional(),
})

type Body = z.infer<typeof bodySchema>

@Roles('ADMIN')
@Controller('/services/:id')
export class EditServiceController {
  constructor(
    private editService: EditServiceUseCase,
    private cache: RedisCacheService,
  ) {}

  @Put()
  async handle(
    @Param('id') serviceId: string,
    @Body(new ZodValidationPipe(bodySchema)) body: Body,
  ) {
    const { name, price } = body

    const result = await this.editService.execute({ serviceId, name, price })

    if (result.isLeft()) {
      const error = result.value as DomainError

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw new BadRequestException(error.message)
    }

    await this.cache.del('services:all')

    const service = result.value.service

    return {
      service: {
        id: service.id.toString(),
        name: service.name,
        price: service.price.value,
        updatedAt: service.updatedAt,
      },
    }
  }
}
