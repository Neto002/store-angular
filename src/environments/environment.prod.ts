export const environment = {
  production: true,

  // apiUrl: 'https:localhost:8443/api',
  apiUrl: process.env.API_URL,
  stripePublishableKey: process.env.STRIPE_SECRET,
};
