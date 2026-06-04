import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public'
import { AuthenticateUserUseCase } from '@/application/use-cases/authenticate-user'
import { InvalidCredentialsError } from '@/application/errors/invalid-credentials-error'
import { DomainError } from '@/domain/core/errors/domain-error'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type Body = z.infer<typeof bodySchema>

@Public()
@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(@Body(new ZodValidationPipe(bodySchema)) body: Body) {
    const { email, password } = body

    const result = await this.authenticateUser.execute({ email, password })

    if (result.isLeft()) {
      const error = result.value as DomainError

      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message)
      }

      throw new BadRequestException(error.message)
    }

    return { access_token: result.value.accessToken }
  }
}
