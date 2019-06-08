export default (app, config, logger) => {
  return {
    method: 'PUT',
    uri: '/song/:id',
    handlers: [
      (req, res) => {
        app.get('repository:song').update(req.params.id, req.body)
          .then((song) => {
            logger.log(`Song ${req.params.id} updated`);
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
