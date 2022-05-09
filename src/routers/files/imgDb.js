const path = require('path');

const imgDb = imgPath => {
    let img = path.join(__dirname, `../../dataBase/imgs/${imgPath}`);
    return img
}

module.exports = imgDb
