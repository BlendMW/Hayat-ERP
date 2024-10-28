import { PNRGenerator } from '../utils/pnrGenerator';
import { BookingRepository } from '../repositories/bookingRepository';

export class BookingProvider {
  private pnrGenerator: PNRGenerator;
  private bookingRepository: BookingRepository;

  constructor(private tenantId: string) {
    this.pnrGenerator = new PNRGenerator(tenantId);
    this.bookingRepository = new BookingRepository(tenantId);
  }

  async generatePNR(bookingData: any): Promise<string> {
    let pnr: string = '';
    let isUnique = false;

    while (!isUnique) {
      pnr = this.pnrGenerator.generatePNR();
      isUnique = await this.bookingRepository.isPNRUnique(pnr);
    }

    await this.bookingRepository.createBooking(pnr, bookingData);

    return pnr;
  }

  // Add other booking-related methods here
}
