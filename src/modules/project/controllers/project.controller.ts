// Third Party Dependencies.
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Query,
} from '@nestjs/common';

// Local Dependencies.
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { Project } from '../entities/project.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly _projectService: ProjectService) {}

  /**
   * @memberof ProjectController
   * @description Create a new Project Endpoint.
   * @param {string} authHeader
   * @param {CreateProjectDto} createProjectDto
   * @returns {Promise<{ status: string; message: string; project_id: string }>}
   */
  @Post()
  create(
    @Headers('authorization') authHeader: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    // return this._projectService.create(authHeader, createProjectDto);
    return 'ok'
  }


  /**
   * @memberof ProjectController
   * @description Find all Projects Endpoint.
   * @param {string} authHeader
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<Project[]>}
   */
  @Get()
  findAll(
    @Headers('authorization') authHeader: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Project[]> {
    return this._projectService.findAll(authHeader, page, limit);
  }

  /**
   * @memberof ProjectController
   * @description Find one Project by ID Endpoint.
   * @param {string} authHeader
   * @param {string} id
   * @returns {Promise<Project>}
   */
  @Get(':id')
  findOne(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
  ): Promise<Project> {
    return this._projectService.findOne(authHeader, id);
  }

  /**
   * @memberof ProjectController
   * @description Update a Project by ID Endpoint.
   * @param {string} authHeader
   * @param {string} id
   * @param {UpdateProjectDto} updateProjectDto
   * @returns {Promise<{ status: string; message: string }>}
   */
  @Patch(':id')
  update(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<{ status: string; message: string; project: Project }> {
    return this._projectService.update(authHeader, id, updateProjectDto);
  }

  /**
   * @memberof ProjectController
   * @description Delete a Project by ID Endpoint.
   * @param {string} authHeader
   * @param {string} id
   * @returns {Promise<{ status: string; message: string }>}
   */
  @Delete()
  remove(
    @Headers('authorization') authHeader: string,
    @Query('id') id: string,
  ): Promise<{ status: string; message: string }> {
    return this._projectService.remove(authHeader, id);
  }
}
