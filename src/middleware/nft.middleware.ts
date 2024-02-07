import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    try {

      let data: any = {};

      data.ip = req.headers['x-real-ip'] || req.ip;

      // Obtén la fecha actual en UTC
      const dateUTC = new Date();

      // Ajusta la zona horaria a UTC-5
      const dateUTCMinus5 = new Date(dateUTC.getTime() - (5 * 60 * 60 * 1000));

      // Formatea la fecha en formato ISO
      data.time = dateUTCMinus5.toISOString();

      data.endpoint = `${req.method} ${req.url}`;

      // body del request si es un JSON
      if (req.body && Object.keys(req.body).length) {
        data.request = JSON.stringify(req.body);
      }

      const authorizationToken = req.headers['authorization']?.substring(7);
      data.access_token = authorizationToken;

      if (authorizationToken) {
        const jwt = require('jsonwebtoken');
        const decodedToken = jwt.decode(authorizationToken);
        if (decodedToken && decodedToken.id) {
          data.projectId = decodedToken.id;
        } else {
          console.log('Error: Invalid token or missing ID');
        }
      } else {
        console.log('Error: Authorization token missing');
      }

      const originalSend = res.send;
      res.send = function (body): any {
        if (body !== undefined) {
          data.response = body;
        }

        // const status = res.statusCode;
        data.status_code = res.statusCode;

        // Obtener la fecha actual cuando se envía la respuesta
        const setFinishTime = new Date();

        // Calcular la diferencia de tiempo en milisegundos
        const responseTime = setFinishTime.getTime() - dateUTC.getTime();
        data.duration = `${responseTime}ms`;

        console.log(" => body para la base de datos", data)
        // No hagas nada más, solo imprime en consola
        return originalSend.apply(res, arguments);
      };

      // Aquí puedes realizar lógica adicional si es necesario
      next();
      // Llamar a next sin parámetros, ya que no estás manejando errores directamente en este middleware
    } catch (error) {
      console.error('Error en el middleware:', error.message);
      next(error);
    }
  }
}