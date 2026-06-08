import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles'
import { CreateServiceUseCase } from '@/application/use-cases/create-service'

const bodySchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
})

type Body = z.infer<typeof bodySchema>

@Roles('ADMIN')
@Controller('/services')
export class CreateServiceController {
  constructor(private createService: CreateServiceUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(new ZodValidationPipe(bodySchema)) body: Body) {
    const { name, price } = body

    const result = await this.createService.execute({ name, price })

    if (result.isLeft()) {
      throw new BadRequestException('Failed to create service.')
    }

    return { serviceId: result.value.service.id.toString() }
  }
}
