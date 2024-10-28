import React, { useState, useEffect } from 'react';
// import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface Transaction {
  id: string;
  type: 'EARN' | 'REDEEM';
  points: number;
  description: string;
  createdAt: string;
}

interface RedemptionOption {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
}

export const HayatLoyaltyPoints: React.FC = () => {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [redemptionOptions, setRedemptionOptions] = useState<RedemptionOption[]>([]);

  useEffect(() => {
    fetchLoyaltyPoints();
    fetchTransactions();
    fetchRedemptionOptions();
  }, []);

  const fetchLoyaltyPoints = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/loyalty-points', {});
      setPoints(response.points);
    } catch (error) {
      console.error('Error fetching loyalty points:', error);
      setError(t('loyalty.error.fetchPointsFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/loyalty-transactions', {});
      setTransactions(response);
    } catch (error) {
      console.error('Error fetching loyalty transactions:', error);
      setError(t('loyalty.error.fetchTransactionsFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fetchRedemptionOptions = async () => {
    try {
      const response = await API.get('hayatApi', '/redemption-options', {});
      setRedemptionOptions(response);
    } catch (error) {
      console.error('Error fetching redemption options:', error);
      setError(t('loyalty.error.fetchRedemptionOptionsFailed'));
    }
  };

  const handleRedeemPoints = async (optionId: string) => {
    try {
      await API.post('hayatApi', '/redeem-points', { body: { optionId } });
      fetchLoyaltyPoints();
      fetchTransactions();
    } catch (error) {
      console.error('Error redeeming points:', error);
      setError(t('loyalty.error.redeemFailed'));
    }
  };

  return (
    <div className="hayat-loyalty-points">
      <h2>{t('loyalty.title')}</h2>
      {loading && <p>{t('loyalty.loading')}</p>}
      {error && <p className="hayat-error">{error}</p>}
      {!loading && !error && (
        <>
          <p>{t('loyalty.currentPoints', { points })}</p>
          <h3>{t('loyalty.transactions')}</h3>
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id}>
                {transaction.type === 'EARN' ? '+' : '-'}{transaction.points} points: {transaction.description} ({new Date(transaction.createdAt).toLocaleString()})
              </li>
            ))}
          </ul>
          <h3>{t('loyalty.redemptionOptions')}</h3>
          <ul>
            {redemptionOptions.map((option) => (
              <li key={option.id}>
                <h4>{option.name}</h4>
                <p>{option.description}</p>
                <p>{t('loyalty.pointsCost', { points: option.pointsCost })}</p>
                <button
                  onClick={() => handleRedeemPoints(option.id)}
                  disabled={points < option.pointsCost}
                >
                  {t('loyalty.redeemButton')}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
