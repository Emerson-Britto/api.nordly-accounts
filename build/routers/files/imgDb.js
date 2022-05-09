"use strict";
var path = require('path');
var imgDb = function (imgPath) {
    var img = path.join(__dirname, "../../dataBase/imgs/".concat(imgPath));
    return img;
};
module.exports = imgDb;
