import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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

i18n
  .use(initReactI18next)
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en',
    resources: {
      en: { translation: enDict },
      ar: { translation: arDict },
    },
  });

export default i18n;
