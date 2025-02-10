const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { v5: uuidv5 } = require('uuid');

/**
 * Parse webpage HTML response
 * @param {String} data - html response
 * @return {Object} deals
 */
const parseHTML = data => {
  const $ = cheerio.load(data, { 'xmlMode': true });

  return $('div.prods a')
    .map((i, element) => {
      const price = parseFloat($(element).find('span.prodl-prix span').text());
      const discount = Math.abs(parseInt($(element).find('span.prodl-reduc').text()));

      return {
        discount,
        price,
        'title': $(element).attr('title')
      };
    })
    .get();
};

/**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @returns 
 */
const scrape = async url => {
  const response = await fetch(url);

  if (response.ok) {
    const body = await response.text();
    return parseHTML(body);
  }

  console.error(response);
  return null;
};

// New code for scraping with predefined cookies and headers
const scrapeWithCookies = async searchText => {
  try {
    const response = await fetch('https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1739194586&search_text=42181&catalog_ids=&size_ids=&brand_ids=&status_ids=&material_ids='
        , {
      headers: {
        'accept': '/',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'sec-ch-ua': `"Google Chrome";v="129", "NotABrand";v="99", "Chromium";v="129"`,
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'cookie': __cf_bm=V2Ef1i74yZtEzQNm_3Y24xy7zvHSJhFjNQRXVS0tW69QMrml2pXkpQk1,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        'referer': 'https://www.vinted.fr/',
        'referrerPolicy': 'strict-origin-when-cross-origin',
      },
      body: null,
      method: 'GET'
    });

    if (response.ok) {
      const body = await response.json();
      return parseJSON(body);  // Adjusted to use JSON parsing function
    }
    console.error(response);
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Parse JSON response
 * @param {String} data - json response
 * @return {Object} sales
 */
const parseJSON = data => {
  try {
    const { items } = data;
    return items.map(item => {
      const link = item.url;
      const price = item.item_price;
      const photo = item;
      const published = photo.high_resolution && photo.high_resolution.timestamp;

      return {
        link,
        'price': price.amount,
        'title': item.title,
        'published': new Date(published * 1000).toUTCString(),
        'uuid': uuidv5(link, uuidv5.URL)
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Exporting the scraping functions
module.exports = {
  scrape,
  scrapeWithCookies
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
    console.error(`Error scraping ${url}:, ${error.message}`);
    return null;
  }
};