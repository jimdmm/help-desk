import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/decorators/roles'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import type { UserPayload } from '@/infra/auth/strategies/jwt.strategy'
import { StartTicketUseCase } from '@/application/use-cases/start-ticket'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { NotAllowedError } from '@/application/errors/not-allowed-error'
import { DomainError } from '@/domain/core/errors/domain-error'

@Roles('TECHNICIAN')
@Controller('/tickets/:id/start')
export class StartTicketController {
  constructor(private startTicket: StartTicketUseCase) { }

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('id') ticketId: string,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const result = await this.startTicket.execute({
      technicianId: currentUser.sub,
      ticketId,
    })

    if (result.isLeft()) {
      const error = result.value as DomainError

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      if (error instanceof NotAllowedError) {
        throw new ForbiddenException(error.message)
      }

      throw new BadRequestException(error.message)
    }
  }
}
