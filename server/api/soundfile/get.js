export default (app, config, logger) => {
  return {
    method: 'GET',
    uri: '/soundfile/:id',
    handlers: [
      (req, res) => {
        app.get('repository:soundfile').get(req.params.id)
          .then((file) => {
            logger.log(`Soundfile ${req.params.id} found`);
            res.type('audio/mpeg3').send(file);
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
