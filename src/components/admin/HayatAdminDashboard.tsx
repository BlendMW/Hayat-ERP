import React from 'react';
import { useTranslation } from 'react-i18next';
import { HayatCharterFlightManager } from './HayatCharterFlightManager';
import { HayatFlightSourceManager } from './HayatFlightSourceManager';
import { HayatSeatMapManager } from './HayatSeatMapManager';
import { HayatAncillaryServiceManager } from './HayatAncillaryServiceManager';
import { HayatNotificationTemplateManager } from './HayatNotificationTemplateManager';
import { HayatLoyaltyProgramManager } from './HayatLoyaltyProgramManager';
import { HayatExternalProviderManager } from './HayatExternalProviderManager';
import { HayatTenantBrandingConfig } from './HayatTenantBrandingConfig';
import { HayatWalletManager } from './HayatWalletManager';
import { HayatFlightSourcePriorityManager } from './HayatFlightSourcePriorityManager';

export const HayatAdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="hayat-admin-dashboard">
      <h1>{t('admin.dashboard.title')}</h1>
      <nav>
        <ul>
          <li><a href="#charter-flights">{t('admin.dashboard.charterFlights')}</a></li>
          <li><a href="#flight-sources">{t('admin.dashboard.flightSources')}</a></li>
          <li><a href="#flight-source-priorities">{t('admin.dashboard.flightSourcePriorities')}</a></li>
          <li><a href="#seat-maps">{t('admin.dashboard.seatMaps')}</a></li>
          <li><a href="#ancillary-services">{t('admin.dashboard.ancillaryServices')}</a></li>
          <li><a href="#notification-templates">{t('admin.dashboard.notificationTemplates')}</a></li>
          <li><a href="#loyalty-program">{t('admin.dashboard.loyaltyProgram')}</a></li>
          <li><a href="#external-providers">{t('admin.dashboard.externalProviders')}</a></li>
          <li><a href="#tenant-branding">{t('admin.dashboard.tenantBranding')}</a></li>
          <li><a href="#wallet">{t('admin.dashboard.wallet')}</a></li>
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
      <section id="flight-source-priorities">
        <h2>{t('admin.dashboard.flightSourcePriorities')}</h2>
        <HayatFlightSourcePriorityManager />
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
      <section id="external-providers">
        <h2>{t('admin.dashboard.externalProviders')}</h2>
        <HayatExternalProviderManager />
      </section>
      <section id="tenant-branding">
        <h2>{t('admin.dashboard.tenantBranding')}</h2>
        <HayatTenantBrandingConfig />
      </section>
      <section id="wallet">
        <h2>{t('admin.dashboard.wallet')}</h2>
        <HayatWalletManager />
      </section>
    </div>
  );
};
