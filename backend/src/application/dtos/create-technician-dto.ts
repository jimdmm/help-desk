import { Either } from '@/domain/core/either';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { Technician } from '@/domain/entities/technician';

export interface CreateTechnicianUseCaseRequestDTO {
  name: string;
  email: string;
  password: string;
  availability: string[];
}

export type CreateTechnicianUseCaseResponseDTO = Either<
  UserAlreadyExistsError,
  {
    technician: Technician;
  }
>;
