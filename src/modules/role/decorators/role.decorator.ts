import { SetMetadata } from '@nestjs/common';

export const RoleProtect = (...roles: string[]) => SetMetadata('roles', roles);
