export default () => {
  return {
    method: 'GET',
    uri: '/',
    handlers: [
      (req, res) => {
        res.json({
          songs: '/song',
          soundfiles: '/soundfile',
        });
      },
    ],
  };
};
