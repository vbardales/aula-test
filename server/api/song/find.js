import _ from 'lodash';

export default (app, config, logger) => {
  return {
    method: 'GET',
    uri: '/song',
    handlers: [
      (req, res) => {
        const from = req.query.from || 0;
        const size = req.query.size || 20;
        app.get('repository:song').find(from, size)
          .then((songs) => {
            logger.log(`${_.size(songs)} songs found`);
            res.json(songs);
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
