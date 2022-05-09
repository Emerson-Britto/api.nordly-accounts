"use strict";
var ShortCutUrl = /** @class */ (function () {
    function ShortCutUrl() {
        throw Error("No constructor");
    }
    ShortCutUrl.normalizeUrl = function (url) {
        url = url.replace(/H2%/g, "https://");
        url = url.replace(/H1%/g, "http://");
        url = url.replace(/W1%/g, "www");
        url = url.replace(/E4%/g, ".com");
        url = url.replace(/P3%/g, ".");
        return url;
    };
    ShortCutUrl.codeUrl = function (url) {
        url = url.replace(/https:/g, "H2%");
        url = url.replace(/http:/g, "H1%");
        url = url.replace(/www/g, "W1%");
        url = url.replace(/.com/g, "E4%");
        url = url.replace(/./g, "P3%");
        return url;
    };
    return ShortCutUrl;
}());
module.exports = ShortCutUrl;
