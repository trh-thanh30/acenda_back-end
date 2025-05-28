import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { IUser } from '../users/users.interface';
import { HotelService } from '../hotel/hotel.service';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly hotelService: HotelService,
  ) {}
  async create(
    createRoomDto: CreateRoomDto,
    user: IUser,
    files: Express.Multer.File[],
  ) {
    const hotel = await this.hotelService.findOne(createRoomDto.hotel_id);
    if (!hotel) throw new Error('Hotel not found');
    const uploadResults = await Promise.all(
      files.map((file) =>
        this.cloudinaryService.uploadFile(
          file.buffer,
          this.configService.get<string>('CLOUDINARY_FOLDER')!,
        ),
      ),
    );
    const imagesUrl = uploadResults.map((result) => result.secure_url);
    const room = this.roomRepository.create({
      ...createRoomDto,
      hotel: hotel,
      images: imagesUrl,
      created_by: { id: user.id, email: user.email },
    });
    await this.roomRepository.save(room);
    return {
      message: 'Room created successfully',
      status: HttpStatus.CREATED,
      room,
    };
  }

  findAll(query: PaginateQuery): Promise<Paginated<Room>> {
    return paginate(query, this.roomRepository, {
      sortableColumns: [
        'id',
        'name',
        'description',
        'amenities',
        'created_at',
        'updated_at',
      ],
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: [
        'name',
        'description',
        'amenities',
        'created_at',
        'updated_at',
      ],
      relations: ['hotel'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });
  }

  async findOne(id: string) {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['hotel'],
    });
    if (!room) {
      throw new BadRequestException('Room not found');
    }
    return room;
  }

  async update(
    id: string,
    updateRoomDto: UpdateRoomDto,
    user: IUser,
    imagesToRemove: string[],
    newFiles: Express.Multer.File[],
  ) {
    const room = await this.roomRepository.findOne({
      where: { id },
    });
    if (!room) {
      throw new BadRequestException('Room not found');
    }
    // Remove old images
    for (const imageUrl of imagesToRemove) {
      await this.cloudinaryService.deleteFileByUrl(imageUrl);
    }
    // Upload new images if provided
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
    const updateImages = room.images
      .filter((image) => !imagesToRemove.includes(image))
      .concat(newImageUrls);
    const updatedRoom = await this.roomRepository.update(room.id, {
      ...updateRoomDto,
      images: updateImages,
      updated_by: { id: user.id, email: user.email },
    });
    return {
      message: 'Room updated successfully',
      status: HttpStatus.OK,
      room: updatedRoom,
    };
  }

  async remove(id: string, user: IUser) {
    const room = await this.roomRepository.findOneBy({ id });
    if (!room) {
      throw new BadRequestException('Room not found');
    }
    await this.roomRepository.update(room.id, {
      is_deleted: true,
      deleted_by: { id: user.id, email: user.email },
    });
    await this.roomRepository.softDelete(room.id);
    return {
      message: 'Room deleted successfully',
      status: HttpStatus.OK,
    };
  }
}
