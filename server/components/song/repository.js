import uuid from 'uuid';
import Joi from 'joi';
import Promise from 'bluebird';

import Song from './';

const SongSchema = Joi.object({
  name: Joi.string().required(),
});

export default class SongRepository {
  constructor(db, Soundfiles, logger) {
    this.db = db;
    this.Soundfiles = Soundfiles;

    Object.defineProperty(this, 'logger', { // not enumerable nor writable
      value: logger,
    });
  }

  static getId() {
    return uuid.v4();
  }

  create(songData, soundfile) {
    Joi.assert(songData, SongSchema);

    const song = new Song(SongRepository.getId(), songData.name);
    return this.db.save(song._id, song)
      .then((song) => {
        logger.log(`Song ${song._id} created`);
        return this.Soundfiles.save(soundfile)
          .tap(() => logger.log(`Soundfile ${song._id} created`))
          .return(song)
          .tapCatch((err) => {
            logger.log(`Rollback on song creation due to: ${err.message}`, err);
            return this.delete(song._id)
              .tap(() => logger.log(`Song ${song._id} rolled back`))
              .return(Promise.reject(err))
            ;
          })
        ;
      })
    ;
  }

  delete(id) {
    return this.db.delete(id);
  }

  get(id) {
    return this.db.get(id)
      .then((data) => JSON.parse(data))
      .tapCatch(err => this.logger.error(`Song ${id} data are corrupted: ${err.message}`))
    ;
  }

  find(from, size) {
    return this.db.find();
  }
}
