import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';
import { HayatError } from '../../utils/errorHandling';
import { HayatFlightSourceForm } from './HayatFlightSourceForm';

interface FlightSource {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
}

interface SourcePriority {
  id: string;
  tenantId: string;
  userId?: string;
  sourceId: string;
  priority: number;
}

export const HayatFlightSourceManager: React.FC = () => {
  const [flightSources, setFlightSources] = useState<FlightSource[]>([]);
  const [sourcePriorities, setSourcePriorities] = useState<SourcePriority[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState<FlightSource | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchFlightSources();
    fetchSourcePriorities();
  }, []);

  const fetchFlightSources = async () => {
    setLoading(true);
    setError(null);
    try {
      const sources = await API.get('hayatApi', '/flight-sources', {});
      setFlightSources(sources);
    } catch (error) {
      console.error('Error fetching flight sources:', error);
      setError(t('admin.flightSources.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fetchSourcePriorities = async () => {
    setLoading(true);
    setError(null);
    try {
      const priorities = await API.get('hayatApi', '/source-priorities', {});
      setSourcePriorities(priorities);
    } catch (error) {
      console.error('Error fetching source priorities:', error);
      setError(t('admin.sourcePriorities.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSourcePriority = async (priorityId: string, newPriority: number) => {
    try {
      await API.put('hayatApi', `/source-priorities/${priorityId}`, {
        body: { priority: newPriority },
      });
      fetchSourcePriorities();
    } catch (error) {
      console.error('Error updating source priority:', error);
      setError(t('admin.sourcePriorities.error.updateFailed'));
    }
  };

  const handleAddUserOverride = async (sourceId: string, userId: string, priority: number) => {
    try {
      await API.post('hayatApi', '/source-priorities', {
        body: { sourceId, userId, priority },
      });
      fetchSourcePriorities();
    } catch (error) {
      console.error('Error adding user override:', error);
      setError(t('admin.sourcePriorities.error.addOverrideFailed'));
    }
  };

  const handleAddSource = () => {
    setEditingSource(null);
    setShowForm(true);
  };

  const handleEditSource = (source: FlightSource) => {
    setEditingSource(source);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingSource(null);
    fetchFlightSources();
  };

  return (
    <div className="hayat-flight-source-manager">
      <h2>{t('admin.flightSources.title')}</h2>
      {loading && <p>{t('admin.loading')}</p>}
      {error && <p className="hayat-error">{error}</p>}
      {!loading && !error && (
        <>
          <button onClick={handleAddSource}>{t('admin.flightSources.addSource')}</button>
          {showForm && (
            <HayatFlightSourceForm
              onSubmit={handleFormSubmit}
              initialData={editingSource || undefined}
            />
          )}
          <h3>{t('admin.flightSources.sourcesTitle')}</h3>
          <ul>
            {flightSources.map((source) => (
              <li key={source.id}>
                {source.name} ({source.type}) - {source.isActive ? t('admin.active') : t('admin.inactive')}
                <button onClick={() => handleEditSource(source)}>{t('admin.edit')}</button>
              </li>
            ))}
          </ul>
          <h3>{t('admin.sourcePriorities.title')}</h3>
          <ul>
            {sourcePriorities.map((priority) => (
              <li key={priority.id}>
                {flightSources.find((s) => s.id === priority.sourceId)?.name} - 
                Priority: <input 
                  type="number" 
                  value={priority.priority} 
                  onChange={(e) => handleUpdateSourcePriority(priority.id, parseInt(e.target.value, 10))}
                />
                {priority.userId && ` (User Override: ${priority.userId})`}
              </li>
            ))}
          </ul>
          {/* Add form for creating new user overrides */}
        </>
      )}
    </div>
  );
};
