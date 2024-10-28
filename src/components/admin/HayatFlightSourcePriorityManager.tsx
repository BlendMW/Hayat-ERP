import React, { useState, useEffect } from 'react';
// import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface FlightSource {
  id: string;
  name: string;
  type: string;
}

interface SourcePriority {
  id: string;
  sourceId: string;
  priority: number;
}

export const HayatFlightSourcePriorityManager: React.FC = () => {
  const [sources, setSources] = useState<FlightSource[]>([]);
  const [priorities, setPriorities] = useState<SourcePriority[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchSourcesAndPriorities();
  }, []);

  const fetchSourcesAndPriorities = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sourcesResponse, prioritiesResponse] = await Promise.all([
        API.get('hayatApi', '/flight-sources', {}),
        API.get('hayatApi', '/source-priorities', {}),
      ]);
      setSources(sourcesResponse);
      setPriorities(prioritiesResponse);
    } catch (error) {
      console.error('Error fetching sources and priorities:', error);
      setError(t('admin.flightSources.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePriority = async (sourceId: string, newPriority: number) => {
    try {
      await API.put('hayatApi', `/source-priorities/${sourceId}`, {
        body: { priority: newPriority },
      });
      fetchSourcesAndPriorities();
    } catch (error) {
      console.error('Error updating priority:', error);
      setError(t('admin.flightSources.error.updateFailed'));
    }
  };

  return (
    <div className="hayat-flight-source-priority-manager">
      <h2>{t('admin.flightSources.priorityTitle')}</h2>
      {loading && <p>{t('admin.loading')}</p>}
      {error && <p className="hayat-error">{error}</p>}
      {!loading && !error && (
        <ul>
          {sources.map((source) => {
            const priority = priorities.find((p) => p.sourceId === source.id);
            return (
              <li key={source.id}>
                {source.name} ({source.type}) -
                <input
                  type="number"
                  value={priority?.priority || 0}
                  onChange={(e) => handleUpdatePriority(source.id, parseInt(e.target.value, 10))}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
