import { BookingProvider } from '../providers/bookingProvider';

export const generatePNRFromProvider = async (bookingData: any, tenant: string): Promise<string> => {
  const provider = new BookingProvider(tenant);
  return provider.generatePNR(bookingData);
};
