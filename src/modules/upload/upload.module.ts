import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [UploadController],
  providers: [CloudinaryService],
})
export class UploadModule {}
