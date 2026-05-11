import type { Admin } from '../entities/admin';

export abstract class AdminRepository {
  abstract create(admin: Admin): Promise<void>;
  abstract findByEmail(email: string): Promise<Admin | null>;
}
