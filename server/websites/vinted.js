//const fetch = require('node-fetch'); It is already included ! (error 403 if you use this line)
const cheerio = require('cheerio');
const { v5: uuidv5 } = require('uuid');
const fs = require('fs');


// Code for scraping with predefined cookies and headers
const scrapeWithCookies = async searchText => {
  try {
    console.log('with cookies');
    const response = await fetch(`https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1739198768&search_text='${searchText}&catalog_ids=&size_ids=&brand_ids=&status_ids=&material_ids=`, {
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
          "cookie": "v_udt=OGIzVm1ORlkwRzl2NW5VMXJ5VFN3ZTJjNCtXaS0tTFI1bkQ3VW5xUGdGK1E2Yy0tdUVkQUdoakd5TlNMSUFhWHBHRjVxZz09; anonymous-locale=fr; anon_id=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b; OptanonAlertBoxClosed=2025-03-03T13:12:49.731Z; eupubconsent-v2=CQNsN1gQNsN1gAcABBENBfFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSgAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBLACaAFGAK0AYYAygBogDZAHeAPaAfYB-wEUARgAoIBVwCxAFzALyAYoA2gBuADiAHUAQ6Ai8BIgCZAE7AKHAUfApoCmwFWALFAWwAuABcgC7QF3gLzAX0Aw0BjwDJAGTgMqgZYBlwDOQGqgNYAbeA3UBxYDkwHLgPHAe0A-sCAIELSABMABAAaABzgFiAR6Am0BSYC8gGpgNsAbcA58B5QD4gH7AQPAgwBBsCFZCA4AAsACgALgAqgBcADEAG8APQAjgB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQyODA5NzQ1LCJzaWQiOiIxNDRmYTQ5ZC0xNzQyODA5NzQ1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDI4MTY5NDUsInB1cnBvc2UiOiJhY2Nlc3MifQ.LqouuDy1OXXkiBjKXB_q8eKhF9nQZRjqFUnLLB1O2crKdwjiDUyn13BXaXjZKh0ZsAgC0aA4HDmZ2NWoIgV8rZf4VPGJ9J-9RGRRu2oYE-8kMSIibmdRGdmXp8ift8hLaodMmb9M3qRojtiWdALwDqxwOz7tbra5BpC-SvczTnW8xueL6Jw2U6ls9dOgpqzKI46qGnzaX2GFlpHXUWNr-ME7B-E8Y6tj8rsAH5If8b7wiM53EeXXl1XLDD5RN5yMRLb9JHbWxUa0oBb9jDH5IglOD_Sky4Qyr1BVir9451Nq-3tTY8Dnk_CyLpbrUID0nQhzRxDlZaQ9XuR5YWGQyQ; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQyODA5NzQ1LCJzaWQiOiIxNDRmYTQ5ZC0xNzQyODA5NzQ1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM0MTQ1NDUsInB1cnBvc2UiOiJyZWZyZXNoIn0.wbEmqvUUJU8Z12C_PbF6Uq1bbvsTJuIX8P9b50j_TyloUfvxKnmkP385Sdpe6V4j8UcfmJX1WXNWng3MNegIxvXvTPO2ORzyKUICpSvDKV9DTjO-SZqgfNEtuQjtSzFdr3EQi5W74VDjz6VxjUDxxqhZN9hALJl_0ZfB5fKd7YkEgOSGb5KjNGw4hOvgOZVzC0BWFAT1VnqsQgvQzjRD_1mmDbevG8NuDiiyrp_-UOYghqre47zs5CgEZEG4FRoepAMAk2szIRfGBPgx7xlfIzq7a0M1gV2X2Lqc523Sr7r6WiyfX8LhLxsoHDJNciAd0KQZjwX_q3UudAUAXbhHfQ; __cf_bm=WJxlP82E2niUpZYl5LjtZx0v2kAgGHq70YZ8wBvCqmQ-1742809746-1.0.1.1-S1DNxHqKOAeUzlWhUJ3fgfI6Ld8WnfMGgK7.VEZ7inTbsUCKFK2Vn5yVY_k44y.nog_JUY.48Z7D8YFemzBnt5SBTZfysWVBNUSxIwPuRDWL0FRHE8s0METzmiPR4DVu; cf_clearance=xlGwUsFYLe9uMDbEw2TkIQsH3YWdF0TUwUB6bQj7fCI-1742809747-1.2.1.1-N5fWFysuiCEN0Otc6HGCfKr.iGzCKP8GBQDLbsT3WGXyFheThz6X2Jmt4KigSjLByrZn.ppjn0OXD5OKUSCPYUkMyqu_lvNNqEQxe9OYAXcjy.i5XHFBtdipaMc4X3PIU.0ark84G5WZqVAY4vu6wE.Qg130MAXIr.g.Kqr6z04FH.MDElhvYaMpLlTgQcpU.PdC_JBpO4V5rBVP.sTeTBu1Qi7bHEv6z31qPw0xS6GLVGXhtNd4lGrYlNISvyXbHhQqDK84U0CiXICjy64bNFnCKip9J3Tc_O3c3U1hHAoZvC0BhIOiAkehlSw74wkMY_zDf4DpsmCht4qfGmlzBRR0oFlWUyVf1y0jiAhqUrc; v_sid=bbdd3eb08ea02d92cc269c4dd805be3e; viewport_size=1156; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Mar+24+2025+10%3A49%3A32+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b&interactionCount=61&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&AwaitingReconsent=false&geolocation=FR%3B; datadome=nfi0iKH2kFqPZle1EGmquQ0zb99b9aJlJ47NImtFQcXM3rOJwlc8Hs3l_JU5S0N4qJFOeZE7uhoHClYyCSIKnF_OKT4eCCzvCDMRIZ7oiyBWv4Iz4g32E4v1N~0xT3FY; banners_ui_state=SUCCESS; _vinted_fr_session=bjdocmhUUVVjemtBd0NLcTlEaVB0TGFHWGRXMjlSZ1puaGg4SHJ6UElUNGRob1B0aW56elk2KzhBWURwcDBMclh1bEJHNHdjYjA1OEFXRGk3ajlwRkdpVUdpVVhVY3dPV3JuSU03aWVsREQ0ZnZKUTRzeFMwR3Z6NEtYS09HcGJ1WlNHdkd6b01GWVhwRGdadzdNczNlQzM5aE5aemRuQzlKa04xZDlxT2Y1b1ZPUXhEZjdSMlpGeUdqZXc3SGdORXgyekkvR1d4MUJPYXRqYnhtZ2I4WXRMS05RRHBSTU5Yak5mdmRTMEhiK2ZwOS9VQ0NuSldvUTR4QitqZFlOWi0tRCtrY3FXZUxOdXUwZUdmSU5aZndHUT09--a830aee92260e98ea2152704dbac5f3e91feba66",
          "Referer": "https://www.vinted.fr/catalog?search_text=${searchText}&time=1739198768",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });
      

      

    if (response.ok) {
        const body = await response.json();
        const salesVint = parseJSON(body, searchText);
        fs.writeFileSync(`vinted-${searchText}.json`, JSON.stringify(salesVint, null, 2), 'utf-8');
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
 * @param {String} IdLego - ID du set Lego
 * @return {Object} sales
 */
const parseJSON = (data, IdLego) => {
  try {
    console.log(data);
    const { items } = data;
    return items.filter(item => item.brand_title === 'LEGO')
    .map(item => {
      const link = item.url;
      const price = item.total_item_price;
      const photo = item;
      //const published = photo.high_resolution && photo.high_resolution.timestamp;
      const status = item.status; 
      const brand = item.brand_title;

      return {
        link,
        'price': price.amount,
        'title': item.title,
        published: formatTimestamp(item.photo?.high_resolution?.timestamp ||Date.now()),
        'status': status,
        'id': IdLego,
        'brand': brand,
        //'uuid': uuidv5(link, uuidv5.URL)
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convertir en millisecondes
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Exporting the scraping functions
module.exports = {
  scrapeWithCookies
};
