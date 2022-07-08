import GitHub from 'next-auth/providers/github';

export const GithubAuthProvider = GitHub({
  clientId: process.env.GITHUB_OAUTH_ID,
  clientSecret: process.env.GITHUB_OAUTH_SECRET,
});
