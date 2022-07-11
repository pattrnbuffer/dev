export const app = {
  clientId: process.env.GITHUB_APP_CLIENT_ID,
  clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  scope: ['read:user', 'user:email', 'read:repo'],
};
