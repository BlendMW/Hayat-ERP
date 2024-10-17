import { I18n } from '@aws-amplify/core';

const enDict = {
  'Search Flights': 'Search Flights',
  'From': 'From',
  'To': 'To',
  'Departure Date': 'Departure Date',
  'Return Date': 'Return Date',
  'Passengers': 'Passengers',
  'Search': 'Search',
  // Add more translations as needed
};

const arDict = {
  'Search Flights': 'البحث عن الرحلات',
  'From': 'من',
  'To': 'إلى',
  'Departure Date': 'تاريخ المغادرة',
  'Return Date': 'تاريخ العودة',
  'Passengers': 'المسافرون',
  'Search': 'بحث',
  // Add more translations as needed
};

const i18n = new I18n({
  lng: 'en', // Default language
  fallbackLng: 'en',
  resources: {
    en: { translation: enDict },
    ar: { translation: arDict },
  },
});

export default i18n;
