import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { CacheModule } from '../cache/cache.module'

// Controllers
import { AuthenticateController } from '@/presentation/controllers/authenticate.controller'
import { CreateClientController } from '@/presentation/controllers/create-client.controller'
import { FetchAllClientsController } from '@/presentation/controllers/fetch-all-clients.controller'
import { EditClientController } from '@/presentation/controllers/edit-client.controller'
import { DeleteClientController } from '@/presentation/controllers/delete-client.controller'
import { UploadClientProfileImageController } from '@/presentation/controllers/upload-client-profile-image.controller'
import { CreateTechnicianController } from '@/presentation/controllers/create-technician.controller'
import { FetchTechniciansController } from '@/presentation/controllers/fetch-technicians.controller'
import { EditTechnicianController } from '@/presentation/controllers/edit-technician.controller'
import { DeleteTechnicianController } from '@/presentation/controllers/delete-technician.controller'
import { UploadTechnicianProfileImageController } from '@/presentation/controllers/upload-technician-profile-image.controller'
import { CreateServiceController } from '@/presentation/controllers/create-service.controller'
import { FetchAllServicesController } from '@/presentation/controllers/fetch-all-services.controller'
import { EditServiceController } from '@/presentation/controllers/edit-service.controller'
import { DeactivateServiceController } from '@/presentation/controllers/deactivate-service.controller'
import { CreateTicketController } from '@/presentation/controllers/create-ticket.controller'
import { FetchAllTicketsController } from '@/presentation/controllers/fetch-all-tickets.controller'
import { FetchClientTicketsController } from '@/presentation/controllers/fetch-client-tickets.controller'
import { FetchTechnicianTicketsController } from '@/presentation/controllers/fetch-technician-tickets.controller'
import { StartTicketController } from '@/presentation/controllers/start-ticket.controller'
import { CloseTicketController } from '@/presentation/controllers/close-ticket.controller'
import { AddServiceToTicketController } from '@/presentation/controllers/add-service-to-ticket.controller'

// Use Cases
import { AuthenticateUserUseCase } from '@/application/use-cases/authenticate-user'
import { CreateClientUseCase } from '@/application/use-cases/create-client'
import { FetchAllClientsUseCase } from '@/application/use-cases/fetch-all-clients'
import { EditClientUseCase } from '@/application/use-cases/edit-client'
import { DeleteClientUseCase } from '@/application/use-cases/delete-client'
import { UploadClientProfileImageUseCase } from '@/application/use-cases/upload-client-profile-image'
import { CreateTechnicianUseCase } from '@/application/use-cases/create-technician'
import { FetchTechnicianUseCase } from '@/application/use-cases/fetch-technician'
import { EditTechnicianUseCase } from '@/application/use-cases/edit-technician'
import { DeleteTechnicianUseCase } from '@/application/use-cases/delete-technician'
import { UploadTechnicianProfileImageUseCase } from '@/application/use-cases/upload-technician-profile-image'
import { CreateServiceUseCase } from '@/application/use-cases/create-service'
import { FetchAllServicesUseCase } from '@/application/use-cases/fetch-all-services'
import { EditServiceUseCase } from '@/application/use-cases/edit-service'
import { DeactivateServiceUseCase } from '@/application/use-cases/deactivate-service'
import { CreateTicketUseCase } from '@/application/use-cases/create-ticket'
import { FetchAllTicketsUseCase } from '@/application/use-cases/fetch-all-tickets'
import { FetchClientTicketsUseCase } from '@/application/use-cases/fetch-client-tickets'
import { FetchTechnicianTicketsUseCase } from '@/application/use-cases/fetch-technician-tickets'
import { StartTicketUseCase } from '@/application/use-cases/start-ticket'
import { CloseTicketUseCase } from '@/application/use-cases/close-ticket'
import { AddServiceToTicketUseCase } from '@/application/use-cases/add-service-to-ticket'

@Module({
  imports: [DatabaseModule, StorageModule, CryptographyModule, CacheModule],
  controllers: [
    AuthenticateController,
    CreateClientController,
    FetchAllClientsController,
    EditClientController,
    DeleteClientController,
    UploadClientProfileImageController,
    CreateTechnicianController,
    FetchTechniciansController,
    EditTechnicianController,
    DeleteTechnicianController,
    UploadTechnicianProfileImageController,
    CreateServiceController,
    FetchAllServicesController,
    EditServiceController,
    DeactivateServiceController,
    CreateTicketController,
    FetchAllTicketsController,
    FetchClientTicketsController,
    FetchTechnicianTicketsController,
    StartTicketController,
    CloseTicketController,
    AddServiceToTicketController,
  ],
  providers: [
    AuthenticateUserUseCase,
    CreateClientUseCase,
    FetchAllClientsUseCase,
    EditClientUseCase,
    DeleteClientUseCase,
    UploadClientProfileImageUseCase,
    CreateTechnicianUseCase,
    FetchTechnicianUseCase,
    EditTechnicianUseCase,
    DeleteTechnicianUseCase,
    UploadTechnicianProfileImageUseCase,
    CreateServiceUseCase,
    FetchAllServicesUseCase,
    EditServiceUseCase,
    DeactivateServiceUseCase,
    CreateTicketUseCase,
    FetchAllTicketsUseCase,
    FetchClientTicketsUseCase,
    FetchTechnicianTicketsUseCase,
    StartTicketUseCase,
    CloseTicketUseCase,
    AddServiceToTicketUseCase,
  ],
  exports: [DatabaseModule],
})
export class HttpModule {}
