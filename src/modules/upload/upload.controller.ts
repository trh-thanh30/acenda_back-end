import {
  BadRequestException,
  Controller,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Express } from 'express';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly userService: UsersService,
    private configService: ConfigService,
  ) {}

  @Patch('/avatar/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    try {
      const result = await this.cloudinaryService.uploadFile(
        file.buffer,
        this.configService.get<string>('CLOUDINARY_FOLDER')!,
      );
      await this.userService.updateAvatar(id, result.secure_url);
      return {
        url: result.secure_url,
        message: 'Avatar updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to upload avatar');
    }
  }
}
