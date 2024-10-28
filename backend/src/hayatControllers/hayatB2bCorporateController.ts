import { Request, Response } from 'express';
import { API } from 'aws-amplify';
import { HayatCharterFlight } from '../models/HayatCharterFlight';
import { HayatPricingRule } from '../models/HayatPricingRule';
import { HayatFlightSource } from '../models/HayatFlightSource';
import { HayatSourcePriority } from '../models/HayatSourcePriority';
import { HayatSeatMap } from '../models/HayatSeatMap';
import { HayatAncillaryService } from '../models/HayatAncillaryService';
import { broadcastMessage } from '../services/hayatWebsocketService';
import { HayatRefund } from '../models/HayatRefund';
import { HayatFlightPolicy } from '../models/HayatFlightPolicy';
import { HayatBooking } from '../models/HayatBooking'; // Assuming you have a Booking model
import { processRefund, createCharge } from '../services/hayatPaymentService';
import { HayatNotification } from '../models/HayatNotification';
import { HayatCommunicationChannel } from '../models/HayatCommunicationChannel';
import { createNotification } from '../services/hayatNotificationService';
import { HayatLoyaltyProgram } from '../models/HayatLoyaltyProgram';
import { HayatUser } from '../models/HayatUser';
import { HayatTransaction } from '../models/HayatTransaction';
import { performMetaSearch } from '../services/hayatMetaSearchService';
import { HayatError } from '../utils/errorHandling';
import { trackAffiliateClick, trackAffiliateConversion } from '../services/hayatAnalyticsService';
import { HayatTenant } from '../models/HayatTenant';
import { HayatWallet } from '../models/HayatWallet';
import { HayatHoldTimer } from '../models/HayatHoldTimer';
import { sendNotification } from '../services/hayatNotificationService';

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
    if (!req.user) {
      return res.status(400).json({ error: 'User information is missing' });
    }
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
    if (!req.user) {
      return res.status(400).json({ error: 'User information is missing' });
    }
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
  async createCharterFlight(flightData: Partial<HayatCharterFlight>) {
    const newFlight = new HayatCharterFlight(flightData); // Create a new instance
    await newFlight.save(); // Save the instance
    return newFlight;
  }

  async updateCharterFlight(id: string, flightData: Partial<HayatCharterFlight>) {
    const flight = await HayatCharterFlight.get(id);
    if (!flight) {
      throw new Error('Flight not found');
    }
    Object.assign(flight, flightData);
    await flight.save();
    return flight;
  }

  async createPricingRule(ruleData: Partial<HayatPricingRule>) {
    const newRule = new HayatPricingRule(ruleData); // Create a new instance
    await newRule.save(); // Save the instance
    return newRule;
  }

  async updatePricingRule(id: string, ruleData: Partial<HayatPricingRule>) {
    const rule = await HayatPricingRule.get(id);
    if (!rule) {
      throw new Error('Rule not found');
    }
    Object.assign(rule, ruleData);
    await rule.save();
    return rule;
  }

  async getCharterFlights() {
    const flights = await HayatCharterFlight.scan();
    return flights;
  }

  async getPricingRules(charterFlightId: string) {
    const rules = await HayatPricingRule.query(charterFlightId);
    return rules;
  }

  async getFlightSources() {
    const sources = await HayatFlightSource.scan();
    return sources;
  }

  async createFlightSource(sourceData: Partial<HayatFlightSource>) {
    const newSource = new HayatFlightSource(sourceData); // Create a new instance
    await newSource.save(); // Save the instance
    return newSource;
  }

  async updateFlightSource(id: string, sourceData: Partial<HayatFlightSource>) {
    const source = await HayatFlightSource.get(id);
    if (!source) {
      throw new Error('Source not found');
    }
    Object.assign(source, sourceData);
    await source.save();
    return source;
  }

  async getSourcePriorities(tenantId: string) {
    const priorities = await HayatSourcePriority.query(tenantId);
    return priorities;
  }

  async createSourcePriority(priorityData: Partial<HayatSourcePriority>) {
    const newPriority = new HayatSourcePriority(priorityData); // Create a new instance
    await newPriority.save(); // Save the instance
    return newPriority;
  }

  async updateSourcePriority(id: string, priorityData: Partial<HayatSourcePriority>) {
    const priorities = await HayatSourcePriority.query(id); // Pass id directly as a string
    if (priorities.length === 0) {
      throw new Error('Priority not found');
    }
    const priority = priorities[0];
    Object.assign(priority, priorityData);
    await priority.save();
  }

  async searchFlights(searchParams: any, tenantId: string, userId?: string) {
    const sourcePriorities = await this.getSourcePriorities(tenantId);
    const userPriorities = userId ? sourcePriorities.filter(p => p.userId === userId) : [];
    const tenantPriorities = sourcePriorities.filter(p => !p.userId);

    const prioritizedSources = await this.getPrioritizedSources(userPriorities, tenantPriorities); // Await the promise
    let flights: any[] = []; // Specify the type of the array
    for (const source of prioritizedSources) {
      const sourceFlights = await this.searchFlightsFromSource(source, searchParams);
      flights = [...flights, ...sourceFlights];
      if (flights.length >= 20) break; // Stop searching after finding 20 flights
    }

    return flights;
  }

  private async getPrioritizedSources(userPriorities: HayatSourcePriority[], tenantPriorities: HayatSourcePriority[]): Promise<HayatFlightSource[]> {
    const priorityMap = new Map<string, number>();
    
    tenantPriorities.forEach(p => priorityMap.set(p.sourceId, p.priority));
    userPriorities.forEach(p => priorityMap.set(p.sourceId, p.priority)); // User priorities override tenant priorities

    const sources = await HayatFlightSource.scan({ filter: { isActive: { eq: true } } });
    return sources.sort((a, b) => (priorityMap.get(b.id) || 0) - (priorityMap.get(a.id) || 0));
  }

  private async searchFlightsFromSource(source: HayatFlightSource, searchParams: any): Promise<any[]> {
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
        return []; // Ensure an empty array is returned by default
    }
  }

  // Implement methods for searching different source types
  private async searchDirectApi(source: HayatFlightSource, searchParams: any): Promise<any[]> {
    // Implement direct API search
    return []; // Ensure an array is returned
  }

  private async searchGDS(source: HayatFlightSource, searchParams: any): Promise<any[]> {
    // Implement GDS search
    return []; // Ensure an array is returned
  }

  private async searchAggregator(source: HayatFlightSource, searchParams: any): Promise<any[]> {
    // Implement aggregator search
    return []; // Ensure an array is returned
  }

  async getSeatMap(flightId: string) {
    const seatMap = await HayatSeatMap.query(flightId);
    return seatMap[0]; // Assuming one seat map per flight
  }

  async updateSeatMap(flightId: string, seatMapData: Partial<HayatSeatMap>) {
    const seatMap = await HayatSeatMap.query(flightId);
    if (seatMap.length > 0) {
      Object.assign(seatMap[0], seatMapData);
      await seatMap[0].save();
      return seatMap[0];
    }
    return null;
  }

  async getAncillaryServices(flightId?: string) {
    if (flightId) {
      return HayatAncillaryService.query(flightId);
    }
    return HayatAncillaryService.scan();
  }

  async createAncillaryService(serviceData: Partial<HayatAncillaryService>) {
    const newService = new HayatAncillaryService(serviceData); // Create a new instance
    await newService.save(); // Save the instance
    return newService;
  }

  async updateAncillaryService(id: string, serviceData: Partial<HayatAncillaryService>) {
    const service = await HayatAncillaryService.get(id);
    if (!service) {
      throw new Error('Service not found');
    }
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
    return []; // Return an empty array as a placeholder
  }

  async getBooking(bookingId: string) {
    return HayatBooking.get(bookingId);
  }

  async modifyBooking(bookingId: string, modificationData: any) {
    const booking = await this.getBooking(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }
    const policy = await HayatFlightPolicy.get(booking.flightId);
    if (!policy) {
      throw new Error('Flight policy not found');
    }
    
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
    if (!booking) {
      throw new Error('Booking not found');
    }
    const policy = await this.getFlightPolicy(booking.flightId);
    if (!policy) {
      throw new Error('Flight policy not found');
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
    return HayatFlightPolicy.get(flightId);
  }

  async createFlightPolicy(policyData: Partial<HayatFlightPolicy>) {
    const newPolicy = new HayatFlightPolicy(policyData); // Create a new instance
    await newPolicy.save(); // Save the instance
    return newPolicy;
  }

  async updateFlightPolicy(id: string, policyData: Partial<HayatFlightPolicy>) {
    const policy = await HayatFlightPolicy.get(id);
    if (!policy) {
      throw new Error('Policy not found');
    }
    Object.assign(policy, policyData);
    await policy.save();
    return policy;
  }

  private isModificationAllowed(booking: HayatBooking, policy: HayatFlightPolicy) {
    const now = new Date();
    const departureTime = new Date(booking.departureTime);
    const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilDeparture >= policy.deadlineHours;
  }

  private isCancellationAllowed(booking: HayatBooking, policy: HayatFlightPolicy) {
    return policy.isRefundable || this.isModificationAllowed(booking, policy);
  }

  private calculateModificationFee(booking: HayatBooking, policy: HayatFlightPolicy) {
    if (this.isModificationAllowed(booking, policy)) {
      return 0;
    }
    return policy.modificationFee;
  }

  private calculateRefundAmount(booking: HayatBooking, policy: HayatFlightPolicy) {
    if (!policy.isRefundable) {
      return 0;
    }
    if (this.isModificationAllowed(booking, policy)) {
      return booking.totalPrice;
    }
    return Math.max(0, booking.totalPrice - policy.cancellationFee);
  }

  private async processRefund(booking: HayatBooking, amount: number) {
    const refund = new HayatRefund({
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
    return HayatNotification.query(userId);
  }

  async getCommunicationChannels(userId: string) {
    return HayatCommunicationChannel.query(userId);
  }

  async createCommunicationChannel(channelData: Partial<HayatCommunicationChannel>) {
    return HayatCommunicationChannel.create(channelData);
  }

  async updateCommunicationChannel(id: string, channelData: Partial<HayatCommunicationChannel>) {
    const channel = await HayatCommunicationChannel.get(id);
    if (!channel) {
      throw new Error('Channel not found');
    }
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
    if (!booking) {
      throw new HayatError('Booking not found', 404);
    }
    const user = await this.getUser(booking.userId);
    const channel = await this.getDefaultCommunicationChannel(user.id);

    const content = `Your booking (ID: ${bookingId}) has been confirmed. Thank you for choosing Hayat ERP!`;
    await this.sendNotification(user.id, 'BOOKING_CONFIRMATION', content, channel.id);
  }

  // Add more methods for other types of notifications (e.g., flight updates, reminders)

  async getLoyaltyProgram(tenantId: string) {
    const programs = await HayatLoyaltyProgram.query(tenantId);
    return programs[0]; // Assuming one program per tenant
  }

  async updateLoyaltyProgram(tenantId: string, programData: Partial<HayatLoyaltyProgram>) {
    const programs = await HayatLoyaltyProgram.query(tenantId);
    if (programs.length > 0) {
      Object.assign(programs[0], programData);
      await programs[0].save();
      return programs[0];
    }
    return null;
  }

  async getUserLoyaltyPoints(userId: string) {
    const user = await HayatUser.get(userId);
    const transactions = await HayatTransaction.query({ userId }); // Pass an object with userId
    
    const now = new Date();
    let activePoints = 0;

    for (const transaction of transactions) {
      if (new Date(transaction.expiresAt) > now) {
        activePoints += transaction.points;
      }
    }

    if (!user) {
      throw new Error('User not found');
    }
    user.loyaltyPoints = activePoints;
    await user.save();

    return activePoints;
  }

  async addLoyaltyPoints(userId: string, bookingId: string, amount: number) {
    const user = await HayatUser.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const program = await this.getLoyaltyProgram(user.tenantId);
    
    const points = Math.floor(amount * program.pointsPerCurrency);
    user.loyaltyPoints += points;
    await user.save();

    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + program.expirationMonths);

    const transaction = new HayatTransaction({
      userId,
      type: 'EARN',
      points,
      bookingId,
      description: `Earned points for booking ${bookingId}`,
      createdAt: new Date().toISOString(),
      expiresAt: expirationDate.toISOString(),
    });
    await transaction.save();

    return points;
  }

  async redeemLoyaltyPoints(userId: string, points: number, description: string) {
    const user = await HayatUser.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.loyaltyPoints < points) {
      throw new Error('Insufficient points');
    }

    user.loyaltyPoints -= points;
    await user.save();

    await HayatTransaction.create({
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
    return HayatTransaction.query({ userId }); // Pass an object with userId
  }

  async performMetaSearch(searchParams: any, tenantId: string) {
    try {
      // Pass tenantId when calling searchFlights
      const internalResults = await this.searchFlights(searchParams, tenantId);
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
    return HayatTenant.get(tenantId);
  }

  async updateTenant(tenantId: string, tenantData: Partial<HayatTenant>) {
    const tenant = await HayatTenant.get(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    Object.assign(tenant, tenantData);
    await tenant.save();
    return tenant;
  }

  async getWallet(tenantId: string) {
    const wallets = await HayatWallet.query(tenantId);
    return wallets[0]; // Assuming one wallet per tenant
  }

  async updateWallet(tenantId: string, walletData: Partial<HayatWallet>) {
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

    // Create a new booking instance
    const booking = new HayatBooking(bookingData);
    await booking.save(); // Save the booking instance

    // Update wallet balance
    const wallet = await this.getWallet(tenantId);
    wallet.balance -= bookingData.totalPrice;
    await wallet.save();

    return booking;
  }

  async reserveFlight(userId: string, flightId: string, holdDurationMinutes: number = 30) {
    const booking = new HayatBooking({
      userId,
      flightId,
      status: 'RESERVED',
      holdExpiresAt: new Date(Date.now() + holdDurationMinutes * 60000).toISOString(),
    });
    await booking.save(); // Save the new booking instance

    const holdTimer = new HayatHoldTimer({
      bookingId: booking.id,
      expiresAt: booking.holdExpiresAt,
    });
    await holdTimer.save(); // Save the new hold timer instance
    // Schedule a notification for 5 minutes before expiration
    const notificationTime = new Date(booking.holdExpiresAt);
    notificationTime.setMinutes(notificationTime.getMinutes() - 5);
    await this.scheduleHoldExpirationNotification(booking.id, notificationTime);

    return booking;
  }

  async confirmBooking(bookingId: string) {
    const booking = await HayatBooking.get(bookingId);
    if (!booking) {
      throw new HayatError('Booking not found', 404);
    }
    if (booking.status !== 'RESERVED' || new Date(booking.holdExpiresAt) < new Date()) {
      throw new HayatError('Booking hold has expired', 400);
    }

    booking.status = 'CONFIRMED';
    await booking.save();

    // Remove the hold timer
    const holdTimer = await HayatHoldTimer.query(bookingId);
    if (holdTimer.length > 0) {
      await holdTimer[0].delete();
    }

    return booking;
  }

  async cancelReservation(bookingId: string) {
    const booking = await HayatBooking.get(bookingId);
    if (!booking) {
      throw new HayatError('Booking not found', 404);
    }
    if (booking.status !== 'RESERVED') {
      throw new HayatError('Booking is not in a reserved state', 400);
    }

    booking.status = 'CANCELLED';
    await booking.save();

    // Remove the hold timer
    const holdTimer = await HayatHoldTimer.query(bookingId);
    if (holdTimer.length > 0) {
      await holdTimer[0].delete();
    }

    return booking;
  }

  async getUserReservations(userId: string) {
    const reservations = await HayatBooking.query(userId);
    return reservations.filter(booking => booking.status === 'RESERVED');
  }

  private async scheduleHoldExpirationNotification(bookingId: string, notificationTime: Date) {
    const booking = await HayatBooking.get(bookingId);
    if (!booking) {
      throw new HayatError('Booking not found', 404);
    }
    const user = await this.getUser(booking.userId);
    const flight = await this.getFlight(booking.flightId);

    // Create a notification record
    await HayatNotification.create({
      userId: user.id,
      type: 'HOLD_EXPIRATION',
      content: `Your hold for flight ${flight.flightNumber} will expire in 5 minutes.`,
      status: 'PENDING',
      scheduledFor: notificationTime.toISOString(),
    });
  }

  private async getUser(userId: string): Promise<HayatUser> {
    const user = await HayatUser.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  private async getDefaultCommunicationChannel(userId: string): Promise<HayatCommunicationChannel> {
    const channels = await HayatCommunicationChannel.scan({ filter: { userId: { eq: userId } } });
    return channels.find(channel => channel.isActive) || channels[0];
  }

  private async getFlight(flightId: string): Promise<HayatCharterFlight> {
    const flight = await HayatCharterFlight.get(flightId);
    if (!flight) {
      throw new Error('Flight not found');
    }
    return flight;
  }
}
