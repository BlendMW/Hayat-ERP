import React, { useState, useEffect } from 'react';
import { fetchAddOns } from '../../utils/flightUtils';

interface HayatAddOnsStepProps {
  userType: 'b2c' | 'b2b';
  tenant: any;
  bookingData: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  onError: (error: string) => void;
}

export const HayatAddOnsStep: React.FC<HayatAddOnsStepProps> = ({
  userType, tenant, bookingData, onNext, onPrevious, onError
}) => {
  const [addOns, setAddOns] = useState<any[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  useEffect(() => {
    const loadAddOns = async () => {
      try {
        const addOnsData = await fetchAddOns(bookingData.selectedFlight.id, tenant);
        setAddOns(addOnsData);
      } catch (error) {
        onError('Failed to load add-ons');
      }
    };
    loadAddOns();
  }, [bookingData.selectedFlight.id, tenant, onError]);

  const handleAddOnSelection = (addOnId: string) => {
    if (selectedAddOns.includes(addOnId)) {
      setSelectedAddOns(selectedAddOns.filter(id => id !== addOnId));
    } else {
      setSelectedAddOns([...selectedAddOns, addOnId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ selectedAddOns });
  };

  return (
    <form onSubmit={handleSubmit} className="hayat-add-ons-form space-y-4">
      <h2 className="text-xl font-semibold">Select Add-ons</h2>
      <div className="add-ons-list space-y-2">
        {addOns.map((addOn) => (
          <div key={addOn.id} className="flex items-center">
            <input
              type="checkbox"
              id={addOn.id}
              checked={selectedAddOns.includes(addOn.id)}
              onChange={() => handleAddOnSelection(addOn.id)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={addOn.id} className="ml-2 block text-sm text-gray-900">
              {addOn.name} - ${addOn.price}
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
    </form>
  );
};
