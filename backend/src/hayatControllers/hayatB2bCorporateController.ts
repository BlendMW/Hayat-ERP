import { Request, Response } from 'express';
import { API } from 'aws-amplify';
import { CharterFlight } from '../models/CharterFlight';
import { PricingRule } from '../models/PricingRule';
import { FlightSource } from '../models/FlightSource';
import { SourcePriority } from '../models/SourcePriority';
import { SeatMap } from '../models/SeatMap';
import { AncillaryService } from '../models/AncillaryService';
import { broadcastMessage } from '../services/websocketService';
import { Refund } from '../models/Refund';
import { FlightPolicy } from '../models/FlightPolicy';
import { Booking } from '../models/Booking'; // Assuming you have a Booking model
import { processRefund, createCharge } from '../services/paymentService';
import { Notification } from '../models/Notification';
import { CommunicationChannel } from '../models/CommunicationChannel';
import { createNotification } from '../services/notificationService';
import { LoyaltyProgram } from '../models/LoyaltyProgram';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import { performMetaSearch } from '../services/metaSearchService';
import { HayatError } from '../utils/errorHandling';
import { trackAffiliateClick, trackAffiliateConversion } from '../services/analyticsService';
import { Tenant } from '../models/Tenant';
import { Wallet } from '../models/Wallet';
import { HoldTimer } from '../models/HoldTimer';
import { sendNotification } from '../services/notificationService';

export const hayatSearchFlights = async (req: Request, res: Response) => {
  try {
    const flights = await API.get('hayatFlightAPI', '/flights', {
      queryStringParameters: req.query
    });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Error searching flights' });
  }
};

