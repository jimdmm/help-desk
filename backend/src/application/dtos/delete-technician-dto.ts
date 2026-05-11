import type { Either } from '@/domain/core/either';
import type { ResourceNotFoundError } from '../errors/resource-not-found-error';

export interface DeleteTechnicianUseCaseRequestDTO {
  technicianId: string;
}

export type DeleteTechnicianUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  null
>;
