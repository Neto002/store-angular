// declare var process: {
//   env: {
//     API_URL: string;
//     STRIPE_SECRET: string;
//     OKTA_CLIENT_ID: string;
//     OKTA_ISSUER: string;
//   };
// };

export default {
  oidc: {
    clientId: process.env['OKTA_CLIENT_ID'],
    issuer: process.env['OKTA_ISSUER'],
    redirectUri: 'https://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email'],
  },
};
