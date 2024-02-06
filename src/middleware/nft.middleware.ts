import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class Middleware implements NestMiddleware {
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

    // Imprimir el body del request si es un JSON
    if (req.body && Object.keys(req.body).length) {
      console.log("Request JSON:");
      console.log(req.body);
    }

    const authorizationToken = req.headers['authorization'].substring(7); 
    console.log('Authorization Token:', authorizationToken);

    const jwt = require('jsonwebtoken');
    const token = authorizationToken
    const id = jwt.decode(token).id;
    console.log('ID:', id);

    // const originalSend = res.send;
    res.send = function(body): any {
      if (body !== undefined) {
        // Si hay un cuerpo de respuesta, imprímelo
        console.log("Response JSON:");
        console.log(body);
      }
    
      // Imprimir el código de estado de la respuesta
      console.log("Status Code:", res.statusCode);
    
      // No hagas nada más, solo imprime en consola
    };

    res.on('finish', () => {
      // Obtener la fecha actual cuando se envía la respuesta
      const setFinishTime = new Date();

      // Calcular la diferencia de tiempo en milisegundos
      const responseTime = setFinishTime.getTime() - DateUTC.getTime();
      console.log(`Response Time: ${responseTime}ms`);
    });

    // Aquí puedes realizar lógica adicional si es necesario

    next(); // Llamar a next sin parámetros, ya que no estás manejando errores directamente en este middleware
  }
}

