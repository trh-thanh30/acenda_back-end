import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
// import { CloudinaryProvider } from './cloudinary.config';

@Injectable()
export class CloudinaryService {
  constructor(configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error)
            return reject(
              new Error(`Cloudinary upload error: ${error.message}`),
            );
          resolve(result!);
        },
      );

      Readable.from(buffer).pipe(stream);
    });
  }
  async deleteFileByUrl(url: string) {
    const publicId = this.extractPublicIdFromUrl(url);
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      throw new BadRequestException(`Failed to delete file: ${result.result}`);
    }
    return result;
  }
  // Helper function to extract public ID from URL
  private extractPublicIdFromUrl(url: string): string {
    const regex = /\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp|gif)$/;
    const match = url.match(regex);
    if (!match || !match[1]) {
      throw new Error(`Invalid Cloudinary URL format: ${url}`);
    }
    return match[1]; // publicId (có folder nếu có)
  }
}
