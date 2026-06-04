import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  Uploader,
  type UploadParams,
  type UploadResult,
} from '@/application/storage/uploader';
import { EnvService } from '@/infra/env/env.service';

@Injectable()
export class SupabaseStorage implements Uploader {
  private client: SupabaseClient;
  private bucket: string;

  constructor(private envService: EnvService) {
    this.client = createClient(
      this.envService.get('SUPABASE_URL'),
      this.envService.get('SUPABASE_SERVICE_ROLE_KEY'),
      {
        auth: { persistSession: false, autoRefreshToken: false },
      },
    );

    this.bucket = this.envService.get('SUPABASE_STORAGE_BUCKET');
  }

  async upload({ fileName, fileType, body }: UploadParams): Promise<UploadResult> {
    const uniqueFileName = `${randomUUID()}-${fileName}`;

    const { data, error } = await this.client.storage
      .from(this.bucket)
      .upload(uniqueFileName, body, {
        contentType: fileType,
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload file to Supabase: ${error.message}`);
    }

    const { data: publicUrlData } = this.client.storage
      .from(this.bucket)
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl };
  }
}
