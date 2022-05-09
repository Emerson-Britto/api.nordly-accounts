class InvalidArgumentError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'InvalidArgumentError';
    this.msg = msg;
  }
}

class InternalServerError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'InternalServerError';
    this.msg = msg;
  }
}

class InvalidService extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'InvalidService';
    this.msg = msg;
  }
}

export {
  InvalidArgumentError,
  InternalServerError,
  InvalidService
};
