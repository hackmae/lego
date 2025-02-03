const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage data response
 * @param  {String} data - HTML response
 * @return {Array} deals
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('article.thread') // Adjusted selector to match Dealabs structure
    .map((i, element) => {
      const title = $(element)
        .find('div.threadListCard-header a') // Updated selector for title
        .text()
        .trim();

      const price = parseFloat(
        $(element)
          .find('span.thread-price') // Updated selector for price
          .text()
          .replace(/[^0-9,.]/g, '')
          .replace(',', '.')
      );

      const discount = parseInt(
        $(element)
          .find('span.chip-chip--type-default') // Updated selector for discount
          .text()
          .replace(/[^0-9-]/g, ''),
        10
      );

      const img = $(element)
        .find('div.threadListCard-image img') // Updated selector for image
        .attr('data-src') || $(element).find('div.threadListCard-image img').attr('src');

      const temperature = $(element)
        .find('div.vote-box .vote-box__temp') // Updated selector for temperature
        .text()
        .trim();

      const comments = $(element)
        .find('div.threadListCard-footer a') // Updated selector for comments
        .text()
        .trim();

      const date = $(element)
        .find('time') // Updated selector for date
        .attr('datetime') || $(element).find('time').text().trim();

      return {
        title,
        price: isNaN(price) ? null : price,
        discount: isNaN(discount) ? null : discount,
        img,
        temperature,
        comments,
        date,
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
    return parse(body);
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return null;
  }
};
