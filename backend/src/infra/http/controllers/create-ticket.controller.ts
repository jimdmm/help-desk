import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { CreateTicketUseCase } from '@/application/use-cases/create-ticket'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { DomainError } from '@/domain/core/errors/domain-error'

const bodySchema = z.object({
  technicianId: z.string().uuid(),
  title: z.string().min(3),
  description: z.string().min(10),
  serviceIds: z.array(z.string().uuid()).min(1),
})

type Body = z.infer<typeof bodySchema>

@Roles('CLIENT')
@Controller('/tickets')
export class CreateTicketController {
  constructor(private createTicket: CreateTicketUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(bodySchema)) body: Body,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const { technicianId, title, description, serviceIds } = body

    const result = await this.createTicket.execute({
      clientId: currentUser.sub,
      technicianId,
      title,
      description,
      serviceIds,
    })

    if (result.isLeft()) {
      const error = result.value as DomainError

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw new BadRequestException(error.message)
    }

    return { ticketId: result.value.ticket.id.toString() }
  }
}
