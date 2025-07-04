import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/decorator/customize';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const isAllowed = matchRoles(roles, user.role);

    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );
    }
    return isAllowed;
  }
}

function matchRoles(roles: string[], userRole: string[]) {
  return roles.some((role) => userRole.includes(role));
}
