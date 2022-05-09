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
var Mail = require('./index.js').Mail;
function mailText(_a) {
    var mail = _a.mail, code = _a.code;
    return "\n  By: inifity - account center\n  Mail: ".concat(mail, "\n  Verification Code: ").concat(code, "\n  ");
}
function mailHtml(_a) {
    var mail = _a.mail, code = _a.code;
    return "\n<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n  <link href=\"https://fonts.googleapis.com/css2?family=Padauk&display=swap\" rel=\"stylesheet\">\n  <style>\n    * {\n      margin: 0;\n      padding: 0;\n      color: #fff;\n    }\n  </style>\n  <title>INFINITY</title>\n</head>\n<body\n  style=\"\n    background-color: #000;\n  \"\n>\n  <section\n    style=\"\n      text-align: center;\n      width: 90vw;\n      margin: 0 auto;\n      height: 80vh;\n    \">\n    <img\n      style=\"width: 70%;\"\n      src=\"https://cdn-istatics.herokuapp.com/static/imgs/branding/infinity-center.png\"\n      alt=\"ifinity center img\"\n    />\n    <hr style=\"opacity: 30%; width: 80%; margin: 0 auto;\" />\n\n    <section style=\"text-align: center; color: #fff; font-family: sans-serif;\">\n\n      <img\n        style=\"width: 160px; margin: 20px 0;\"\n        src=\"https://cdn-istatics.herokuapp.com/static/imgs/repository/sendMail.png\"\n        alt=\"sendMail_icon\"\n      />\n      <h2 style=\"margin: 30px 0 50px 0;\">Verification Code</h2>\n      <p>Mail: ".concat(mail, "</p>\n      <p style=\"font-size: 1.2em; margin: 10px 0;\"><strong>Code: ").concat(code, "</strong></p>\n    </section>\n  </section>\n</body>\n</html>\n  ");
}
var VerificationMail = /** @class */ (function (_super) {
    __extends(VerificationMail, _super);
    function VerificationMail(_a) {
        var mail = _a.mail, code = _a.code;
        var _this = _super.call(this) || this;
        _this.from = '"Infinity Center" <noreply@inifity.com>';
        _this.to = mail;
        _this.subject = 'Verification Mail';
        _this.text = mailText({ mail: mail, code: code });
        _this.html = mailHtml({ mail: mail, code: code });
        return _this;
    }
    return VerificationMail;
}(Mail));
module.exports = { VerificationMail: VerificationMail };
