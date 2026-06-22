import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/decorators/roles'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import type { UserPayload } from '@/infra/auth/strategies/jwt.strategy'
import { AddServiceToTicketUseCase } from '@/application/use-cases/add-service-to-ticket'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { NotAllowedError } from '@/application/errors/not-allowed-error'
import { DomainError } from '@/domain/core/errors/domain-error'

const bodySchema = z.object({
  serviceId: z.string().uuid(),
})

type Body = z.infer<typeof bodySchema>

@Roles('TECHNICIAN')
@Controller('/tickets/:id/services')
export class AddServiceToTicketController {
  constructor(private addServiceToTicket: AddServiceToTicketUseCase) { }

  @Post()
  @HttpCode(204)
  async handle(
    @Param('id') ticketId: string,
    @Body(new ZodValidationPipe(bodySchema)) body: Body,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const result = await this.addServiceToTicket.execute({
      technicianId: currentUser.sub,
      ticketId,
      serviceId: body.serviceId,
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
