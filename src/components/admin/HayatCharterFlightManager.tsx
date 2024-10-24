import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

export const HayatCharterFlightManager: React.FC = () => {
  const [charterFlights, setCharterFlights] = useState([]);
  const [pricingRules, setPricingRules] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchCharterFlights();
  }, []);

  const fetchCharterFlights = async () => {
    try {
      const flights = await API.get('hayatApi', '/charter-flights', {});
      setCharterFlights(flights);
    } catch (error) {
      console.error('Error fetching charter flights:', error);
    }
  };

  const fetchPricingRules = async (flightId) => {
    try {
      const rules = await API.get('hayatApi', `/pricing-rules/${flightId}`, {});
      setPricingRules(rules);
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
    }
  };

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    fetchPricingRules(flight.id);
  };

  const handleCreateFlight = async (flightData) => {
    try {
      await API.post('hayatApi', '/charter-flights', { body: flightData });
      fetchCharterFlights();
    } catch (error) {
      console.error('Error creating charter flight:', error);
    }
  };

  const handleUpdateFlight = async (flightId, flightData) => {
    try {
      await API.put('hayatApi', `/charter-flights/${flightId}`, { body: flightData });
      fetchCharterFlights();
    } catch (error) {
      console.error('Error updating charter flight:', error);
    }
  };

  const handleCreatePricingRule = async (ruleData) => {
    try {
      await API.post('hayatApi', '/pricing-rules', { body: ruleData });
      fetchPricingRules(selectedFlight.id);
    } catch (error) {
      console.error('Error creating pricing rule:', error);
    }
  };

  const handleUpdatePricingRule = async (ruleId, ruleData) => {
    try {
      await API.put('hayatApi', `/pricing-rules/${ruleId}`, { body: ruleData });
      fetchPricingRules(selectedFlight.id);
    } catch (error) {
      console.error('Error updating pricing rule:', error);
    }
  };

  return (
    <div className="hayat-charter-flight-manager">
      <h2>{t('admin.charterFlightManager.title')}</h2>
      {/* Render charter flight list, creation form, and update form */}
      {/* Render pricing rule list, creation form, and update form for selected flight */}
    </div>
  );
};
