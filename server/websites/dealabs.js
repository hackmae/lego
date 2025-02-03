const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} deal
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('div.content-list')
    .map((i, element) => {
      const price = parseFloat(
        $(element)
          .find('span.text--b size--all-xl size--fromW3-xxl thread-price')
          .text()
      );

      const discount = Math.abs(parseInt(
        $(element)
          .find('span.class="textBadge bRad--a-m flex--inline text--b boxAlign-ai--all-c size--all-s size--fromW3-m space--h-1 space--ml-1 space--mr-0 textBadge--green"')
          .text()
      ));

      const img = $(element)
        .find('imgFrame imgFrame--noBorder imgFrame--darken-new')
        .attr('src');

      const temperature = $(element)
        .find('span.overflow--wrap-off')
        .text();

      return {
        discount,
        price,
        'title': $(element).attr('title'),
        img,
        temperature,
      };
    })
    .get();
};

/**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @returns 
 */
module.exports.scrape = async url => {
  const response = await fetch(url);

  if (response.ok) {
    const body = await response.text();

    return parse(body);
  }

  console.error(response);

  return null;
};