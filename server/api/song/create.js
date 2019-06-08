import multer from 'multer';

export default (app, config, logger) => {
  return {
    method: 'POST',
    uri: '/song',
    handlers: [
      multer().single('audio'),
      (req, res) => {
        const Songs = app.get('repository:song');
        Songs.create(req.body, req.file)
          .then((song) => {
            logger.log(`Song and soundfile ${song._id} created`);
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
