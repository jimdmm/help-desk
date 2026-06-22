import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import type { UserPayload } from '@/infra/auth/strategies/jwt.strategy'
import { DeleteClientUseCase } from '@/application/use-cases/delete-client'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { DomainError } from '@/domain/core/errors/domain-error'

@Controller('/clients/:id')
export class DeleteClientController {
  constructor(private deleteClient: DeleteClientUseCase) { }

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') clientId: string,
    @CurrentUser() currentUser: UserPayload,
  ) {
    if (currentUser.role !== 'ADMIN' && currentUser.sub !== clientId) {
      throw new ForbiddenException('You can only delete your own account.')
    }

    const result = await this.deleteClient.execute({ clientId })

    if (result.isLeft()) {
      const error = result.value as DomainError

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw new BadRequestException(error.message)
    }
  }
}
