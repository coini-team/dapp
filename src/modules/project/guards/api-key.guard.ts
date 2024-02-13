import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly projectService: ProjectService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      return false;
    }
    return this.validateApiKey(apiKey);
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    return await this.projectService.validateApiKey(apiKey);
  }
}
