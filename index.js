const puppeteer = require('puppeteer');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');

(async () => {
  const pathToPB = path.join(__dirname, 'pb/privacybadger-master/src/');

  // launch browser automatically installed with privacy badger
  const browser = await puppeteer.launch({
    // until further notice, extensions only work in non-headless mode: https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#working-with-chrome-extensions
    headless: false,
    args: [
      `--disable-extensions-except=${pathToPB}`,
      `--load-extension=${pathToPB}`
    ]
  });

  // get access to the pb background page
  const targets = await browser.targets();
  const backgroundPageTarget = targets.find(target => target.type() === 'background_page');
  const backgroundPage = await backgroundPageTarget.page();

  const page = await browser.newPage();

  await page.goto('https://www.google.com')


  // process tranco list csv into usable array
  const trancoList = [];
  fs.createReadStream('tranco/top-1m.csv').pipe(csv()).on('data', (row) => {
    // for whatever reason each domain gets indexed as a property of google.com
    trancoList.push(row["google.com"])
  }).on('end', () => {
    console.log('finished processing tranco list');
    // CALLBACK FOR VISITING EACH DOMAIN SHOULD GO HERE?
  });

})();
