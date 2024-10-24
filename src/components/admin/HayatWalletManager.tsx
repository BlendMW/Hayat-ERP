import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface Wallet {
  id: string;
  tenantId: string;
  balance: number;
  creditLimit: number;
}

export const HayatWalletManager: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/wallet', {});
      setWallet(response);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      setError(t('admin.wallet.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWallet = async (updatedWallet: Wallet) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.put('hayatApi', '/wallet', { body: updatedWallet });
      setWallet(response);
    } catch (error) {
      console.error('Error updating wallet:', error);
      setError(t('admin.wallet.error.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>{t('admin.loading')}</p>;
  if (error) return <p className="hayat-error">{error}</p>;
  if (!wallet) return null;

  return (
    <div className="hayat-wallet-manager">
      <h2>{t('admin.wallet.title')}</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleUpdateWallet(wallet);
      }}>
        <div>
          <label htmlFor="balance">{t('admin.wallet.balance')}</label>
          <input
            type="number"
            id="balance"
            value={wallet.balance}
            onChange={(e) => setWallet({ ...wallet, balance: parseFloat(e.target.value) })}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="creditLimit">{t('admin.wallet.creditLimit')}</label>
          <input
            type="number"
            id="creditLimit"
            value={wallet.creditLimit}
            onChange={(e) => setWallet({ ...wallet, creditLimit: parseFloat(e.target.value) })}
          />
        </div>
        <button type="submit">{t('admin.wallet.updateButton')}</button>
      </form>
    </div>
  );
};
