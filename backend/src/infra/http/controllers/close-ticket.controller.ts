import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { CloseTicketUseCase } from '@/application/use-cases/close-ticket'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { NotAllowedError } from '@/application/errors/not-allowed-error'
import { DomainError } from '@/domain/core/errors/domain-error'

@Roles('TECHNICIAN')
@Controller('/tickets/:id/close')
export class CloseTicketController {
  constructor(private closeTicket: CloseTicketUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('id') ticketId: string,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const result = await this.closeTicket.execute({
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
