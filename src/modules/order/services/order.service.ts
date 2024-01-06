// Third Party Dependencies.
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

// Local Dependencies.
import { ConfigService } from '../../../config/config.service';
import { OrderReceiveDto } from '../dto/order-receive.dto';
import { Coini } from '../../../config/config.keys';

@Injectable()
export class OrderService {
  private readonly _logger: Logger = new Logger('OrderService', {
    timestamp: true,
  });

  constructor(
    private readonly _configService: ConfigService,
    private readonly _httpService: HttpService,
  ) {}

  /**
   * @memberof OrderService
   * @description Send an order to Coini for processing.
   * @param {OrderReceiveDto} orderDto
   * @returns {Promise<number>}
   */
  async sendOrderToCoini(orderDto: OrderReceiveDto): Promise<number> {
    // Get the Coini API URL from the config.
    const COINI_API_URL: string = this._configService.get(Coini.COINI_API_URL);

    try {
      // Send the order to Coini.
      const response: AxiosResponse<any> = await lastValueFrom(
        this._httpService.post(`${COINI_API_URL}/order/receive`, orderDto),
      );

      return response.status;
    } catch (error) {
      this._logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
