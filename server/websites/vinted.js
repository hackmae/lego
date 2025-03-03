//const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { v5: uuidv5 } = require('uuid');
const fs = require('fs');


// Code for scraping with predefined cookies and headers
const scrapeWithCookies = async searchText => {
  try {
    console.log('with cookies');
    const response = await fetch("https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1739198768&search_text=42181&catalog_ids=&size_ids=&brand_ids=&status_ids=&material_ids=", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "fr",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-anon-id": "8c861941-8774-4eb8-b55b-c377e82e3d46",
          "x-csrf-token": "75f6c9fa-dc8e-4e52-a000-e09dd4084b3e",
          "x-money-object": "true",
          "cookie": "v_udt=OGIzVm1ORlkwRzl2NW5VMXJ5VFN3ZTJjNCtXaS0tTFI1bkQ3VW5xUGdGK1E2Yy0tdUVkQUdoakd5TlNMSUFhWHBHRjVxZz09; anonymous-locale=fr; anon_id=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b; __cf_bm=eI8fIopdxW0eY7L6gjmCXt4nP26u3dKwVnjpqZ1dug0-1741007557-1.0.1.1-lxheyYH_OGL_KUqdQoIJLixyoU2mYM7QedNjzvH.IfCe06q92_sLyqO4FY49moG5GSx1j1xaIvhCL4aC2Tg3.Q_Xejil1yXzagRfWDjYfmwS42OoSUg1yQ6vv_OQBG.o; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxMDA3NTY1LCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDEwMTQ3NjUsInB1cnBvc2UiOiJhY2Nlc3MifQ.JUo4dgPueFCJcttpdfLOoz8rqdclJsSQfN_JS9Jy8kbB_nlcpuPbkEcixbIPvCUoN9dm-K2kuQHLW7C6bO1CBkH4LnM384DbGgZrZoAYotie9O1rFC8v_7z_hV4082-Eo8psa_dZ6SvjSNLYX_49uAsf6kJ7P0fie-I5rz-NGKo87yzPggZO4UZEnkZrtdrteRWHsK4fn01KNjAZz6o1s44S1bSGrkuO7HAFBgccPpOZ6h0RtggvYgvZ6YyJu_665iGTUBKjZUmgUtUMgWj-R7fYmMswO7GnMv2arVGXvru5mPxKI4L5LS8VanJ-tf7RPGcurLA8Ws4IZ36UKT_yTA; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxMDA3NTY1LCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDE2MTIzNjUsInB1cnBvc2UiOiJyZWZyZXNoIn0.rT_twe4XjgDtob5Pl_sbCcSkak1n-DTdI40UqiNpSzk_9HRgEdHCsJwmlrCBsqt4eDLEbBPIBsEuFnDU83Sd5dE0DOdmHOE2xM5rJIprzYM4A06HekInlcVkJFUllXtLTynm935eWnb5KlzP3zdz3AfThINrq1bOG7jgEPvoG8EloeqP1zO4fPRER8EZRX1ecYwDO4JfsitgwqkW2obCB21KKpd-dYtBtnE1hsUMBwu4dM1teGKmgZakCMo8Qp8BYRiGR3B-3VcknFBoy4NNqd_HdrHDUHxW-mV3FpJZnPEcN9brq4qloSoXrROVzHF8DVTcye2SNMmm8nUQdqdxDA; v_sid=57967c99c68a2df08ba03edcc4b1463f; OptanonAlertBoxClosed=2025-03-03T13:12:49.731Z; eupubconsent-v2=CQNsN1gQNsN1gAcABBENBfFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSgAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBLACaAFGAK0AYYAygBogDZAHeAPaAfYB-wEUARgAoIBVwCxAFzALyAYoA2gBuADiAHUAQ6Ai8BIgCZAE7AKHAUfApoCmwFWALFAWwAuABcgC7QF3gLzAX0Aw0BjwDJAGTgMqgZYBlwDOQGqgNYAbeA3UBxYDkwHLgPHAe0A-sCAIELSABMABAAaABzgFiAR6Am0BSYC8gGpgNsAbcA58B5QD4gH7AQPAgwBBsCFZCA4AAsACgALgAqgBcADEAG8APQAjgB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; cf_clearance=Z66JuD5JJAsa5EzM42ahuRzBWSePsQpaBxvrEo2vqhA-1741008900-1.2.1.1-.IXWe7YO0ku5WBZTVdSnSKFpUctlHZddhkqELkW8IIqqpjJEvPys0hM6WZNTo8Pepj1LJWUzreQ1jAlZ.qY9ZrwfZC5tgeuuZul4PmZnYOobNk9JvC.HNcbM5LVak0A2QtAJaF7haYb9GfcGBcP5xfpeT92G0BtoHMth84xn6zNQ4Igbq65Um4HnMCLH5uT6GC4DP74FphEw7mspLLfYAniAu.gPvA5qqOtKnxfTdzObxLo32xyc2AVdqiDD5kdW6GZTZK_S9BHO3eLaK6NJp.8m0oZV3zCj6VyVxY16yyXx9w.xboc8vYqt5eAkJIEE6qSrWzNmm7hNuIxljkBRWF1dH1Ds8FbqUzdKPzOY0M_aKOyjyQVWMm1zvnMD.hQg82CDmwjaheZtgcUfzNMBlQkFp.c9jTiRq_6rL7wsKe0; viewport_size=624; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Mar+03+2025+14%3A35%3A13+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b&interactionCount=7&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&AwaitingReconsent=false&geolocation=FR%3B; datadome=4ZZ5nl6Xqou96OtT9WNjqNElyr_Bu6epxm8Wjghoxls3Eg3GrJzlVX1w6SY9PA~bdzPkFLqHF6b28ZNevuGS0H0xkpi6r28ey7pMjEtUn1UbbX_AulQy~rRwPz5uD1XV; banners_ui_state=SUCCESS; _vinted_fr_session=U3Q1M0daeFUyeVM2a2xaUzY2R2VWRHZibzdPVjdRUi82UWFzeTEwVGpJTHFhR2hBUVZKNkxac0tvRXBBUmxTUlVsbHRvVDhSK0dVbGZBVWd3UXlJc1ZsU1UwcnpBWDdZMU9KcDZoem1kS1Btb1llZVJBRDhiY1RPYTVlQlYxT1RJWjk2T014OWJqeHA5cHFhaXZSdDBaQlVONjBsdmVhSXBKTUw1c1BCaVhTc0JjUVh2WmhKMmtwL1VlTE5FK3ZlNXp1UmQxUnZOU21taWxjNllGU3lDOVlmb0l2SitFN0gybVhJS3RGZ29vYnlUUjFhVEUvalZHWEVaQUFUaWRRUS0tVGtwZU5wWkU1RTNjemNJcHh5dmRVQT09--643c3618ef4a78c68a6df3da8efc00b5f2f4567d",
          "Referer": "https://www.vinted.fr/catalog?search_text=42181&time=1739198768",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });
      

      

    if (response.ok) {
        const body = await response.json();
        const salesVint = parseJSON(body);
        fs.writeFileSync('AllVinted.json', JSON.stringify(salesVint), 'utf-8');
        return salesVint;  // Adjusted to use JSON parsing function
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
      const status = item.status; 

      return {
        link,
        'price': price.amount,
        'title': item.title,
        'published': new Date(published * 1000).toUTCString(),
        'status': status,
        //'uuid': uuidv5(link, uuidv5.URL)
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};


// Exporting the scraping functions
module.exports = {
  scrapeWithCookies
};
