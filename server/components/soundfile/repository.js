export default class SoundfileRepository {
  constructor(db, logger) {
    this.db = db;

    Object.defineProperty(this, 'logger', { // not enumerable nor writable
      value: logger,
    });
  }

  get(id) {
    return this.db.get(id);
  }
}
