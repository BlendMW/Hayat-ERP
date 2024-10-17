import React from 'react';
import { Amplify } from '@aws-amplify/core';
import { I18n } from '@aws-amplify/core';
import i18n from './i18n/config';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
I18n.setLanguage('en'); // Set default language

function App() {
  // ... (existing component logic)

  const changeLanguage = (lng: string) => {
    I18n.setLanguage(lng);
  };

  return (
    <div>
      {/* Add language switcher */}
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ar')}>العربية</button>

      {/* Use I18n.get() for translations */}
      <h1>{I18n.get('Search Flights')}</h1>
      {/* ... (rest of your component) */}
    </div>
  );
}

export default App;
