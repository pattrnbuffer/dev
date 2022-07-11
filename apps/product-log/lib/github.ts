export const app = {
  clientId: <string>process.env.GITHUB_APP_CLIENT_ID,
  clientSecret: <string>process.env.GITHUB_APP_CLIENT_SECRET,
  webhookSecret: <string>process.env.GITHUB_APP_WEBHOOK_SECRET,
  scope: ['read:user', 'user:email', 'read:repo'],
};
