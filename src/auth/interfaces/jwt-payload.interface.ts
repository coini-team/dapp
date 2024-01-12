import { RoleTypeEnum } from '../../shared/enums/role-type.enum';

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  roles: RoleTypeEnum[];
  iat?: Date;
}
