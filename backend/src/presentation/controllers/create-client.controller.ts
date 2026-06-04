import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public'
import { CreateClientUseCase } from '@/application/use-cases/create-client'
import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error'
import { DomainError } from '@/domain/core/errors/domain-error'

const bodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

type Body = z.infer<typeof bodySchema>

@Public()
@Controller('/clients')
export class CreateClientController {
  constructor(private createClient: CreateClientUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(new ZodValidationPipe(bodySchema)) body: Body) {
    const { name, email, password } = body

    const result = await this.createClient.execute({ name, email, password })

    if (result.isLeft()) {
      const error = result.value as DomainError

      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message)
      }

      throw new BadRequestException(error.message)
    }

    return { clientId: result.value.client.id.toString() }
  }
}
