import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { Repository } from 'typeorm';
import { IUser } from '../users/users.interface';
import { AddressService } from '../address/address.service';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    private readonly addressService: AddressService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,
  ) {}
  async create(
    createHotelDto: CreateHotelDto,
    user: IUser,
    files: Express.Multer.File[],
  ) {
    const { address: addressDto, ...hotelData } = createHotelDto;
    const exitingHotel = await this.hotelRepository.findOne({
      where: { name: createHotelDto.name },
    });
    if (exitingHotel) {
      throw new BadRequestException(`Hotel already exists`);
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
    const address = await this.addressService.create(addressDto, user);
    const hotel = this.hotelRepository.create({
      ...hotelData,
      address,
      images: imageUrls,
      created_by: { id: user.id, email: user.email },
    });
    const savedHotel = await this.hotelRepository.save(hotel);
    address.hotel = hotel;
    await this.addressService.updateHotelInAddress(address.id, savedHotel);
    return savedHotel;
  }

  findAll(query: PaginateQuery): Promise<Paginated<Hotel>> {
    return paginate(query, this.hotelRepository, {
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
      relations: ['address', 'rooms', 'reviews'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });
  }

  async findOne(id: string) {
    const hotel = await this.hotelRepository.findOne({
      where: { id },
      relations: ['address', 'rooms', 'reviews'],
    });
    if (!hotel) {
      throw new BadRequestException(`Hotel with id ${id} not found`);
    }
    return hotel;
  }

  async update(
    id: string,
    updateHotelDto: UpdateHotelDto,
    user: IUser,
    imagesToRemove: string[],
    newFiles: Express.Multer.File[],
  ) {
    console.log(imagesToRemove);
    const hotel = await this.hotelRepository.findOne({
      where: { id },
      relations: ['address'],
    });
    if (!hotel) {
      throw new BadRequestException(`Hotel with id ${id} not found`);
    }
    // Remove images if specified IN cloudinary
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
    // Combine existing images with new images
    const updatedImages = hotel.images
      .filter((img) => !imagesToRemove.includes(img))
      .concat(newImageUrls);
    const { address: addressDto, ...hotelData } = updateHotelDto;
    const existingHotel = await this.hotelRepository.findOne({
      where: { name: updateHotelDto.name },
    });
    if (existingHotel && existingHotel.id !== id) {
      throw new BadRequestException(
        `Hotel with name ${updateHotelDto.name} already exists`,
      );
    }
    let updateAddress;
    if (updateHotelDto.address) {
      updateAddress = await this.addressService.update(
        hotel.address.id,
        {
          ...addressDto,
          hotel: hotel,
        },
        user,
      );
    }
    const updateHotel = await this.hotelRepository.update(id, {
      ...hotelData,
      address: updateAddress,
      images: updatedImages,
      updated_by: { id: user.id, email: user.email },
    });
    return updateHotel;
  }

  async remove(id: string, user: IUser) {
    const hotel = await this.hotelRepository.findOne({ where: { id } });
    if (!hotel) {
      throw new BadRequestException(`Hotel with id ${id} not found`);
    }
    await this.hotelRepository.update(hotel.id, {
      is_deleted: true,
      delete_at: new Date(),
      deleted_by: { id: user.id, email: user.email },
    });
    return await this.hotelRepository.softDelete(id);
  }
  async restoreHotelSoft(id: string) {
    const hotel = await this.hotelRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!hotel) throw new BadRequestException('Hotel not found');

    await this.hotelRepository.restore(id);
    return await this.hotelRepository.update(id, {
      is_deleted: false,
      delete_at: null,
    });
  }
}
