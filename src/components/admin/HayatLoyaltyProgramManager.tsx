import React, { useState, useEffect } from 'react';
// import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface LoyaltyProgram {
  id: string;
  tenantId: string;
  name: string;
  pointsPerCurrency: number;
  expirationMonths: number;
}

export const HayatLoyaltyProgramManager: React.FC = () => {
  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchLoyaltyProgram();
  }, []);

  const fetchLoyaltyProgram = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/loyalty-program', {});
      setLoyaltyProgram(response);
    } catch (error) {
      console.error('Error fetching loyalty program:', error);
      setError(t('admin.loyaltyProgram.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgram = async (updatedProgram: LoyaltyProgram) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.put('hayatApi', '/loyalty-program', { body: updatedProgram });
      setLoyaltyProgram(response);
    } catch (error) {
      console.error('Error updating loyalty program:', error);
      setError(t('admin.loyaltyProgram.error.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>{t('admin.loading')}</p>;
  if (error) return <p className="hayat-error">{error}</p>;
  if (!loyaltyProgram) return null;

  return (
    <div className="hayat-loyalty-program-manager">
      <h2>{t('admin.loyaltyProgram.title')}</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleUpdateProgram(loyaltyProgram);
      }}>
        <div>
          <label htmlFor="name">{t('admin.loyaltyProgram.name')}</label>
          <input
            type="text"
            id="name"
            value={loyaltyProgram.name}
            onChange={(e) => setLoyaltyProgram({ ...loyaltyProgram, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="pointsPerCurrency">{t('admin.loyaltyProgram.pointsPerCurrency')}</label>
          <input
            type="number"
            id="pointsPerCurrency"
            value={loyaltyProgram.pointsPerCurrency}
            onChange={(e) => setLoyaltyProgram({ ...loyaltyProgram, pointsPerCurrency: parseFloat(e.target.value) })}
          />
        </div>
        <div>
          <label htmlFor="expirationMonths">{t('admin.loyaltyProgram.expirationMonths')}</label>
          <input
            type="number"
            id="expirationMonths"
            value={loyaltyProgram.expirationMonths}
            onChange={(e) => setLoyaltyProgram({ ...loyaltyProgram, expirationMonths: parseInt(e.target.value, 10) })}
          />
        </div>
        <button type="submit">{t('admin.loyaltyProgram.updateButton')}</button>
      </form>
    </div>
  );
};
