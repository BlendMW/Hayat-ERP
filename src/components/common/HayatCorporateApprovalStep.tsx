import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useLoyalty } from '../../hooks/useLoyalty';

interface HayatCorporateApprovalStepProps {
  userType: 'b2c' | 'b2b';
  tenant: any;
  bookingData: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  onError: (error: string) => void;
}

export const HayatCorporateApprovalStep: React.FC<HayatCorporateApprovalStepProps> = ({
  userType, tenant, bookingData, onNext, onPrevious, onError
}) => {
  const intl = useIntl();
  const { getLoyaltyPoints } = useLoyalty();
  const [approvalCode, setApprovalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('corporate');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would typically send the approval code to your backend for verification
      // For this example, we'll just simulate a successful approval
      const loyaltyPoints = await getLoyaltyPoints(tenant, bookingData.corporateId);
      onNext({ 
        approvalCode, 
        paymentMethod,
        loyaltyPoints,
        isPendingPayment: paymentMethod === 'invoice'
      });
    } catch (error) {
      onError(intl.formatMessage({ id: 'corporateApproval.error' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hayat-corporate-approval-form space-y-4">
      <div>
        <label htmlFor="approvalCode" className="block text-sm font-medium text-gray-700">
          {intl.formatMessage({ id: 'corporateApproval.approvalCode' })}
        </label>
        <input
          type="text"
          id="approvalCode"
          value={approvalCode}
          onChange={(e) => setApprovalCode(e.target.value)}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
          {intl.formatMessage({ id: 'corporateApproval.paymentMethod' })}
        </label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="corporate">{intl.formatMessage({ id: 'corporateApproval.paymentMethod.corporate' })}</option>
          <option value="invoice">{intl.formatMessage({ id: 'corporateApproval.paymentMethod.invoice' })}</option>
        </select>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {intl.formatMessage({ id: 'common.previous' })}
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {intl.formatMessage({ id: 'common.next' })}
        </button>
      </div>
    </form>
  );
};
