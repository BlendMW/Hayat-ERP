import React, { useState } from 'react';
// import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface FlightSourceFormProps {
  onSubmit: () => void;
  initialData?: {
    id?: string;
    name: string;
    type: string;
    isActive: boolean;
  };
}

export const HayatFlightSourceForm: React.FC<FlightSourceFormProps> = ({ onSubmit, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || 'DIRECT_API');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (initialData?.id) {
        await API.put('hayatApi', `/flight-sources/${initialData.id}`, {
          body: { name, type, isActive },
        });
      } else {
        await API.post('hayatApi', '/flight-sources', {
          body: { name, type, isActive },
        });
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving flight source:', error);
      setError(t('admin.flightSources.error.saveFailed'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hayat-flight-source-form">
      <div>
        <label htmlFor="name">{t('admin.flightSources.form.name')}</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="type">{t('admin.flightSources.form.type')}</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="DIRECT_API">Direct API</option>
          <option value="GDS">GDS</option>
          <option value="AGGREGATOR">Aggregator</option>
        </select>
      </div>
      <div>
        <label htmlFor="isActive">{t('admin.flightSources.form.isActive')}</label>
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
      </div>
      {error && <p className="hayat-error">{error}</p>}
      <button type="submit">
        {initialData?.id ? t('admin.flightSources.form.update') : t('admin.flightSources.form.create')}
      </button>
    </form>
  );
};
