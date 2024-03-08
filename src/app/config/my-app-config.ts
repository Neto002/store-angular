export default {
  oidc: {
    clientId: '${OKTA_CLIENT_ID}',
    issuer: '${OKTA_ISSUER}',
    redirectUri: '${OKTA_REDIRECT_URL}',
    scopes: ['openid', 'profile', 'email'],
  },
};
