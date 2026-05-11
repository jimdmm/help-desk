import type { Either } from '@/domain/core/either';
import type { Technician } from '@/domain/entities/technician';
import type { ResourceNotFoundError } from '../errors/resource-not-found-error';

export interface UploadTechnicianProfileImageUseCaseRequestDTO {
  technicianId: string;
  fileName: string;
  fileType: string;
  body: Buffer;
}

export type UploadTechnicianProfileImageUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  { technician: Technician }
>;
