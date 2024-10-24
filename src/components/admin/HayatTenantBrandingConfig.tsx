import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';
import { updateHayatTheme } from '../../utils/hayatThemeManager';

interface HayatTenant {
  id: string;
  name: string;
  domain: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  flightSourcePriorities: { [key: string]: number };
  bookingRules: { [key: string]: any };
}

export const HayatTenantBrandingConfig: React.FC = () => {
  const [hayatTenant, setHayatTenant] = useState<HayatTenant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchHayatTenant();
  }, []);

  const fetchHayatTenant = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/tenant', {});
      setHayatTenant(response);
    } catch (error) {
      console.error('Error fetching Hayat tenant:', error);
      setError(t('admin.tenant.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHayatTenant = async (updatedHayatTenant: HayatTenant) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.put('hayatApi', '/tenant', { body: updatedHayatTenant });
      setHayatTenant(response);
      updateHayatTheme({
        primaryColor: response.primaryColor,
        secondaryColor: response.secondaryColor,
        fontFamily: response.fontFamily || 'Arial, sans-serif',
      });
    } catch (error) {
      console.error('Error updating Hayat tenant:', error);
      setError(t('admin.tenant.error.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>{t('admin.loading')}</p>;
  if (error) return <p className="hayat-error">{error}</p>;
  if (!hayatTenant) return null;

  return (
    <div className="hayat-tenant-branding-config">
      <h2>{t('admin.tenant.title')}</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleUpdateHayatTenant(hayatTenant);
      }}>
        <div>
          <label htmlFor="name">{t('admin.tenant.name')}</label>
          <input
            type="text"
            id="name"
            value={hayatTenant.name}
            onChange={(e) => setHayatTenant({ ...hayatTenant, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="domain">{t('admin.tenant.domain')}</label>
          <input
            type="text"
            id="domain"
            value={hayatTenant.domain}
            onChange={(e) => setHayatTenant({ ...hayatTenant, domain: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="logo">{t('admin.tenant.logo')}</label>
          <input
            type="text"
            id="logo"
            value={hayatTenant.logo}
            onChange={(e) => setHayatTenant({ ...hayatTenant, logo: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="primaryColor">{t('admin.tenant.primaryColor')}</label>
          <input
            type="color"
            id="primaryColor"
            value={hayatTenant.primaryColor}
            onChange={(e) => setHayatTenant({ ...hayatTenant, primaryColor: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="secondaryColor">{t('admin.tenant.secondaryColor')}</label>
          <input
            type="color"
            id="secondaryColor"
            value={hayatTenant.secondaryColor}
            onChange={(e) => setHayatTenant({ ...hayatTenant, secondaryColor: e.target.value })}
          />
        </div>
        {/* Add inputs for flightSourcePriorities and bookingRules */}
        <button type="submit">{t('admin.tenant.updateButton')}</button>
      </form>
    </div>
  );
};
