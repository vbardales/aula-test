export default (app, config, logger) => {
  return {
    method: 'DELETE',
    uri: '/song/:id',
    handlers: [
      (req, res) => {
        app.get('repository:song').delete(req.params.id)
          .then((song) => {
            logger.log(`Song ${req.params.id} deleted`);
            res.statusCode(204).send();
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
