import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface CommunicationChannel {
  id: string;
  type: string;
  address: string;
  isActive: boolean;
}

export const HayatCommunicationChannels: React.FC = () => {
  const [channels, setChannels] = useState<CommunicationChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/communication-channels', {});
      setChannels(response);
    } catch (error) {
      console.error('Error fetching communication channels:', error);
      setError(t('communicationChannels.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddChannel = async (channelData: Omit<CommunicationChannel, 'id'>) => {
    try {
      await API.post('hayatApi', '/communication-channels', { body: channelData });
      fetchChannels();
    } catch (error) {
      console.error('Error adding communication channel:', error);
      setError(t('communicationChannels.error.addFailed'));
    }
  };

  const handleUpdateChannel = async (channel: CommunicationChannel) => {
    try {
      await API.put('hayatApi', `/communication-channels/${channel.id}`, { body: channel });
      fetchChannels();
    } catch (error) {
      console.error('Error updating communication channel:', error);
      setError(t('communicationChannels.error.updateFailed'));
    }
  };

  return (
    <div className="hayat-communication-channels">
      <h2>{t('communicationChannels.title')}</h2>
      {loading && <p>{t('communicationChannels.loading')}</p>}
      {error && <p className="hayat-error">{error}</p>}
      {!loading && !error && (
        <ul>
          {channels.map((channel) => (
            <li key={channel.id}>
              {channel.type}: {channel.address} - 
              <input
                type="checkbox"
                checked={channel.isActive}
                onChange={() => handleUpdateChannel({ ...channel, isActive: !channel.isActive })}
              />
              {channel.isActive ? t('communicationChannels.active') : t('communicationChannels.inactive')}
            </li>
          ))}
        </ul>
      )}
      {/* Add form for creating new communication channels */}
    </div>
  );
};
