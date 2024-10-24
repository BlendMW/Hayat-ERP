import React from 'react';
import { useTranslation } from 'react-i18next';
import { HayatCharterFlightManager } from './HayatCharterFlightManager';
import { HayatFlightSourceManager } from './HayatFlightSourceManager';
import { HayatSeatMapManager } from './HayatSeatMapManager';
import { HayatAncillaryServiceManager } from './HayatAncillaryServiceManager';
import { HayatNotificationTemplateManager } from './HayatNotificationTemplateManager';
import { HayatLoyaltyProgramManager } from './HayatLoyaltyProgramManager';

export const HayatAdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="hayat-admin-dashboard">
      <h1>{t('admin.dashboard.title')}</h1>
      <nav>
        <ul>
          <li><a href="#charter-flights">{t('admin.dashboard.charterFlights')}</a></li>
          <li><a href="#flight-sources">{t('admin.dashboard.flightSources')}</a></li>
          <li><a href="#seat-maps">{t('admin.dashboard.seatMaps')}</a></li>
          <li><a href="#ancillary-services">{t('admin.dashboard.ancillaryServices')}</a></li>
          <li><a href="#notification-templates">{t('admin.dashboard.notificationTemplates')}</a></li>
          <li><a href="#loyalty-program">{t('admin.dashboard.loyaltyProgram')}</a></li>
        </ul>
      </nav>
      <section id="charter-flights">
        <h2>{t('admin.dashboard.charterFlights')}</h2>
        <HayatCharterFlightManager />
      </section>
      <section id="flight-sources">
        <h2>{t('admin.dashboard.flightSources')}</h2>
        <HayatFlightSourceManager />
      </section>
      <section id="seat-maps">
        <h2>{t('admin.dashboard.seatMaps')}</h2>
        <HayatSeatMapManager />
      </section>
      <section id="ancillary-services">
        <h2>{t('admin.dashboard.ancillaryServices')}</h2>
        <HayatAncillaryServiceManager />
      </section>
      <section id="notification-templates">
        <h2>{t('admin.dashboard.notificationTemplates')}</h2>
        <HayatNotificationTemplateManager />
      </section>
      <section id="loyalty-program">
        <h2>{t('admin.dashboard.loyaltyProgram')}</h2>
        <HayatLoyaltyProgramManager />
      </section>
    </div>
  );
};
