import React, { createContext, useContext, useState, useCallback } from 'react';

interface BookingContextType {
  bookingData: any;
  updateBookingData: (data: any) => void;
  resetBooking: () => void;
  calculateTotalPrice: () => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC = ({ children }) => {
  const [bookingData, setBookingData] = useState({});

  const updateBookingData = useCallback((data: any) => {
    setBookingData((prevData) => ({ ...prevData, ...data }));
  }, []);

  const resetBooking = useCallback(() => {
    setBookingData({});
  }, []);

  const calculateTotalPrice = useCallback(() => {
    let total = bookingData.selectedFlight?.price || 0;
    total += (bookingData.selectedAddOns || []).reduce((sum: number, addOn: any) => sum + addOn.price, 0);
    return total;
  }, [bookingData]);

  return (
    <BookingContext.Provider value={{ bookingData, updateBookingData, resetBooking, calculateTotalPrice }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
