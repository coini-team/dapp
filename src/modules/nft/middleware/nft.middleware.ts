import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class NftMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const ip = req.headers['x-real-ip'] || req.ip; 

        // Obtén la fecha actual en UTC
    const DateUTC = new Date();

    // Ajusta la zona horaria a UTC-5
    const DateUTCMinus5 = new Date(DateUTC.getTime() - (5 * 60 * 60 * 1000));

    // Formatea la fecha en formato ISO
    const time = DateUTCMinus5.toISOString();

    console.log("=> Datos del Middleware");
    console.log(`Request: ${req.method} ${req.url}`);
    console.log(`IP: ${ip}, Time: ${time}`);

    // Aquí puedes realizar lógica adicional si es necesario

    next(); // Llamar a next sin parámetros, ya que no estás manejando errores directamente en este middleware
  }
}

