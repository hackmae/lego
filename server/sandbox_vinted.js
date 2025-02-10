/* eslint-disable no-console, no-process-exit */
const vinted = require('./websites/vinted');

async function sandbox (website = `https://www.vinted.fr/`) {
  try {
    console.log(`🕵️‍♀️  browsing ${website} website`);

    const deals = await vinted.scrape(website);

    console.log(deals);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
