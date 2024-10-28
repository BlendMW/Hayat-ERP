import React, { useState, useEffect } from 'react';
// import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';
import { HayatCommunicationChannels } from '../common/HayatCommunicationChannels';
import { HayatLoyaltyPoints } from '../common/HayatLoyaltyPoints';

export const HayatUserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/user-profile', {});
      setUser(response);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(t('userProfile.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>{t('userProfile.loading')}</p>;
  if (error) return <p className="hayat-error">{error}</p>;
  if (!user) return null;

  return (
    <div className="hayat-user-profile">
      <h1>{t('userProfile.title')}</h1>
      <div>
        <h2>{t('userProfile.personalInfo')}</h2>
        <p>{t('userProfile.name')}: {user.name}</p>
        <p>{t('userProfile.email')}: {user.email}</p>
      </div>
      <HayatCommunicationChannels />
      <HayatLoyaltyPoints />
    </div>
  );
};
