import React from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const messages = {
  en,
  ar,
};

interface IntlProviderProps {
  children: React.ReactNode;
  locale: string;
}

export const IntlProvider: React.FC<IntlProviderProps> = ({ children, locale }) => (
  <ReactIntlProvider messages={messages[locale]} locale={locale}>
    {children}
  </ReactIntlProvider>
);
