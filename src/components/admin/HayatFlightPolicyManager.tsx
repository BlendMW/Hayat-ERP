import React, { useState, useEffect } from 'react';
// import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface FlightPolicy {
  id: string;
  flightId: string;
  isRefundable: boolean;
  cancellationFee: number;
  modificationFee: number;
  deadlineHours: number;
}

export const HayatFlightPolicyManager: React.FC = () => {
  const [policies, setPolicies] = useState<FlightPolicy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/flight-policies', {});
      setPolicies(response);
    } catch (error) {
      console.error('Error fetching flight policies:', error);
      setError(t('admin.flightPolicies.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async (policyData: Omit<FlightPolicy, 'id'>) => {
    try {
      await API.post('hayatApi', '/flight-policies', { body: policyData });
      fetchPolicies();
    } catch (error) {
      console.error('Error creating flight policy:', error);
      setError(t('admin.flightPolicies.error.createFailed'));
    }
  };

  const handleUpdatePolicy = async (policy: FlightPolicy) => {
    try {
      await API.put('hayatApi', `/flight-policies/${policy.id}`, { body: policy });
      fetchPolicies();
    } catch (error) {
      console.error('Error updating flight policy:', error);
      setError(t('admin.flightPolicies.error.updateFailed'));
    }
  };

  // Render policy list and form
  // ...

  return (
    <div className="hayat-flight-policy-manager">
      <h2>{t('admin.flightPolicies.title')}</h2>
      {/* Render policy list and form */}
    </div>
  );
};
