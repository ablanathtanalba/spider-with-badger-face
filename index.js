const puppeteer = require('puppeteer');
const path = require('path');

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

  const page = await browser.newPage();
})();
