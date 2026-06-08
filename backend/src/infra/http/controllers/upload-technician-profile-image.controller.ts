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
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { UploadTechnicianProfileImageUseCase } from '@/application/use-cases/upload-technician-profile-image'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found-error'
import { DomainError } from '@/domain/core/errors/domain-error'

@Controller('/technicians/:id/profile-image')
export class UploadTechnicianProfileImageController {
  constructor(
    private uploadTechnicianProfileImage: UploadTechnicianProfileImageUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @Param('id') technicianId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: UserPayload,
  ) {
    if (currentUser.role !== 'ADMIN' && currentUser.sub !== technicianId) {
      throw new ForbiddenException('You can only upload your own profile image.')
    }

    if (!file) {
      throw new BadRequestException('File is required.')
    }

    const result = await this.uploadTechnicianProfileImage.execute({
      technicianId,
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

    return { profileImage: result.value.technician.profileImage }
  }
}
