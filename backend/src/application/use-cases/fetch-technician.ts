import { Injectable } from '@nestjs/common';
import { Technician } from '../../domain/entities/technician';
import { TechnicianRepository } from '@/domain/ports/technician-repository';

@Injectable()
export class FetchTechnicianUseCase {
  constructor(private technicianRepository: TechnicianRepository) {}

  async execute(): Promise<Technician[]> {
    const technicians = await this.technicianRepository.fetchAll();
    return technicians;
  }
}
