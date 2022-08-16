module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tiles',
        permanent: true,
      },
    ];
  },
};
