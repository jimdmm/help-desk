import type { Either } from '@/domain/core/either';
import type { Client } from '@/domain/entities/client';
import type { UserAlreadyExistsError } from '../errors/user-already-exists-error';

export interface CreateClientUseCaseRequestDTO {
	name: string;
	email: string;
	password: string;
}

export type CreateClientUseCaseResponseDTO = Either<
	UserAlreadyExistsError,
	{ client: Client }
>;
