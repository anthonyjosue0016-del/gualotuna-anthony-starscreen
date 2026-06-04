import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class IsStaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const isStaff = request.headers['x-is-staff'] === 'true';

    if (!isStaff) {
      throw new ForbiddenException('Solo el staff puede realizar esta acción');
    }

    return true;
  }
}
