import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

interface NotificationTemplate {
  id: string;
  type: string;
  content: string;
}

export const HayatNotificationTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('hayatApi', '/notification-templates', {});
      setTemplates(response);
    } catch (error) {
      console.error('Error fetching notification templates:', error);
      setError(t('notificationTemplates.error.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async (template: NotificationTemplate) => {
    try {
      await API.put('hayatApi', `/notification-templates/${template.id}`, { body: template });
      fetchTemplates();
    } catch (error) {
      console.error('Error updating notification template:', error);
      setError(t('notificationTemplates.error.updateFailed'));
    }
  };

  return (
    <div className="hayat-notification-template-manager">
      <h2>{t('notificationTemplates.title')}</h2>
      {loading && <p>{t('notificationTemplates.loading')}</p>}
      {error && <p className="hayat-error">{error}</p>}
      {!loading && !error && (
        <ul>
          {templates.map((template) => (
            <li key={template.id}>
              <h3>{template.type}</h3>
              <textarea
                value={template.content}
                onChange={(e) => handleUpdateTemplate({ ...template, content: e.target.value })}
              />
              <button onClick={() => handleUpdateTemplate(template)}>
                {t('notificationTemplates.save')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
