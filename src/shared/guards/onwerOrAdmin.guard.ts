import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Inject,
  mixin,
} from '@nestjs/common';
import { userRole } from 'src/modules/users/entities/user.entity';

// 👇 Factory để tạo guard dùng được cho nhiều service khác nhau
export function OwnerOrAdminGuardFactory(
  serviceToken: string, // token để inject service (VD: 'BlogService')
) {
  @Injectable()
  class OwnerOrAdminGuard implements CanActivate {
    constructor(@Inject(serviceToken) readonly service: any) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const id = request.params.id;

      // Nếu là ADMIN thì cho qua
      if (
        [userRole.ADMIN, userRole.ADMIN_HOTEL, userRole.ADMIN_TOUR].includes(
          user.role,
        )
      ) {
        return true;
      }

      // Gọi service để lấy entity (blog, hotel, tour...) và so sánh người tạo
      const item = await this.service.findOne(id);

      if (!item) {
        throw new ForbiddenException('Resource not found');
      }

      const creatorId = item.created_by?.id || item.created_by;

      if (creatorId !== user.id) {
        throw new ForbiddenException('You do not own this resource');
      }

      return true;
    }
  }

  return mixin(OwnerOrAdminGuard);
}
