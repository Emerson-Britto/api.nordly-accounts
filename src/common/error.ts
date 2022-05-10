class InvalidArgumentError extends Error {
  msg:string;
  constructor(msg:string) {
    super(msg);
    this.name = 'InvalidArgumentError';
    this.msg = msg;
  }
}

class InternalServerError extends Error {
  msg:string;
  constructor(msg:string) {
    super(msg);
    this.name = 'InternalServerError';
    this.msg = msg;
  }
}

class InvalidService extends Error {
  msg:string;
  constructor(msg:string) {
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
