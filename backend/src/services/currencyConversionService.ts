import axios from 'axios';
import { logger } from '../utils/logger';

export class CurrencyConversionService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.CURRENCY_API_BASE_URL || 'https://api.exchangeratesapi.io/v1';
    this.apiKey = process.env.CURRENCY_API_KEY || 'your-api-key';
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      const response = await axios.get(`${this.baseUrl}/latest`, {
        params: {
          base: fromCurrency,
          symbols: toCurrency,
          access_key: this.apiKey,
        },
      });

      const rate = response.data.rates[toCurrency];
      if (!rate) {
        throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
      }

      const convertedAmount = amount * rate;
      logger.info(`Converted ${amount} ${fromCurrency} to ${convertedAmount} ${toCurrency}`);
      return Number(convertedAmount.toFixed(2));
    } catch (error) {
      logger.error('Error converting currency', error as Error, { amount, fromCurrency, toCurrency });
      throw error;
    }
  }
}
