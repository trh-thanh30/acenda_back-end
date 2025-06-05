import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tour } from './entities/tour.entity';
import { Repository } from 'typeorm';
import { IUser } from '../users/users.interface';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tour) private readonly tourRepository: Repository<Tour>,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(
    createTourDto: CreateTourDto,
    user: IUser,
    files: Express.Multer.File[],
  ) {
    const exitingTour = await this.tourRepository.findOne({
      where: { name: createTourDto.name },
    });
    if (exitingTour) {
      throw new BadRequestException(`Tour already exists`);
    }
    const uploadResults = await Promise.all(
      files.map((file) =>
        this.cloudinaryService.uploadFile(
          file.buffer,
          this.configService.get<string>('CLOUDINARY_FOLDER')!,
        ),
      ),
    );
    const imageUrls = uploadResults.map((result) => result.secure_url);
    const tour = this.tourRepository.create({
      ...createTourDto,
      images: imageUrls,
      created_by: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
    const savedTour = await this.tourRepository.save(tour);
    return savedTour;
  }

  findAll(query: PaginateQuery): Promise<Paginated<Tour>> {
    return paginate(query, this.tourRepository, {
      sortableColumns: [
        'id',
        'name',
        'description',
        'highlights',
        'created_at',
        'updated_at',
      ],
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: [
        'name',
        'description',
        'highlights',
        'created_at',
        'updated_at',
      ],
      relations: ['created_by', 'updated_by'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });
  }

  async findOne(id: string) {
    const tour = await this.tourRepository.findOne({
      where: { id },
      relations: ['created_by', 'updated_by'],
    });
    if (!tour) {
      throw new BadRequestException(`Tour with id ${id} not found`);
    }
    return tour;
  }

  async update(
    id: string,
    updateTourDto: UpdateTourDto,
    user: IUser,
    imagesToRemove: string[],
    newFiles: Express.Multer.File[],
  ) {
    const tour = await this.tourRepository.findOne({ where: { id } });
    if (!tour) {
      throw new BadRequestException(`Tour with id ${id} not found`);
    }
    for (const imageUrl of imagesToRemove) {
      await this.cloudinaryService.deleteFileByUrl(imageUrl);
    }

    let newImageUrls: string[] = [];
    if (newFiles && newFiles.length > 0) {
      const uploadResults = await Promise.all(
        newFiles.map((file) =>
          this.cloudinaryService.uploadFile(
            file.buffer,
            this.configService.get<string>('CLOUDINARY_FOLDER')!,
          ),
        ),
      );
      newImageUrls = uploadResults.map((result) => result.secure_url);
    }
    const updateImages = tour.images
      .filter((image) => !imagesToRemove.includes(image))
      .concat(newImageUrls);
    const exitingTour = await this.tourRepository.findOne({
      where: { name: updateTourDto.name },
    });
    if (exitingTour && exitingTour.id !== tour.id) {
      throw new BadRequestException(`Tour name already exists`);
    }
    const updatedTour = await this.tourRepository.update(tour.id, {
      ...updateTourDto,
      images: updateImages,
      updated_by: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
    return updatedTour;
  }

  async remove(id: string, user: IUser) {
    const tour = await this.tourRepository.findOneBy({ id });
    if (!tour) {
      throw new BadRequestException(`Tour with id ${id} not found`);
    }
    await this.tourRepository.update(tour.id, {
      is_deleted: true,
      deleted_by: {
        id: user.id,
        email: user.email,
      },
    });
    await this.tourRepository.softDelete(tour.id);
    return {
      message: 'Tour deleted successfully',
      status: HttpStatus.OK,
    };
  }
}
