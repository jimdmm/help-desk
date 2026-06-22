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
import { EditTechnicianUseCase } from '@/application/use-cases/edit-technician'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { DomainError } from '@/domain/core/errors/domain-error'

const bodySchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  availability: z.array(z.string()).optional(),
})

type Body = z.infer<typeof bodySchema>

@Controller('/technicians/:id')
export class EditTechnicianController {
  constructor(private editTechnician: EditTechnicianUseCase) { }

  @Put()
  async handle(
    @Param('id') technicianId: string,
    @Body(new ZodValidationPipe(bodySchema)) body: Body,
    @CurrentUser() currentUser: UserPayload,
  ) {
    if (currentUser.role !== 'ADMIN' && currentUser.sub !== technicianId) {
      throw new ForbiddenException('You can only edit your own profile.')
    }

    const { name, email, availability } = body

    const result = await this.editTechnician.execute({
      technicianId,
      name,
      email,
      availability,
    })

    if (result.isLeft()) {
      const error = result.value as DomainError

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw new BadRequestException(error.message)
    }

    const technician = result.value.technician

    return {
      technician: {
        id: technician.id.toString(),
        name: technician.name,
        email: technician.email,
        availability: technician.availability.schedules,
        updatedAt: technician.updatedAt,
      },
    }
  }
}
