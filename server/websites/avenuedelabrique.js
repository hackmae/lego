const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} deal
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('div.prods a')
    .map((i, element) => {
      const price = parseFloat(
        $(element)
          .find('span.prodl-prix span')
          .text()
      );

      const discount = Math.abs(parseInt(
        $(element)
          .find('span.prodl-reduc')
          .text()
      ));

      const img = 'https://www.avenuedelabrique.com/img/'+$(element)
        .find('span.prodl-img img')
        .attr('data-src');

      const libelle = $(element)
        .find('span.prodl-libelle')
        .text();

      return {
        discount,
        price,
        'title': $(element).attr('title'),
        img,
        'libelle': libelle.replace(/\s\s+/g, ' ').trim(),
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