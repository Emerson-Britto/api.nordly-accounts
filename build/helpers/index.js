"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.formValidator = exports.urlEncoding = void 0;
var urlEncoding_1 = require("./urlEncoding");
Object.defineProperty(exports, "urlEncoding", { enumerable: true, get: function () { return __importDefault(urlEncoding_1).default; } });
var formValidator_1 = require("./formValidator");
Object.defineProperty(exports, "formValidator", { enumerable: true, get: function () { return __importDefault(formValidator_1).default; } });
const sleep = (fc, time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            fc();
            resolve();
        }, time);
    });
};
exports.sleep = sleep;
