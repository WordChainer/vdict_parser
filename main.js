const { promisify } = require('util');
const request = promisify(require('request'));
const cheerio = require('cheerio');
const fs = require('fs');
const URL = 'https://vdict.pro/kr-kr/';

function main() {
    let words = [];

    getWords(words);
}

async function getWords(words, word = 'ㄱ') {
    let { body } = await request(URL + encodeURIComponent(word)),
        $ = cheerio.load(body);


    console.log(`진행 상황: ${word}`);
        
    let res = $('.list-words .nav-item a').map(function() {
        return $(this).text();
    }).toArray();

    words = words.concat(res);
    console.log(`${words.length}개 파싱완료\n`);

    if (res.length === 50) {
        getWords(words, res[res.length - 1]);
    } else {
        fs.writeFileSync('result.txt', words.join('\r\n'));
    }
}

main();