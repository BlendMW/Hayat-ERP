import React, { useState, useEffect } from 'react';
// import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface ExternalProvider {
  id: string;
  name: string;
  apiKey: string;
  isActive: boolean;
}

export const HayatExternalProviderManager: React.FC = () => {
  const [providers, setProviders] = useState<ExternalProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/external-providers', {});
      setProviders(response);
    } catch (error) {
      console.error('Error fetching external providers:', error);
      setError(t('admin.externalProviders.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProvider = async (providerData: Omit<ExternalProvider, 'id'>) => {
    try {
      await API.post('hayatApi', '/external-providers', { body: providerData });
      fetchProviders();
    } catch (error) {
      console.error('Error creating external provider:', error);
      setError(t('admin.externalProviders.error.createFailed'));
    }
  };

  const handleUpdateProvider = async (provider: ExternalProvider) => {
    try {
      await API.put('hayatApi', `/external-providers/${provider.id}`, { body: provider });
      fetchProviders();
    } catch (error) {
      console.error('Error updating external provider:', error);
      setError(t('admin.externalProviders.error.updateFailed'));
    }
  };

  return (
    <div className="hayat-external-provider-manager">
      <h2>{t('admin.externalProviders.title')}</h2>
      {loading && <p>{t('admin.loading')}</p>}
      {error && <p className="hayat-error">{error}</p>}
      {!loading && !error && (
        <>
          <ul>
            {providers.map((provider) => (
              <li key={provider.id}>
                <h3>{provider.name}</h3>
                <p>API Key: {provider.apiKey}</p>
                <label>
                  <input
                    type="checkbox"
                    checked={provider.isActive}
                    onChange={() => handleUpdateProvider({ ...provider, isActive: !provider.isActive })}
                  />
                  {t('admin.externalProviders.active')}
                </label>
              </li>
            ))}
          </ul>
          {/* Add form for creating new external providers */}
        </>
      )}
    </div>
  );
};
