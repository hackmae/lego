//const fetch = require('node-fetch');
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
/*
const scrape = async url => {
  const response = await fetch(url);

  if (response.ok) {
    const body = await response.text();
    return parseHTML(body);
  }

  console.error(response);
  return null;
};*/

// Code for scraping with predefined cookies and headers
const scrapeWithCookies = async searchText => {
  try {
    console.log('with cookies');
    const response = await fetch("https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1739198434&search_text=42181&catalog_ids=&size_ids=&brand_ids=&status_ids=&material_ids=", {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7",
          "cache-control": "max-age=0",
          "if-none-match": "W/\"e5c44ebc4777349faafda9e198699b78\"",
          "priority": "u=0, i",
          "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "cookie": "v_udt=dnIxalJiMi8rNEhRSE9NWHUwRzZNdG4vZTBaKy0tS3hTSG5uYmx1SFR5amw2Ry0tRy9JUEtoQXVBak91d0c3QjE0Z1AxUT09; anonymous-locale=fr; anon_id=8c861941-8774-4eb8-b55b-c377e82e3d46; ab.optOut=This-cookie-will-expire-in-2026; OptanonAlertBoxClosed=2025-01-06T14:51:22.504Z; eupubconsent-v2=CQKzpVgQKzpVgAcABBENBXFgAAAAAAAAAChQAAAAAAFBIIQACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcEA5MBy4DxwHtAQhAheEAOgAOABIAOcAg4BPwEegJFASsAm0BT4CwgF5AMQAYtAyEDIwGjANTAbQA24BugDygHyAP3AgIBAyCCIIJgQYAhWBC4cAwAARAA4ADwALgAkAB-AGgAc4A7gCAQEHAQgAn4BUAC9AHSAQgAj0BIoCVgExAJlATaApABSYCuwFqALoAYgAxYBkIDJgGjANNAamA14BtADbAG3AOPgc6Bz4DygHxAPtgfsB-4EDwIIgQYAg2BCsdBLAAXABQAFQAOAAgABdADIANQAeABEACYAFWALgAugBiADeAHoAP0AhgCJAEsAJoAUYArQBhgDKAGiANkAd4A9oB9gH6AP-AigCMAFBAKuAWIAuYBeQDFAG0ANwAcQA6gCHQEXgJEATIAnYBQ4Cj4FNAU2AqwBYoC2AFwALkAXaAu8BeYC-gGGgMeAZIAycBlUDLAMuAZyA1UBrADbwG6gOLAcmA5cB44D2gH1gQBAhaQAJgAIADQAOcAsQCPQE2gKTAXkA1MBtgDbgHPgPKAfEA_YCB4EGAINgQrIQHQAFgAUABcAFUALgAYgA3gB6AEcAO8Af4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAIgATAAqgBcADFAIYAiQBHACjAFaANkAd4A_ACrgGKAOoAh0BF4CRAFHgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDgABcAFAAVAA4ACCAGQAaAA8ACIAEwAKQAVQAxAB-gEMARIAowBWgDKAGiANkAd8A-wD9AIsARgAoIBVwC5gF5AMUAbQA3ACHQEXgJEATsAocBTYCxQFsALgAXIAu0BeYC-gGGgMkAZPAywDLgGcwNYA1kBt4DdQHBAOTAeOA9oCEIELSgCEAC4AJABHADnAHcAQAAkQBYgDXgHbAP-Aj0BIoCYgE2gKQAU-ArsBdAC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhW.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaWF0IjoxNzM5MTkzOTY5LCJzaWQiOiIwMjQ2MTllNS0xNzM5MTkzOTY5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3MzkyMDExNjksInB1cnBvc2UiOiJhY2Nlc3MifQ.ZS124R452FON93qBVkbjBJZqtpJom_Hiv5mqqjcrUfG7OcO1OxLdybR5h1mMKz0YWQQ6hwZ3kbyrteP9K-yVlKcibGi0eBPqdTBKVNHna1-LP5A6NX573pufeKno2qqbOzNGD4uVziJmpqtTlTiypyt1vOHEUMvYOtBA2J-rCUfsIkYk-psak_tr0YX9lVd2aa_w9yJPmfV9fntdAOqizguXb0GDu5l_Lsd6kHl7cHEl7v6CY4gW_tSHTc6mRCzqh6G1XtEOep28nWLP9hQlROpzPFrAng0iw-UlMRZtpbQvz1yjDjBWkIH9pQhkjoQsrUhL_8YFgKNKsq2xmXbVpA; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaWF0IjoxNzM5MTkzOTY5LCJzaWQiOiIwMjQ2MTllNS0xNzM5MTkzOTY5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3Mzk3OTg3NjksInB1cnBvc2UiOiJyZWZyZXNoIn0.QRhsR7EuiVxJwHyMKX2vXYE_wJPWxpXNil3OIikxNG6v_2Ae2HMT_z1wvSmucOydikMQOMFsm2gt7dP5-AblfWLgEOPr5b29KsC4Tej-r7-QWJ7dMz1m1FXeuxthlbEYdB3voMAQD-fzf7BNNZ2oMDEJx7UMJeUtdgtU9kczFf95JV3Kg4_zMMgX9FuWLGvxejZIUt19b4SV1tAtIonYNNM9SKuDOVk6VN0JtGVNnT0abigEoWUNognRt2gphkLMaSoww8odxeRk-WKt24icZEV1UIBTvm4yICgL2lQmeZoiM5d-2Pkfe6E9DZCHl0HjiaYUwtYlMwroI3vHNJtSeA; v_sid=8395684249d75015bc6e46545e359fa2; __cf_bm=9JKG2X2n1qsxHUC_KhbtkyVVpJXbWHCYhJoDezt5tuY-1739198055-1.0.1.1-07ONZlanQjo_KUwiM53IWAcNZLM68olRIwUMnYv0kOG2V1r9kOSNTkUGzWNLJoJpwgs1Wzvyg6pmG6iJ2JJr0c_qJ5aSve1F_Huarw1p_ec; cf_clearance=iMdRa_kbtyPQboPu2RTk8U.gOwMQoKahqUOBljK8JMA-1739198056-1.2.1.1-Aujfz_JYvQ4ZOQ0cmuq6_UlCYHAwpu2V9hx9_GTI1teQSDzk4POkw65ns4kcoQEoaYMMxa9aHaKDGjFaHgPcsvW5tTtCerg8kvlR74hyGVSCzirnXth5ThRZlZcuk08zwQhTCCnHl1VOMJSSkG79DcR_scSPYuml5XeP7jGa6y8exQhR70i0EmsbOjEIlDS6_CzdqLzAwLQe.BTV5hvH0Zl68ZikaY1zpNhym60GwZLPm_H7VTWmGjQLNoBQqbbRNr3m25X5Y.fCLKGqHQVhWOunUdRfyC4EWQKL0M_lOzg; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Feb+10+2025+15%3A46%3A07+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=8c861941-8774-4eb8-b55b-c377e82e3d46&interactionCount=30&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3BIDF&AwaitingReconsent=false; banners_ui_state=SUCCESS; viewport_size=602; datadome=Kf1zpXLS1YEWhlCfa2i9SOge9yN9qSWvn00ACKo0WdhSeNxQlyShBSR_24C3StY2~lzwuTaPq1I~bxvV4qcKvqqcIZUOdzqYsC5K9vVnKqgVVHIqiwNmXb_0e6IgoYVS; _vinted_fr_session=RzUvVFlmYXpTMVZBbFU0cEFheTVrOHU5eDFXKzU4eTJLd29vYlIrOXJKOEdtemEzbWVQOEhCQTlUSDVTZFNENFA3VGUwMVZoUjNVelhIQ3BzeGwySVpCZUZFQmtCNC9lMzJzdlJyM29jS3I1a0tkSDJaZTB4bmM5SncvTEY3ajNHcDlkdExFcmJhdENzMnBFcnFHampPck1zYXkrZXVqM2pZdlR4ei9XU25yc1VsYVlrUElkRkZXZUpKdUI2d3NUZURxOXo2MzJTUk9pb0hyRjlYNDhXS2JLWFlYNktmUC9zdlM0M01VaFZ0THdQLzQreUtzbDJrRVBsWFlSSXZ2Ly0tZjV4ckpoUU5LbGVoc3dJUDE4TTAzdz09--974495d70a850ffc75a0378706d17bb672da8373"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
      });

    if (response.ok) {
      const body = await response.json();
      return parseJSON(body);  // Adjusted to use JSON parsing function
    }
    console.log('ERROR');
    console.error(response);
    return null;
  } catch (error) 
    
  {
    console.log('ERROR');
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
    console.log(data);
    const { items } = data;
    return items.map(item => {
      const link = item.url;
      const price = item.total_item_price;
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
  //scrape,
  scrapeWithCookies
};

/**
 * Scrape a given URL page
 * @param {String} url - URL to parse
 * @returns {Promise<Array|null>} Extracted deals
 */
/*
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
};*/