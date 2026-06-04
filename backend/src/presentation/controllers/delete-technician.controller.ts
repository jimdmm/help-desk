import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles'
import { DeleteTechnicianUseCase } from '@/application/use-cases/delete-technician'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { DomainError } from '@/domain/core/errors/domain-error'

@Roles('ADMIN')
@Controller('/technicians/:id')
export class DeleteTechnicianController {
  constructor(private deleteTechnician: DeleteTechnicianUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') technicianId: string) {
    const result = await this.deleteTechnician.execute({ technicianId })

    if (result.isLeft()) {
      const error = result.value as DomainError

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw new BadRequestException(error.message)
    }
  }
}
