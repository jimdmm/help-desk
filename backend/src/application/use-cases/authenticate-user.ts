import { ClientRepository } from "@/domain/ports/client-repository"
import { TechnicianRepository } from "@/domain/ports/technician-repository"
import { HashComparer } from "../cryptography/hash-comparer"
import { Encrypter } from "../cryptography/encrypter"
import { Injectable } from "@nestjs/common"
import { AuthenticateUserUseCaseRequestDTO, AuthenticateUserUseCaseResponseDTO } from "../dtos/authenticate-user-dto"
import { left, right } from "@/domain/core/either"
import { InvalidCredentialsError } from "../errors/invalid-credentials-error"


@Injectable()
export class AuthenticateUserUseCase {
	constructor(
		private clientRepository: ClientRepository,
		private technicianRepository: TechnicianRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter
	) { }

	async execute({
		email,
		password,
	}: AuthenticateUserUseCaseRequestDTO): Promise<AuthenticateUserUseCaseResponseDTO> {
		const client = await this.clientRepository.findByEmail(email)
		const technician = await this.technicianRepository.findByEmail(email)

		const user = client ?? technician

		if (!user) {
			return left(new InvalidCredentialsError())
		}

		const isPasswordValid = await this.hashComparer.compare(
			password,
			user.password
		)

		if (!isPasswordValid) {
			return left(new InvalidCredentialsError())
		}

		const role = client ? 'CLIENT' : 'TECHNICIAN'

		const accessToken = await this.encrypter.encrypt({
			sub: user.id.toString(),
			role,
		})

		return right({ accessToken })
	}
}
