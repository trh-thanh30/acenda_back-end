import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,
  ) {}
  async create(createBlogDto: CreateBlogDto, file: Express.Multer.File) {
    const hasTitle = await this.blogRepository.findOneBy({
      title: createBlogDto.title,
    });
    if (hasTitle) {
      throw new BadRequestException('Title already exists');
    }
    const thumbnail = await this.cloudinaryService.uploadFile(
      file.buffer,
      this.configService.get<string>('CLOUDINARY_FOLDER')!,
    );

    const blog = this.blogRepository.create({
      ...createBlogDto,
      thumbnail: thumbnail.secure_url,
    });
    await this.blogRepository.save(blog);
    return {
      id: blog.id,
      message: 'Blog created successfully',
    };
  }

  findAll() {
    return `This action returns all blog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
