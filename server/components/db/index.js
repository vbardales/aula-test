import fs from 'fs';
import Promise from 'bluebird';
Promise.promisifyAll(fs);

export default class Db {
  constructor(name, path, logger) {
    this.name = name;
    this.path = path;
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

  save(id, data) {
    return fs.writeFileAsync(path.join(this.path, id), JSON.stringify(data))
      .tap(() => this.logger.log(`File ${id} created`))
      .tapCatch((err) => this.logger.error(`An error occured while saving file ${id}: ${err.message}`, err))
    ;
  }

  delete(id) {
    return fs.deleteFileAsync(path.join(this.path, id))
      .tap(() => this.logger.log(`File ${id} deleted`))
      .tapCatch((err) => this.logger.error(`An error occured while deleting file ${id}: ${err.message}`, err))
    ;
  }

  get(id) {
    return fs.readFileAsync(path.join(this.path, id))
      .then((data) => JSON.parse(data))
      .tap(() => this.logger.log(`File ${id} found`))
      .tapCatch((err) => this.logger.error(`An error occured while getting file ${id}: ${err.message}`, err))
    ;
  }

  find() {
    return fs.scanDirAsync(this.path)
      .tap((files) => this.logger.log(`${_.size(files)} files found`))
      .then((files) => _.map(files, filepath => filepath.replace(this.path, '')))
      .tapCatch((err) => this.logger.error(`An error occured while finding files: ${err.message}`, err))
    ;
  }
}
