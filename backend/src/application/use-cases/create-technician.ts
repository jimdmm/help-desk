import { left, right } from '@/domain/core/either';
import { Injectable } from '@nestjs/common';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { HashGenerator } from '../cryptography/hash-generator';
import type {
  CreateTechnicianUseCaseRequestDTO,
  CreateTechnicianUseCaseResponseDTO,
} from '../dtos/create-technician-dto';
import { Technician } from '@/domain/entities/technician';
import { Availability } from '@/domain/value-objects/availability';
import { TechnicianRepository } from '@/domain/ports/technician-repository';

@Injectable()
export class CreateTechnicianUseCase {
  constructor(
    private technicianRepository: TechnicianRepository,
    private hashGenerator: HashGenerator,
  ) { }

  async execute({
    name,
    email,
    password,
    availability,
  }: CreateTechnicianUseCaseRequestDTO): Promise<CreateTechnicianUseCaseResponseDTO> {
    const userWithSameEmailInTechnicians =
      await this.technicianRepository.findByEmail(email);

    if (userWithSameEmailInTechnicians) {
      return left(new UserAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const availabilityConfig =
      availability.length > 0
        ? Availability.create(availability)
        : Availability.createDefault();

    const technician = Technician.create({
      name,
      email,
      password: hashedPassword,
      availability: availabilityConfig,
    });

    await this.technicianRepository.create(technician);

    return right({ technician });
  }
}
