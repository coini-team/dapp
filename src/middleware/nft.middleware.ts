import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestService } from '../modules/requests/services/request.service';
import jwt, { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class Middleware implements NestMiddleware {
  private readonly logger = new Logger(Middleware.name);

  constructor(private readonly _requestService: RequestService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    // TODO: Create a DTO for the request data
    try {
      const data: any = {
        ip: req.headers['x-real-ip'] || req.ip,
        call_date: new Date().toISOString(),
        endpoint: `${req.method} ${req.url}`,
        accessToken: req.headers['authorization']?.substring(7),
      };
  
      if (req.body && Object.keys(req.body).length) {
        data.request = JSON.stringify(req.body);
      }
  
      if (data.accessToken) {
        const decodedToken: jwt.JwtPayload = <JwtPayload>(
          jwt.decode(data.accessToken)
        );
        if (decodedToken && decodedToken.id) {
          data.projectId = decodedToken.id;
        } else {
          this.logger.error('Invalid token or missing ID');
        }
      } else {
        this.logger.error('Authorization token missing');
      }
  
      const originalSend = res.send.bind(res);
      res.send = (body: any) => {
        data.response = body;
        data.statusCode = res.statusCode;
        data.duration = `${
          new Date().getTime() - new Date(data.call_date).getTime()
        }ms`;
  
        this._requestService
          .create(data)
          .then(() => {
            this.logger.log('Data saved successfully');
          })  
        return originalSend(body);
      };
  
      next();
    } catch (error) {
      this.logger.error('Error to save data: ' + error.message);
    }
    
  }
}
