const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');


/**
 * Parse webpage data response
 * @param  {String} data - HTML response
 * @return {Array} deals
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('div.js-threadList article') 
    .map((i, element) => {
      const link = $(element)
        .find('a[data-t="threadLink"]')
        .attr('href');

      const data = JSON.parse($(element)
        .find('div.js-vue2')
        .attr('data-vue2'));

      //console.log(data);

      const thread = data.props.thread|| null;
      const retail = thread.nextBestPrice|| null;
      const price = thread.price|| null;
      const discount = parseInt((1 - price / retail) * 100)|| null;
      const temperature = +thread.temperature|| null;
      const image = 'https://static-pepper.dealabs.com/threads/raw/${thread.mainImage.slotId}/${thread.mainImage.name}/re/300x300/qt/60/${thread.mainImage.name}.${thread.mainImage.ext}';
      const comments = +thread.commentCount|| 0;
      const published = new Date(thread.publishedAt *1000)|| null;
      const title = thread.title|| null;
      const id = thread.threadId || null; 


      return {
        link, 
        retail,
        price,
        discount,
        temperature,
        image,
        comments,
        published,
        title,
        id,
      };
    })
    .get();
};

/**
 * Scrape a given URL page
 * @param {String} url - URL to parse
 * @returns {Promise<Array|null>} Extracted deals
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const body = await response.text();
    const parsedDeals = parse(body);
    //put in a json file
    fs.writeFileSync('Alldeals.json', JSON.stringify(parsedDeals, null, 2), 'utf-8');
    console.log('Deals OK');

    return parsedDeals;
  } catch (error) {
    console.error(`Error scraping ${url}:, ${error.message}`);
    return null;
  }
};