import _ from 'lodash';
import Promise from 'bluebird';

export default (app, config, logger) => {
  return {
    method: 'GET',
    uri: '/song',
    handlers: [
      (req, res) => {
        const from = req.query.from || 0;
        const size = req.query.size || 20;
        const Songs = app.get('repository:song');
        Songs.find(from, size)
          .then((songs) => Promise.map(songs, song => Songs.get(song)))
          .then((songs) => {
            logger.log(`${_.size(songs)} song(s) found`);
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
