const puppeteer = require('puppeteer');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');


// process tranco list csv into usable array
let trancoList = buildTrancoList('tranco/top-1m.csv');

function buildTrancoList(filepath) {
  let list = []

  fs.createReadStream('tranco/top-1m.csv').pipe(csv()).on('data', (row) => {
    list.push(row["google.com"]);
  });

  return list;
};


// path to directory that contains manifest.json of the pb version you want to install on the headless browser
const pathToPB = path.join(__dirname, 'pb/privacybadger-master/src/');



// launch headless browser installed with privacy badger
(async () => {
  const browser = await puppeteer.launch({
    // until further notice, extensions only work in non-headless mode: https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#working-with-chrome-extensions
    headless: false,
    args: [
      `--disable-extensions-except=${pathToPB}`,
      `--load-extension=${pathToPB}`
    ]
  });

  let temporaryList = trancoList.slice(0, 10000)

  // crawl through tranco list and attempt to visit each within the same browser context
  for (let url of temporaryList) {
    console.log('Visiting ' + trancoList.indexOf(url) + '/' + temporaryList.length +' : ' + url);
    let page = await browser.newPage();

    try{
      await page.goto('https://www.'+ url, { timeout: 6000});
    } catch(err) {
      console.log('An error occurred on ' + url +  ': \t ' + err)
    } finally {
      await page.close();
    }
  };
})();
