import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post, UseGuards
} from "@nestjs/common";
import { Role } from '../entities/role.entity';
import { RoleService } from '../services/role.service';
import { GetRoleDto } from '../dto';
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "../guards/role.guard";
import { RoleProtect } from "../decorators/role.decorator";

@Controller('role')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get(':id')
  async getRole(@Param('id', ParseIntPipe) id: number): Promise<GetRoleDto> {
    const role = await this._roleService.get(id);
    return role;
  }

  @Post()
  async createRole(@Body() role: Role): Promise<GetRoleDto> {
    const createdRole = await this._roleService.create(role);
    return createdRole;
  }

  @Patch(':id')
  async updateRole(@Param('id', ParseIntPipe) id: number, @Body() role: Role) {
    await this._roleService.update(id, role);
    return true;
  }

  @Delete(':id')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    await this._roleService.delete(id);
    return true;
  }
}
