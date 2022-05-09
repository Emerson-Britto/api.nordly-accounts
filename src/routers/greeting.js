let path = require('path')

const apiUrl = 'https://api-musiky.herokuapp.com'
const local_API = 'http://localhost:8877'

const getTime = () => {
    return new Date().getHours();
}

const greeting = () => {
    var time = getTime() - 3
    if(time < 0){time = time + 24}

    const period = [
        {'Good Night': time >= 0 && time < 5},
        {'SunRise': time == 5},
        {'Good Morning': time >= 6 && time < 12},
        {'Good Afternoon': time >= 12 && time < 18},
        {'Good Evening': time >= 18 && time <= 23}
    ]

    let firstIndexSameTrue = period.findIndex(value => Object.values(value)[0] == true);
    let greetingText = Object.keys(period[firstIndexSameTrue])[0]

    let imgRandom = ~~(Math.random() * 3);

    filePath = `period/1${firstIndexSameTrue}4/${imgRandom}2.gif`

    obj = {
        'greetingText': greetingText,
        'greetingImg': `${local_API}/msk/files/img?path=${filePath}`
    }

    return obj
}

module.exports = greeting
