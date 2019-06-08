export default (app, config, logger) => {
  return {
    method: 'GET',
    uri: '/song/:id',
    handlers: [
      (req, res) => {
        app.get('repository:song').get(req.params.id)
          .then((song) => {
            logger.log(`Song ${req.params.id} found`);
            res.json(song);
          })
          .catch((err) => {
            (err.statusCode && err.statusCode !== 500 ? logger.log : logger.error)(`An error occured: ${err.message}`, err);
            res.status(err.statusCode || 500).json(err);
          })
        ;
      },
    ],
  };
};
