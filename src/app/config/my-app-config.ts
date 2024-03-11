export default {
  oidc: {
    clientId: 'OKTA_CLIENT_ID',
    issuer: 'OKTA_ISSUER',
    redirectUri: 'https://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email'],
  },
};
