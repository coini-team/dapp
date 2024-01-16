// Third Party Dependencies.
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Headers,
  Logger,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Local Dependencies.
import { AuthService } from '../../../auth/services/auth.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { Project } from '../entities/project.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class ProjectService {
  private readonly _logger = new Logger(':::: Project Service ::::', {
    timestamp: true,
  });

  constructor(
    private readonly _authService: AuthService,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  /**
   * @memberof ProjectService
   * @description Create a new Project for an Organization or User.
   * @param {string} authHeader
   * @param {CreateProjectDto} createProjectDto
   * @returns {Promise<{ status: string; message: string; project_id: string }>}
   * @throws {BadRequestException, ConflictException, ForbiddenException}
   */
  async create(
    @Headers('authorization') authHeader: string,
    createProjectDto: CreateProjectDto,
  ): Promise<{ status: string; message: string; project_id: string }> {
    try {
      // Verify if Authorization header is valid.
      const user = await this._authService.getUserFromAuthToken(authHeader);

      // Destructure CreateProjectDto.
      const { organization_id } = createProjectDto;

      // Check if Organization ID or User ID is provided.
      if (!organization_id)
        throw new ForbiddenException('Organization ID must be provided.');

      // TODO: Uncomment this when Organization is implemented.
      // Search for Organization.
      // organization_id && (await this.authService.findOrganization(organization_id));

      // Create Project.
      const project: Project = this.projectRepository.create({
        ...createProjectDto,
        accessToken: '',
        refreshToken: '',
        users: [{ id: user.id } as User],
      });

      if (!project)
        throw new ConflictException('Project could not be created.');

      // Save Project.
      const savedProject = await this.projectRepository.save(project);

      // Generate Access Token.
      const {
        accessToken,
        refreshToken,
      }: { accessToken: string; refreshToken: string } =
        this._authService.generateTokens({
          id: project.id,
          name: createProjectDto.name,
        });

      await this.projectRepository.update(savedProject.id, {
        accessToken: accessToken,
        refreshToken: refreshToken,
      });

      return {
        status: 'success',
        message: 'Project created',
        project_id: project.id,
      };
    } catch (error) {
      this._logger.error(error);
      throw new BadRequestException(error);
    }
  }

  /**
   * @memberof ProjectService
   * @description Find all Projects for an Organization or User.
   * @param {string} authHeader
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<Project[]>}
   */
  async findAll(
    @Headers('authorization') authHeader: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Project[]> {
    try {
      // Verify if Authorization header is valid.
      const user = await this._authService.getUserFromAuthToken(authHeader);

      // Calculate startIndex.
      const startIndex = (page - 1) * limit;

      // Find Projects with pagination.
      const projects = await this.projectRepository
        .createQueryBuilder('project')
        .innerJoin('project.users', 'user')
        .where('user.id = :userId', { userId: user.id })
        .orderBy('project.createdAt', 'DESC')
        .skip(startIndex)
        .take(limit)
        .getMany();

      return projects;
    } catch (error) {
      this._logger.error(error);
      throw new BadRequestException(error);
    }
  }

  /**
   * @memberof ProjectService
   * @description Find a Project by ID.
   * @param {string} authHeader
   * @param {string} id
   * @returns {Promise<Project>}
   * @throws {BadRequestException, NotFoundException}
   */
  async findOne(
    @Headers('authorization') authHeader: string,
    id: string,
  ): Promise<Project> {
    try {
      // Verify if Authorization header is valid.
      await this._authService.getUserFromAuthToken(authHeader);
      // Search Project by ID.
      const project = await this.projectRepository.findOne(id);
      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }
      // Return Project.
      return project;
    } catch (error) {
      this._logger.error(error);
      throw new BadRequestException(error);
    }
  }

  /**
   * @memberof ProjectService
   * @description Update a Project by ID.
   * @param {string} authHeader
   * @param {string} id
   * @param {UpdateProjectDto} updateProjectDto
   * @returns {Promise<{ status: string; message: string }>}
   * @throws {BadRequestException, NotFoundException}
   */
  async update(
    @Headers('authorization') authHeader: string,
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<{ status: string; message: string; project: Project }> {
    try {
      // Verify if Authorization header is valid.
      await this._authService.getUserFromAuthToken(authHeader);

      // Search Project by ID.
      const project = await this.projectRepository.findOne(id);

      // Check if Project exists.
      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      // Update Project.
      const updatedProject = await this.projectRepository.save({
        ...project,
        ...updateProjectDto,
      });

      return {
        status: 'success',
        message: 'Project updated',
        project: updatedProject,
      };
    } catch (error) {
      this._logger.error(error);
      throw new BadRequestException(error);
    }
  }

  /**
   * @memberof ProjectService
   * @description Delete a Project by ID.
   * @param {string} authHeader
   * @param {string} id
   * @returns {Promise<{status: string, message: string}>}
   * @throws {BadRequestException, NotFoundException}
   */
  async remove(
    @Headers('authorization') authHeader: string,
    id: string,
  ): Promise<{ status: string; message: string }> {
    try {
      // Verify if Authorization header is valid.
      await this._authService.getUserFromAuthToken(authHeader);
      // Search Project by ID.
      const project = await this.projectRepository.findOne(id);
      // Check if Project exists.
      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }
      // Search all Users that have a relationship with the Project.
      const users = await this._userRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect(
          'user.projects',
          'project',
          'project.id = :projectId',
          { projectId: id },
        )
        .getMany();

      // Remove Project from Users.
      for (const user of users) {
        user.projects = user.projects.filter((project) => project.id !== id);
        await this._userRepository.save(user);
      }

      await this.projectRepository
        .createQueryBuilder()
        .delete()
        .from('access')
        .where('project_id = :projectId', { projectId: id })
        .execute();

      // Delete Project.
      await this.projectRepository.delete(id);

      return {
        status: 'success',
        message: 'Project deleted successfully.',
      };
    } catch (error) {
      this._logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
