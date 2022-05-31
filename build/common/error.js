"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTokenError = exports.InvalidService = exports.InternalServerError = exports.InvalidArgumentError = void 0;
class InvalidArgumentError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'InvalidArgumentError';
        this.msg = msg;
    }
}
exports.InvalidArgumentError = InvalidArgumentError;
class InvalidTokenError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'InvalidTokenError';
        this.msg = msg;
    }
}
exports.InvalidTokenError = InvalidTokenError;
class InternalServerError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'InternalServerError';
        this.msg = msg;
    }
}
exports.InternalServerError = InternalServerError;
class InvalidService extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'InvalidService';
        this.msg = msg;
    }
}
exports.InvalidService = InvalidService;
