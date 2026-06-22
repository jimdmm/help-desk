import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import type { UserPayload } from '@/infra/auth/strategies/jwt.strategy'
import { EditClientUseCase } from '@/application/use-cases/edit-client'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { DomainError } from '@/domain/core/errors/domain-error'

const bodySchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
})

type Body = z.infer<typeof bodySchema>

@Controller('/clients/:id')
export class EditClientController {
  constructor(private editClient: EditClientUseCase) { }

  @Put()
  async handle(
    @Param('id') clientId: string,
    @Body(new ZodValidationPipe(bodySchema)) body: Body,
    @CurrentUser() currentUser: UserPayload,
  ) {
    if (currentUser.role !== 'ADMIN' && currentUser.sub !== clientId) {
      throw new ForbiddenException('You can only edit your own profile.')
    }

    const { name, email } = body

    const result = await this.editClient.execute({ clientId, name, email })

    if (result.isLeft()) {
      const error = result.value as DomainError

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw new BadRequestException(error.message)
    }

    const client = result.value.client

    return {
      client: {
        id: client.id.toString(),
        name: client.name,
        email: client.email,
        updatedAt: client.updatedAt,
      },
    }
  }
}
