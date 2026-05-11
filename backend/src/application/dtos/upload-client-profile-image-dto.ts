import type { Either } from '@/domain/core/either';
import type { Client } from '@/domain/entities/client';
import type { ResourceNotFoundError } from '../errors/resource-not-found-error';

export interface UploadClientProfileImageUseCaseRequestDTO {
  clientId: string;
  fileName: string;
  fileType: string;
  body: Buffer;
}

export type UploadClientProfileImageUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  { client: Client }
>;
