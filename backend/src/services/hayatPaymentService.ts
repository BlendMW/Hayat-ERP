import { PaymentProvider } from '../providers/paymentProvider';
import { PaymentGateway } from 'your-payment-gateway-sdk';

const paymentGateway = new PaymentGateway(process.env.PAYMENT_GATEWAY_API_KEY);

export const processPaymentWithProvider = async (paymentDetails: any, tenant: string) => {
  const provider = new PaymentProvider(tenant);
  return provider.processPayment(paymentDetails);
};

export const processRefund = async (paymentId: string, amount: number): Promise<boolean> => {
  try {
    const result = await paymentGateway.refund(paymentId, amount);
    return result.success;
  } catch (error) {
    console.error('Error processing refund:', error);
    return false;
  }
};

export const createCharge = async (userId: string, amount: number, description: string): Promise<string | null> => {
  try {
    const result = await paymentGateway.charge({
      userId,
      amount,
      description,
    });
    return result.chargeId;
  } catch (error) {
    console.error('Error creating charge:', error);
    return null;
  }
};
