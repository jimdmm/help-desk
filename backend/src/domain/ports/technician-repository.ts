import { Technician } from '../entities/technician';

export abstract class TechnicianRepository {
  abstract create(technician: Technician): Promise<void>;
  abstract findById(id: string): Promise<Technician | null>;
  abstract findByEmail(email: string): Promise<Technician | null>;
  abstract fetchAll(): Promise<Technician[]>;
  abstract save(technician: Technician): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
