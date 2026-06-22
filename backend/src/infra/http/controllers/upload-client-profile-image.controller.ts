import {
  BadRequestException,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import type { UserPayload } from '@/infra/auth/strategies/jwt.strategy'
import { UploadClientProfileImageUseCase } from '@/application/use-cases/upload-client-profile-image'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { DomainError } from '@/domain/core/errors/domain-error'

@Controller('/clients/:id/profile-image')
export class UploadClientProfileImageController {
  constructor(
    private uploadClientProfileImage: UploadClientProfileImageUseCase,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @Param('id') clientId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: UserPayload,
  ) {
    if (currentUser.role !== 'ADMIN' && currentUser.sub !== clientId) {
      throw new ForbiddenException('You can only upload your own profile image.')
    }

    if (!file) {
      throw new BadRequestException('File is required.')
    }

    const result = await this.uploadClientProfileImage.execute({
      clientId,
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value as DomainError

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException(error.message)
      }

      throw new BadRequestException(error.message)
    }

    return { profileImage: result.value.client.profileImage }
  }
}
