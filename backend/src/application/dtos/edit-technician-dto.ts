import type { Either } from '@/domain/core/either';
import type { Technician } from '@/domain/entities/technician';
import type { ResourceNotFoundError } from '../errors/resource-not-found-error';

export interface EditTechnicianUseCaseRequestDTO {
  technicianId: string;
  name?: string;
  email?: string;
  availability?: string[];
}

export type EditTechnicianUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  { technician: Technician }
>;
