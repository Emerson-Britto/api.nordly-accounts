"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var InvalidArgumentError = /** @class */ (function (_super) {
    __extends(InvalidArgumentError, _super);
    function InvalidArgumentError(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = 'InvalidArgumentError';
        _this.msg = msg;
        return _this;
    }
    return InvalidArgumentError;
}(Error));
var InternalServerError = /** @class */ (function (_super) {
    __extends(InternalServerError, _super);
    function InternalServerError(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = 'InternalServerError';
        _this.msg = msg;
        return _this;
    }
    return InternalServerError;
}(Error));
var InvalidService = /** @class */ (function (_super) {
    __extends(InvalidService, _super);
    function InvalidService(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = 'InvalidService';
        _this.msg = msg;
        return _this;
    }
    return InvalidService;
}(Error));
module.exports = { InvalidArgumentError: InvalidArgumentError, InternalServerError: InternalServerError, InvalidService: InvalidService };
