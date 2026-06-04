import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'

@Module({
  imports: [DatabaseModule, StorageModule, CryptographyModule],
  controllers: [],
  providers: [],
  exports: [DatabaseModule],
})
export class HttpModule {}
