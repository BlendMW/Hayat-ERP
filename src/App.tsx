import React from 'react';
import { IntlProvider } from './components/IntlProvider';
import { HayatBookingFlow } from './components/common/HayatBookingFlow';
import { useLocale } from './hooks/useLocale';

const App: React.FC = () => {
  const { locale, setLocale } = useLocale();

  return (
    <IntlProvider locale={locale}>
      <div className="app">
        <button onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}>
          Switch to {locale === 'en' ? 'Arabic' : 'English'}
        </button>
        <HayatBookingFlow userType="b2c" />
      </div>
    </IntlProvider>
  );
};

export default App;
