import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
  @Post('multi-with-keys')
  @UseInterceptors(FilesInterceptor('files', 4))
  async uploadMultipleWithKeys(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('keys') keys: string[] | string,
  ) {
    // đảm bảo keys là mảng
    const keyList = Array.isArray(keys) ? keys : [keys];

    if (files.length !== keyList.length) {
      throw new Error('Số lượng ảnh và keys không khớp');
    }

    const uploadResults = await Promise.all(
      files.map((file, index) =>
        this.cloudinaryService
          .uploadFile(file.buffer, 'your-folder-name')
          .then((res) => ({
            key: keyList[index],
            url: res.secure_url,
            public_id: res.public_id,
          })),
      ),
    );

    return uploadResults;
  }
}
