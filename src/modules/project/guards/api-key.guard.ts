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
    const apiKey = request.query['api-key'];
    const user = request.user;
    console.log('User 2:', user);
    console.log('API Key:', apiKey);

    if (!apiKey) {
      return false;
    }
    return this.validateApiKey(user, apiKey);
  }

  async validateApiKey(user: User, apiKey: string): Promise<boolean> {
    return await this.projectService.validateApiKey(user, apiKey);
  }
}