export const hayatBulkBookFlights = async (req: Request, res: Response) => {
  try {
    const bookings = await API.post('hayatBookingAPI', '/bulk-book', {
      body: req.body
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error booking flights' });
  }
};

export const hayatGetCorporateInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await API.get('hayatInvoiceAPI', '/corporate-invoices', {
      queryStringParameters: { tenantId: req.user.attributes['custom:tenant'] }
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching invoices' });
  }
};

// Add this method to the existing file
export const hayatCustomizeDashboard = async (req: Request, res: Response) => {
  try {
    const { logo, colors } = req.body;
    const tenantId = req.user.attributes['custom:tenant'];
    
    const customization = await API.post('hayatTenantAPI', '/customize-dashboard', {
      body: { tenantId, logo, colors }
    });
    
    res.json(customization);
  } catch (error) {
    res.status(500).json({ error: 'Error customizing dashboard' });
  }
};

export class HayatB2bCorporateController {
  async createCharterFlight(flightData: Partial<CharterFlight>) {
    const newFlight = await CharterFlight.create(flightData);
    return newFlight;
  }

  async updateCharterFlight(id: string, flightData: Partial<CharterFlight>) {
    const flight = await CharterFlight.get(id);
    Object.assign(flight, flightData);
    await flight.save();
    return flight;
  }

  async createPricingRule(ruleData: Partial<PricingRule>) {
    const newRule = await PricingRule.create(ruleData);
    return newRule;
  }

  async updatePricingRule(id: string, ruleData: Partial<PricingRule>) {
    const rule = await PricingRule.get(id);
    Object.assign(rule, ruleData);
    await rule.save();
    return rule;
  }

  async getCharterFlights() {
    const flights = await CharterFlight.scan();
    return flights;
  }

  async getPricingRules(charterFlightId: string) {
    const rules = await PricingRule.query(charterFlightId);
    return rules;
  }

  async getFlightSources() {
    const sources = await FlightSource.scan();
    return sources;
  }

  async createFlightSource(sourceData: Partial<FlightSource>) {
    const newSource = await FlightSource.create(sourceData);
    return newSource;
  }

  async updateFlightSource(id: string, sourceData: Partial<FlightSource>) {
    const source = await FlightSource.get(id);
    Object.assign(source, sourceData);
    await source.save();
    return source;
  }

  async getSourcePriorities(tenantId: string) {
    const priorities = await SourcePriority.query(tenantId);
    return priorities;
  }

  async createSourcePriority(priorityData: Partial<SourcePriority>) {
    const newPriority = await SourcePriority.create(priorityData);
    return newPriority;
  }

  async updateSourcePriority(id: string, priorityData: Partial<SourcePriority>) {
    const priority = await SourcePriority.get(id);
    Object.assign(priority, priorityData);
    await priority.save();
    return priority;
  }

  async searchFlights(searchParams: any, tenantId: string, userId?: string) {
    const sourcePriorities = await this.getSourcePriorities(tenantId);
    const userPriorities = userId ? sourcePriorities.filter(p => p.userId === userId) : [];
    const tenantPriorities = sourcePriorities.filter(p => !p.userId);

    const prioritizedSources = this.getPrioritizedSources(userPriorities, tenantPriorities);

    let flights = [];
    for (const source of prioritizedSources) {
      const sourceFlights = await this.searchFlightsFromSource(source, searchParams);
      flights = [...flights, ...sourceFlights];
      if (flights.length >= 20) break; // Stop searching after finding 20 flights
    }

    return flights;
  }

  private getPrioritizedSources(userPriorities: SourcePriority[], tenantPriorities: SourcePriority[]): FlightSource[] {
    const priorityMap = new Map<string, number>();
    
    tenantPriorities.forEach(p => priorityMap.set(p.sourceId, p.priority));
    userPriorities.forEach(p => priorityMap.set(p.sourceId, p.priority)); // User priorities override tenant priorities

    const sources = await FlightSource.scan({ filter: { isActive: { eq: true } } });
    return sources.sort((a, b) => (priorityMap.get(b.id) || 0) - (priorityMap.get(a.id) || 0));
  }

  private async searchFlightsFromSource(source: FlightSource, searchParams: any) {
    // Implement the logic to search flights from a specific source
    // This could involve calling different APIs or services based on the source type
    switch (source.type) {
      case 'DIRECT_API':
        return this.searchDirectApi(source, searchParams);
      case 'GDS':
        return this.searchGDS(source, searchParams);
      case 'AGGREGATOR':
        return this.searchAggregator(source, searchParams);
      default:
        return [];
    }
  }

  // Implement methods for searching different source types
  private async searchDirectApi(source: FlightSource, searchParams: any) {
    // Implement direct API search
  }

  private async searchGDS(source: FlightSource, searchParams: any) {
    // Implement GDS search
  }

  private async searchAggregator(source: FlightSource, searchParams: any) {
    // Implement aggregator search
  }

  async getSeatMap(flightId: string) {
    const seatMap = await SeatMap.query(flightId);
    return seatMap[0]; // Assuming one seat map per flight
  }

  async updateSeatMap(flightId: string, seatMapData: Partial<SeatMap>) {
    const seatMap = await SeatMap.query(flightId);
    if (seatMap.length > 0) {
      Object.assign(seatMap[0], seatMapData);
      await seatMap[0].save();
      return seatMap[0];
    }
    return null;
  }

  async getAncillaryServices(flightId?: string) {
    if (flightId) {
      return AncillaryService.query(flightId);
    }
    return AncillaryService.scan();
  }

  async createAncillaryService(serviceData: Partial<AncillaryService>) {
    const newService = await AncillaryService.create(serviceData);
    return newService;
  }

  async updateAncillaryService(id: string, serviceData: Partial<AncillaryService>) {
    const service = await AncillaryService.get(id);
    Object.assign(service, serviceData);
    await service.save();
    return service;
  }

  async lockSeat(flightId: string, seatNumber: string, connectionId: string) {
    const seatMap = await this.getSeatMap(flightId);
    if (!seatMap.lockedSeats.includes(seatNumber)) {
      seatMap.lockedSeats.push(seatNumber);
      await seatMap.save();
      await broadcastMessage(await this.getFlightConnections(flightId), {
        type: 'SEAT_LOCKED',
        flightId,
        seatNumber,
      });
      return true;
    }
    return false;
  }

  async unlockSeat(flightId: string, seatNumber: string) {
    const seatMap = await this.getSeatMap(flightId);
    seatMap.lockedSeats = seatMap.lockedSeats.filter(seat => seat !== seatNumber);
    await seatMap.save();
    await broadcastMessage(await this.getFlightConnections(flightId), {
      type: 'SEAT_UNLOCKED',
      flightId,
      seatNumber,
    });
  }

  private async getFlightConnections(flightId: string): Promise<string[]> {
    // Implement logic to get all WebSocket connections for a specific flight
    // This could be stored in a database or in-memory cache
  }

  async getBooking(bookingId: string) {
    return Booking.get(bookingId);
  }

  async modifyBooking(bookingId: string, modificationData: any) {
    const booking = await this.getBooking(bookingId);
    const policy = await this.getFlightPolicy(booking.flightId);
    
    // Check if modification is allowed
    if (!this.isModificationAllowed(booking, policy)) {
      throw new Error('Modification not allowed for this booking');
    }

    // Calculate modification fee
    const modificationFee = this.calculateModificationFee(booking, policy);

    // Apply modifications
    Object.assign(booking, modificationData);
    await booking.save();

    // Create a charge for the modification fee if applicable
    if (modificationFee > 0) {
      await this.createCharge(booking.userId, modificationFee, 'Modification Fee');
    }

    return booking;
  }

  async cancelBooking(bookingId: string) {
    const booking = await this.getBooking(bookingId);
    const policy = await this.getFlightPolicy(booking.flightId);

    // Check if cancellation is allowed
    if (!this.isCancellationAllowed(booking, policy)) {
      throw new Error('Cancellation not allowed for this booking');
    }

    // Calculate refund amount
    const refundAmount = this.calculateRefundAmount(booking, policy);

    // Process refund
    const refund = await this.processRefund(booking, refundAmount);

    // Update booking status
    booking.status = 'CANCELLED';
    await booking.save();

    return { booking, refund };
  }

  async getFlightPolicy(flightId: string) {
    return FlightPolicy.get(flightId);
  }

  private isModificationAllowed(booking: Booking, policy: FlightPolicy) {
    const now = new Date();
    const departureTime = new Date(booking.departureTime);
    const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilDeparture >= policy.deadlineHours;
  }

  private isCancellationAllowed(booking: Booking, policy: FlightPolicy) {
    return policy.isRefundable || this.isModificationAllowed(booking, policy);
  }

  private calculateModificationFee(booking: Booking, policy: FlightPolicy) {
    if (this.isModificationAllowed(booking, policy)) {
      return 0;
    }
    return policy.modificationFee;
  }

  private calculateRefundAmount(booking: Booking, policy: FlightPolicy) {
    if (!policy.isRefundable) {
      return 0;
    }
    if (this.isModificationAllowed(booking, policy)) {
      return booking.totalPrice;
    }
    return Math.max(0, booking.totalPrice - policy.cancellationFee);
  }

  private async processRefund(booking: Booking, amount: number) {
    const refund = await Refund.create({
      bookingId: booking.id,
      amount,
      status: 'PENDING',
      type: amount === booking.totalPrice ? 'FULL' : 'PARTIAL',
    });

    // Integrate with payment gateway to process the refund
    // This is a placeholder for the actual integration
    await this.processPaymentRefund(booking.paymentId, amount);

    refund.status = 'PROCESSED';
    refund.processedAt = new Date().toISOString();
    await refund.save();

    return refund;
  }

  private async processPaymentRefund(paymentId: string, amount: number) {
    const success = await processRefund(paymentId, amount);
    if (!success) {
      throw new Error('Failed to process refund');
    }
  }

  private async createCharge(userId: string, amount: number, description: string) {
    const chargeId = await createCharge(userId, amount, description);
    if (!chargeId) {
      throw new Error('Failed to create charge');
    }
    return chargeId;
  }

  async getNotifications(userId: string) {
    return Notification.query(userId);
  }

  async getCommunicationChannels(userId: string) {
    return CommunicationChannel.query(userId);
  }

  async createCommunicationChannel(channelData: Partial<CommunicationChannel>) {
    return CommunicationChannel.create(channelData);
  }

  async updateCommunicationChannel(id: string, channelData: Partial<CommunicationChannel>) {
    const channel = await CommunicationChannel.get(id);
    Object.assign(channel, channelData);
    await channel.save();
    return channel;
  }

  async sendNotification(userId: string, type: string, content: string, channelId: string) {
    return createNotification(userId, type, content, channelId);
  }

  // Add this method to handle booking confirmations
  async sendBookingConfirmation(bookingId: string) {
    const booking = await this.getBooking(bookingId);
    const user = await this.getUser(booking.userId);
    const channel = await this.getDefaultCommunicationChannel(user.id);

    const content = `Your booking (ID: ${bookingId}) has been confirmed. Thank you for choosing Hayat ERP!`;
    await this.sendNotification(user.id, 'BOOKING_CONFIRMATION', content, channel.id);
  }

  // Add more methods for other types of notifications (e.g., flight updates, reminders)

  async getLoyaltyProgram(tenantId: string) {
    const programs = await LoyaltyProgram.query(tenantId);
    return programs[0]; // Assuming one program per tenant
  }

  async updateLoyaltyProgram(tenantId: string, programData: Partial<LoyaltyProgram>) {
    const programs = await LoyaltyProgram.query(tenantId);
    if (programs.length > 0) {
      Object.assign(programs[0], programData);
      await programs[0].save();
      return programs[0];
    }
    return null;
  }

  async getUserLoyaltyPoints(userId: string) {
    const user = await User.get(userId);
    const transactions = await Transaction.query(userId);
    
    const now = new Date();
    let activePoints = 0;

    for (const transaction of transactions) {
      if (new Date(transaction.expiresAt) > now) {
        activePoints += transaction.points;
      }
    }

    user.loyaltyPoints = activePoints;
    await user.save();

    return activePoints;
  }

  async addLoyaltyPoints(userId: string, bookingId: string, amount: number) {
    const user = await User.get(userId);
    const program = await this.getLoyaltyProgram(user.tenantId);
    
    const points = Math.floor(amount * program.pointsPerCurrency);
    user.loyaltyPoints += points;
    await user.save();

    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + program.expirationMonths);

    await Transaction.create({
      userId,
      type: 'EARN',
      points,
      bookingId,
      description: `Earned points for booking ${bookingId}`,
      createdAt: new Date().toISOString(),
      expiresAt: expirationDate.toISOString(),
    });

    return points;
  }

  async redeemLoyaltyPoints(userId: string, points: number, description: string) {
    const user = await User.get(userId);
    if (user.loyaltyPoints < points) {
      throw new Error('Insufficient points');
    }

    user.loyaltyPoints -= points;
    await user.save();

    await Transaction.create({
      userId,
      type: 'REDEEM',
      points: -points,
      description,
      createdAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(), // Redeemed points expire immediately
    });

    return user.loyaltyPoints;
  }

  async getLoyaltyTransactions(userId: string) {
    return Transaction.query(userId);
  }

  async performMetaSearch(searchParams: any) {
    try {
      const internalResults = await this.searchFlights(searchParams);
      const externalResults = await performMetaSearch(searchParams);
      return {
        internal: internalResults,
        external: externalResults,
      };
    } catch (error) {
      if (error instanceof HayatError) {
        throw error;
      }
      console.error('Error performing meta-search:', error);
      throw new HayatError('An error occurred while performing the meta-search', 500);
    }
  }

  async trackAffiliateClick(userId: string, metaSearchResultId: string, providerId: string) {
    await trackAffiliateClick(userId, metaSearchResultId, providerId);
  }

  async trackAffiliateConversion(userId: string, metaSearchResultId: string, providerId: string, amount: number) {
    await trackAffiliateConversion(userId, metaSearchResultId, providerId, amount);
  }

  async getTenant(tenantId: string) {
    return Tenant.get(tenantId);
  }

  async updateTenant(tenantId: string, tenantData: Partial<Tenant>) {
    const tenant = await Tenant.get(tenantId);
    Object.assign(tenant, tenantData);
    await tenant.save();
    return tenant;
  }

  async getWallet(tenantId: string) {
    const wallets = await Wallet.query(tenantId);
    return wallets[0]; // Assuming one wallet per tenant
  }

  async updateWallet(tenantId: string, walletData: Partial<Wallet>) {
    const wallet = await this.getWallet(tenantId);
    Object.assign(wallet, walletData);
    await wallet.save();
    return wallet;
  }

  async checkCreditLimit(tenantId: string, amount: number): Promise<boolean> {
    const wallet = await this.getWallet(tenantId);
    return wallet.balance + wallet.creditLimit >= amount;
  }

  async createBooking(bookingData: any, tenantId: string): Promise<any> {
    const hasSufficientCredit = await this.checkCreditLimit(tenantId, bookingData.totalPrice);
    if (!hasSufficientCredit) {
      throw new Error('Insufficient credit');
    }

    // Proceed with booking creation
    // ... existing booking creation logic

    // Update wallet balance
    const wallet = await this.getWallet(tenantId);
    wallet.balance -= bookingData.totalPrice;
    await wallet.save();

    return booking;
  }

  async reserveFlight(userId: string, flightId: string, holdDurationMinutes: number = 30) {
    const booking = await Booking.create({
      userId,
      flightId,
      status: 'RESERVED',
      holdExpiresAt: new Date(Date.now() + holdDurationMinutes * 60000).toISOString(),
    });

    await HoldTimer.create({
      bookingId: booking.id,
      expiresAt: booking.holdExpiresAt,
    });

    // Schedule a notification for 5 minutes before expiration
    const notificationTime = new Date(booking.holdExpiresAt);
    notificationTime.setMinutes(notificationTime.getMinutes() - 5);
    await this.scheduleHoldExpirationNotification(booking.id, notificationTime);

    return booking;
  }

  async confirmBooking(bookingId: string) {
    const booking = await Booking.get(bookingId);
    if (booking.status !== 'RESERVED' || new Date(booking.holdExpiresAt) < new Date()) {
      throw new HayatError('Booking hold has expired', 400);
    }

    booking.status = 'CONFIRMED';
    await booking.save();

    // Remove the hold timer
    const holdTimer = await HoldTimer.query(bookingId);
    if (holdTimer.length > 0) {
      await holdTimer[0].delete();
    }

    return booking;
  }

  async cancelReservation(bookingId: string) {
    const booking = await Booking.get(bookingId);
    if (booking.status !== 'RESERVED') {
      throw new HayatError('Booking is not in a reserved state', 400);
    }

    booking.status = 'CANCELLED';
    await booking.save();

    // Remove the hold timer
    const holdTimer = await HoldTimer.query(bookingId);
    if (holdTimer.length > 0) {
      await holdTimer[0].delete();
    }

    return booking;
  }

  async getUserReservations(userId: string) {
    return Booking.query(userId, {
      filter: {
        status: { eq: 'RESERVED' },
      },
    });
  }

  private async scheduleHoldExpirationNotification(bookingId: string, notificationTime: Date) {
    const booking = await Booking.get(bookingId);
    const user = await User.get(booking.userId);
    const flight = await Flight.get(booking.flightId);

    // Create a notification record
    await Notification.create({
      userId: user.id,
      type: 'HOLD_EXPIRATION',
      content: `Your hold for flight ${flight.flightNumber} will expire in 5 minutes.`,
      status: 'PENDING',
      scheduledFor: notificationTime.toISOString(),
    });
  }
}
