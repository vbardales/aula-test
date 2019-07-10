import fs from 'fs';
import Promise from 'bluebird';
import _ from 'lodash';
import path from 'path';
Promise.promisifyAll(fs);

export default class Db {
  constructor(name, path, ext, logger) {
    this.name = name;
    this.path = path;
    this.ext = ext;

    Object.defineProperty(this, 'logger', { // not enumerable nor writable
      value: logger,
    });
  }

  start() {
    if (this.isUp()) {
      return Promise.resolve();
    }

    return fs.mkdirAsync(this.path);
  }

  isUp() {
    return fs.existsSync(this.path);
  }

  _toFile(id) {
    return `${path.join(this.path, id)}.${this.ext}`;
  }

  _fromFile(filepath) {
    return filepath.replace(`^${this.path}`, '').replace(new RegExp('\.' + this.ext + '$'), '');
  }

  save(id, data) {
    return fs.writeFileAsync(this._toFile(id), data)
      .tap(() => this.logger.log(`File ${id} created`))
      .tapCatch((err) => this.logger.error(`An error occured while saving file ${id}: ${err.message}`, err))
    ;
  }

  delete(id) {
    return fs.deleteFileAsync(this._toFile(id))
      .tap(() => this.logger.log(`File ${id} deleted`))
      .tapCatch((err) => this.logger.error(`An error occured while deleting file ${id}: ${err.message}`, err))
    ;
  }

  get(id) {
    return fs.readFileAsync(this._toFile(id))
      .tap(() => this.logger.log(`File ${id} found`))
      .tapCatch((err) => this.logger.error(`An error occured while getting file ${id}: ${err.message}`, err))
    ;
  }

  find() {
    return fs.readdirAsync(this.path)
      .tap((files) => this.logger.log(`${_.size(files)} files found`))
      .then((files) => _.map(files, filepath => this._fromFile(filepath)))
      .tapCatch((err) => this.logger.error(`An error occured while finding files: ${err.message}`, err))
    ;
  }
}
