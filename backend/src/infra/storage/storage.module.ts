import { Module } from '@nestjs/common';
import { Uploader } from '@/application/storage/uploader';
import { EnvModule } from '@/infra/env/env.module';
import { SupabaseStorage } from './supabase-storage';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: SupabaseStorage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
