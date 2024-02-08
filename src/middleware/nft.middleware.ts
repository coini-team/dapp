import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class Middleware implements NestMiddleware {
  private readonly logger = new Logger(Middleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    try {
      const data: any = {};

      data.ip = req.headers['x-real-ip'] || req.ip;
      data.call_date = new Date(new Date().getTime() - (5 * 60 * 60 * 1000)).toISOString();
      data.endpoint = `${req.method} ${req.url}`;

      if (req.body && Object.keys(req.body).length) {
        data.request = JSON.stringify(req.body);
      }

      const authorizationToken = req.headers['authorization']?.substring(7);
      data.accessToken = authorizationToken;

      if (authorizationToken) {
        const jwt = require('jsonwebtoken');
        const decodedToken = jwt.decode(authorizationToken);
        if (decodedToken && decodedToken.id) {
          data.projectId = decodedToken.id;
        } else {
          this.logger.error('Invalid token or missing ID');
        }
      } else {
        this.logger.error('Authorization token missing');
      }

      const originalSend = res.send;
      res.send = function (body): any {
        if (body !== undefined) {
          data.response = body;
        }

        data.statusCode = res.statusCode;

        const setFinishTime = new Date();
        const responseTime = setFinishTime.getTime() - new Date(data.call_date).getTime();
        data.duration = `${responseTime}ms`;

        async function sendData() {
          console.log(" => body para la base de datos", data);
          await axios.post('http://localhost:8080/api/requests', data);
          console.log(" => body enviado a la base de datos");
        }
        sendData();
        return originalSend.apply(res, arguments);
      };



      next();
    } catch (error) {
      this.logger.error('Error en el middleware:', error.message);
      next(error);
    }
  }
}
