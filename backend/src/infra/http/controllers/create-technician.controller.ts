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
import { Roles } from '@/infra/auth/roles'
import { CreateTechnicianUseCase } from '@/application/use-cases/create-technician'
import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error'
import { DomainError } from '@/domain/core/errors/domain-error'

const bodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  availability: z.array(z.string()).optional(),
})

type Body = z.infer<typeof bodySchema>

@Roles('ADMIN')
@Controller('/technicians')
export class CreateTechnicianController {
  constructor(private createTechnician: CreateTechnicianUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(new ZodValidationPipe(bodySchema)) body: Body) {
    const { name, email, password, availability } = body

    const result = await this.createTechnician.execute({
      name,
      email,
      password,
      availability: availability ?? [
        '08:00', '09:00', '10:00', '11:00',
        '14:00', '15:00', '16:00', '17:00',
      ],
    })

    if (result.isLeft()) {
      const error = result.value as DomainError

      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message)
      }

      throw new BadRequestException(error.message)
    }

    return { technicianId: result.value.technician.id.toString() }
  }
}
