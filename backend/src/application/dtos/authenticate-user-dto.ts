import { Either } from "@/domain/core/either";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";

export interface AuthenticateUserUseCaseRequestDTO {
	email: string;
	password: string;
}

export type AuthenticateUserUseCaseResponseDTO = Either<
	InvalidCredentialsError,
	{ accessToken: string }
>;