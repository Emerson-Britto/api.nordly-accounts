"use strict";
var path = require('path');
var apiUrl = 'https://api-musiky.herokuapp.com';
var local_API = 'http://localhost:8877';
var getTime = function () {
    return new Date().getHours();
};
var greeting = function () {
    var time = getTime() - 3;
    if (time < 0) {
        time = time + 24;
    }
    var period = [
        { 'Good Night': time >= 0 && time < 5 },
        { 'SunRise': time == 5 },
        { 'Good Morning': time >= 6 && time < 12 },
        { 'Good Afternoon': time >= 12 && time < 18 },
        { 'Good Evening': time >= 18 && time <= 23 }
    ];
    var firstIndexSameTrue = period.findIndex(function (value) { return Object.values(value)[0] == true; });
    var greetingText = Object.keys(period[firstIndexSameTrue])[0];
    var imgRandom = ~~(Math.random() * 3);
    filePath = "period/1".concat(firstIndexSameTrue, "4/").concat(imgRandom, "2.gif");
    obj = {
        'greetingText': greetingText,
        'greetingImg': "".concat(local_API, "/msk/files/img?path=").concat(filePath)
    };
    return obj;
};
module.exports = greeting;
