import { AirlineApi } from './airlineApis/airlineApi';
import { IraqiAirwaysApi } from './airlineApis/iraqiAirwaysApi';
import { AirArabiaApi } from './airlineApis/airArabiaApi';
import { QatarAirwaysApi } from './airlineApis/qatarAirwaysApi';
import { RoyalJordanianApi } from './airlineApis/royalJordanianApi';
import { EgyptAirApi } from './airlineApis/egyptAirApi';
import { MiddleEastAirlinesApi } from './airlineApis/middleEastAirlinesApi';
import { TurkishAirlinesApi } from './airlineApis/turkishAirlinesApi';
import { UrAirlinesApi } from './airlineApis/urAirlinesApi';
import { SabreApi } from './airlineApis/sabreApi';
import { APIConnection } from './types';
import { logger } from '../utils/logger';

export class ApiFactory {
  static createApiInstance(connection: APIConnection): AirlineApi {
    switch (connection.supplier.name.toLowerCase()) {
      case 'iraqi airways':
        return new IraqiAirwaysApi(connection);
      case 'air arabia':
        return new AirArabiaApi(connection);
      case 'qatar airways':
        return new QatarAirwaysApi(connection);
      case 'royal jordanian':
        return new RoyalJordanianApi(connection);
      case 'egyptair':
        return new EgyptAirApi(connection);
      case 'middle east airlines':
        return new MiddleEastAirlinesApi(connection);
      case 'turkish airlines':
        return new TurkishAirlinesApi(connection);
      case 'ur airlines':
        return new UrAirlinesApi(connection);
      case 'sabre gds':
        return new SabreApi(connection);
      default:
        logger.warn(`No specific API implementation for ${connection.supplier.name}. Using generic AirlineApi.`);
        return new GenericAirlineApi(connection);
    }
  }
}

class GenericAirlineApi implements AirlineApi {
  constructor(private connection: APIConnection) {}

  async searchFlights(params: any): Promise<any[]> {
    logger.info('Searching flights with generic API', { supplier: this.connection.supplier.name, params });
    // Implement generic search method using this.connection properties
    return [];
  }

  async getFlightStatus(flightId: string): Promise<any> {
    logger.info('Getting flight status with generic API', { supplier: this.connection.supplier.name, flightId });
    // Implement generic flight status method using this.connection properties
    return { status: 'UNKNOWN' };
  }
}
