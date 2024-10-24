import { Amplify } from 'aws-amplify';

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export const updateTheme = (theme: Theme) => {
  const updatedTheme = {
    name: 'myTheme',
    overrides: [
      {
        tokens: {
          colors: {
            brand: {
              primary: {
                10: theme.primaryColor,
                80: theme.secondaryColor,
              },
            },
          },
          fonts: {
            default: {
              variable: { value: theme.fontFamily },
              static: { value: theme.fontFamily },
            },
          },
        },
      },
    ],
  };

  Amplify.configure({
    UI: {
      theme: updatedTheme,
    },
  });
};
