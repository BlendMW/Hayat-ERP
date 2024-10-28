import { useState, useEffect } from 'react';

export const useLocale = () => {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // Load locale from storage or API
  }, []);

  return { locale, setLocale };
};
