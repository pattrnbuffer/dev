module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/three',
        permanent: true,
      },
    ];
  },
};
