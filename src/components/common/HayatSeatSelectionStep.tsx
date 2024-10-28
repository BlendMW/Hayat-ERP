import React, { useState, useEffect, useRef } from 'react';
// import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface SeatMap {
  id: string;
  flightId: string;
  rows: number;
  columns: string;
  unavailableSeats: string[];
  lockedSeats: string[];
  seatPrices: { [key: string]: number };
}

interface HayatSeatSelectionStepProps {
  flightId: string;
  onSeatSelected: (seat: string, price: number) => void;
}

export const HayatSeatSelectionStep: React.FC<HayatSeatSelectionStepProps> = ({ flightId, onSeatSelected }) => {
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const websocket = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetchSeatMap();
    connectWebSocket();

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, [flightId]);

  const fetchSeatMap = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', `/seat-map/${flightId}`, {});
      setSeatMap(response);
    } catch (error) {
      console.error('Error fetching seat map:', error);
      setError(t('seatSelection.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL!);
    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({ action: 'subscribe', flightId }));
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'SEAT_LOCKED' || data.type === 'SEAT_UNLOCKED') {
        fetchSeatMap();
      }
    };
    websocket.current = ws;
  };

  const handleSeatClick = async (seat: string) => {
    if (seatMap && !seatMap.unavailableSeats.includes(seat) && !seatMap.lockedSeats.includes(seat)) {
      const locked = await API.post('hayatApi', '/lock-seat', { body: { flightId, seatNumber: seat } });
      if (locked) {
        setSelectedSeat(seat);
        onSeatSelected(seat, seatMap.seatPrices[seat] || 0);
      } else {
        setError(t('seatSelection.error.seatUnavailable'));
      }
    }
  };

  const renderSeatMap = () => {
    if (!seatMap) return null;

    return (
      <div className="hayat-seat-map">
        {Array.from({ length: seatMap.rows }, (_, rowIndex) => (
          <div key={rowIndex} className="hayat-seat-row">
            {seatMap.columns.split('').map((col) => {
              const seat = `${rowIndex + 1}${col}`;
              const isUnavailable = seatMap.unavailableSeats.includes(seat);
              const isSelected = seat === selectedSeat;
              return (
                <button
                  key={seat}
                  className={`hayat-seat ${isUnavailable ? 'unavailable' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSeatClick(seat)}
                  disabled={isUnavailable}
                >
                  {seat}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="hayat-seat-selection-step">
      <h2>{t('seatSelection.title')}</h2>
      {loading && <p>{t('seatSelection.loading')}</p>}
      {error && <p className="hayat-error">{error}</p>}
      {!loading && !error && seatMap && (
        <>
          {renderSeatMap()}
          {selectedSeat && (
            <p>{t('seatSelection.selected', { seat: selectedSeat, price: seatMap.seatPrices[selectedSeat] || 0 })}</p>
          )}
        </>
      )}
    </div>
  );
};
