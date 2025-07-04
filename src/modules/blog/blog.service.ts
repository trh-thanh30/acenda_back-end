import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../users/users.interface';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,
  ) {}
  async create(
    createBlogDto: CreateBlogDto,
    file: Express.Multer.File,
    user: IUser,
  ) {
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
      created_by: {
        id: user.id,
        email: user.email,
      },
    });
    await this.blogRepository.save(blog);
    return {
      id: blog.id,
      message: 'Blog created successfully',
    };
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Blog>> {
    const result = await paginate(query, this.blogRepository, {
      sortableColumns: ['id', 'title', 'content', 'created_at', 'updated_at'],
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['title', 'content', 'created_at', 'updated_at'],
      relations: ['created_by', 'updated_by'],
    });

    result.data = result.data.map((blog) => ({
      ...blog,
      created_by: blog.created_by
        ? { id: blog.created_by.id, email: blog.created_by.email }
        : null,
      updated_by: blog.updated_by
        ? { id: blog.updated_by.id, email: blog.updated_by.email }
        : null,
    })) as any;

    return result;
  }

  async findOne(id: string) {
    const blog = await this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.created_by', 'user')
      .select([
        'blog.id',
        'blog.title',
        'blog.content',
        'blog.thumbnail',
        'user.id',
        'user.email',
      ])
      .where('blog.id = :id', { id })
      .getOne();

    if (!blog) {
      throw new BadRequestException('Blog not found');
    }
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) {
      throw new BadRequestException('Blog not found');
    }
    await this.blogRepository.update(blog.id, updateBlogDto);
    return {
      id: blog.id,
      message: 'Blog updated successfully',
    };
  }

  async removeSoft(id: string, user: IUser) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) {
      throw new BadRequestException('Blog not found');
    }
    await this.blogRepository.update(blog.id, {
      is_deleted: true,
      deleted_by: {
        id: user.id,
        email: user.email,
      },
    });
    await this.blogRepository.softDelete(blog.id);
    return {
      message: 'Blog deleted successfully',
      status: HttpStatus.OK,
    };
  }
}
