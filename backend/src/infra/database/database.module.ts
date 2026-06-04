import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AdminRepository } from '@/domain/ports/admin-repository'
import { ClientRepository } from '@/domain/ports/client-repository'
import { TechnicianRepository } from '@/domain/ports/technician-repository'
import { ServiceRepository } from '@/domain/ports/service-repository'
import { TicketRepository } from '@/domain/ports/ticket-repository'
import { PrismaAdminRepository } from './prisma/repositories/prisma-admin-repository'
import { PrismaClientRepository } from './prisma/repositories/prisma-client-repository'
import { PrismaTechnicianRepository } from './prisma/repositories/prisma-technician-repository'
import { PrismaServiceRepository } from './prisma/repositories/prisma-service-repository'
import { PrismaTicketRepository } from './prisma/repositories/prisma-ticket-repository'

@Module({
  providers: [
    PrismaService,
    { provide: AdminRepository, useClass: PrismaAdminRepository },
    { provide: ClientRepository, useClass: PrismaClientRepository },
    { provide: TechnicianRepository, useClass: PrismaTechnicianRepository },
    { provide: ServiceRepository, useClass: PrismaServiceRepository },
    { provide: TicketRepository, useClass: PrismaTicketRepository },
  ],
  exports: [
    PrismaService,
    AdminRepository,
    ClientRepository,
    TechnicianRepository,
    ServiceRepository,
    TicketRepository,
  ],
})
export class DatabaseModule {}
