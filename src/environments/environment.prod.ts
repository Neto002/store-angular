// declare var process: {
//   env: {
//     API_URL: string;
//     STRIPE_SECRET: string;
//     OKTA_CLIENT_ID: string;
//     OKTA_ISSUER: string;
//   };
// };

export const environment = {
  production: true,

  // apiUrl: 'https:localhost:8443/api',
  apiUrl: '$API_URL',
  stripePublishableKey: '$STRIPE_SECRET',
};
