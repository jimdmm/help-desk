import type { Either } from '@/domain/core/either';
import type { ResourceNotFoundError } from '../errors/resource-not-found-error';

export interface DeleteClientUseCaseRequestDTO {
  clientId: string;
}

export type DeleteClientUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  null
>;
