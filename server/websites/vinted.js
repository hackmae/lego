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
          "cookie": "v_udt=v_udt=OGIzVm1ORlkwRzl2NW5VMXJ5VFN3ZTJjNCtXaS0tTFI1bkQ3VW5xUGdGK1E2Yy0tdUVkQUdoakd5TlNMSUFhWHBHRjVxZz09; anonymous-locale=fr; anon_id=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b; OptanonAlertBoxClosed=2025-03-03T13:12:49.731Z; eupubconsent-v2=CQNsN1gQNsN1gAcABBENBfFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSgAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBLACaAFGAK0AYYAygBogDZAHeAPaAfYB-wEUARgAoIBVwCxAFzALyAYoA2gBuADiAHUAQ6Ai8BIgCZAE7AKHAUfApoCmwFWALFAWwAuABcgC7QF3gLzAX0Aw0BjwDJAGTgMqgZYBlwDOQGqgNYAbeA3UBxYDkwHLgPHAe0A-sCAIELSABMABAAaABzgFiAR6Am0BSYC8gGpgNsAbcA58B5QD4gH7AQPAgwBBsCFZCA4AAsACgALgAqgBcADEAG8APQAjgB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; v_sid=f206de2a-1741007565; __cf_bm=6pqpXudzY2JLTl1Qaew1u0dAv1Z5v2TSNdFvNsLMa.s-1741692609-1.0.1.1-lsnYx5hjDylUbzYkxd9x3ePxH76hYPgtgY5YOcXnNWw6WJQPK_MNu9ZC92rTLs8WP.csU_ZMVvoW91uz3M3I0em.oPdF.F3cevwF7GgDDHu8M1UvHuqPPNUJARezKTr9; cf_clearance=SNfpMfhVu28LRQpZnYR8mT7xrklINsXR6ogn5y3lKrw-1741692609-1.2.1.1-DRwXPtfFbwcQBynjoZYEG2Xkz22.x3XhqvyMAD3CkoY.dfA1ivOV9KkOSWn7GjkiB37B5qmP9nAKskgogPdhOHHRwK3CxMCnVxgdPb5lHdxDgdhti.J1nr6ZrzWAwSQAOxrimO9ittWKwlplslWSHzWqHtWqRk2o7qbxBlIEy88XJpYinHA0k8pwcIAQYhMDx5K_axVRHtDjroFm7ZBLTewdN77joqypRabwiUJdXusfYKP5edYBS3b09SwDQbg3V3EGPIdbW5zPafOSWL8gs4Pmhv7UINaUmZDDYFbuS9c_sinYg7YsKm6JRfuWp2Ro1wB2.u4JxzeCROliti1iHtvSQAFUf_1MvaHld7_Li_Q; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjkyNjA5LCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDE2OTk4MDksInB1cnBvc2UiOiJhY2Nlc3MifQ.kyK9zHLPQfybdH3yl8XDPV3DWPAHYcqJW4aizXHNRlhHdyk6k2ZWAX4MMepWkU3GuR2-9OEY6MaL8LIlsRhm5MepwWlvOyu9VBoIWaIvllbOEgdbphWeL8Pl3sh7tFA6xJBcKCBu72mK-mOfIhdJVrcTjm9F7QoDSeqmbLplUqItJuAaMG4_yW4mo2lZB8nKASQ1-_OSCVbrt5nuvUq0SyudIQ93WqRfH5bLf9ljgxibxUorznzyvnA7hE__NPeVKE0prljnPiYoKxvGKJ9D-XZ2KP3NMam-Ror4cIwCaR8qY-ws4kRYPaAqfGsxjxqdxGGF9yVnJHHpPSywGzFOBA; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjkyNjA5LCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDIyOTc0MDksInB1cnBvc2UiOiJyZWZyZXNoIn0.PSMDAbhrpkBwe7DTm1YzTZtrTrtWzmwcfwpD8X1yRRAjZN1HbqDd6xnSfXtNXF2qHWnnvkOoo8tucD-ftoi-i1u-Qo-vSZVRrAiDUY4QuDDI19Nafw1fm9QqTaLw06NX1REBo3r18ufdy2lZuBnti2MPNkaurGkp6l2YaSCirfbszldnit9RGPuqgcgY1RPydiubjbFT3GKXUaDOY5-237SkHxM-nqkBOUmjqlDUo0ooV01lKu9rXi_9hCXU-Y3gGtZ0kpYj5zYEEJTI_6eBY6uNo7sMg0k8va0zdiYntJaX3kOec3_I0Em5z2DWAwHO2XlIQiJ0wnliqhAgtZLB7A; viewport_size=834; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Mar+11+2025+12%3A30%3A20+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b&interactionCount=41&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&AwaitingReconsent=false&geolocation=FR%3B; datadome=mw6AsrXE1BGoVhJfHbo8LiqpNz91ll6owoL_jMSMRgdcMqn6CbjyOSKq0Fkifb7E3HqC0WgU1OCQqUoy4ENQFR2oYIX4GZ8Y8nebDkEMHHGriYSCyCqvCR2hNIUzluI6; _vinted_fr_session=OGFqV2V1Qk5MK201bjRvNXl2YXRLaXRzZU1hSzRrcnFxN3k5SDBJRFR2MzhIeDVEeStGbUlocDlsVUZpWmcvaTlGTzIvZndka1F5YzhaU0x1cmxCSS9kQVE2SysxbVdxUWoxY3BON1gvWk9iR2hHZzVHZ1V6YVc3YUROM2thMW1BRkFwMWNOWmxXRVJTU3NncXE3bEVwckJDWFZMaVZGcVJ6ZUVqclFtdkoxbEdrMEtNQUxDRmJNMTVKMzVJR2Uva0R1U2VCeFpSbmJvR3B5SUh3RUVYbjNvZ20xS3NBa2c5WXhrMHlVK2k0V1N6bXZGQk8zN1FvMmRBaURHQVVnRmZkUUh0ZlVLVVEydWU2MXU1bjh3SkZPZGJrdDFhSFpSYkkvV3A5WGlTZHhwaFRiZUNNbXVuMXpSZTZuWEpQVjRlckhLWmNjUGNFR2ZBeiszRUlOYVBDMm02cnp0NVJOWlRoV3NweTJjaDd4eUZZL2I1VU5vclN3YkM1R0l6L3FyZGxkUUZCUitSamV0UW00RUhLNGhRVVU0eFBHNTdiWk85VkZsazNUOWxZSlhweUhzMWFKbU5Md1h0dUhLdlp2N3grUVEybkFnYXRRdFpVV3I2NnNCYjBUMkRmb29uNGpCRGZpVVlyQ1hoNTZpUnBJRVhLcStHVmwreTB6OGxnSU56UHJlOEFUNmFkdGEyblpSOXYyMWVsc2U4L2pPZmJZNGY5clE2Mjh3TElqZ1l3aURoVjJDRFZwakpGQkp2cE1TRkV2UnJFYnI3OVpDMytadjM1Ly9GWnZFZU95N3RTVitCSmtVQ3ZDb0JKTjFvRjl3TEVzbzBnc0N1WTFhaUxyY0ZBTEFEZUZQamYyS1dIeXNoMGZKT0plNVQrZU1NNmkweElQczVoK01HeVA2TnNJK012QVZkNlU3UjE3Q3FxelIyN2FGdGFnVDJRSmtpbWtMWWY0ZHgrL1k2UlNnZDRYSnNlNC9tbUdkS2ppWURaOW1pYk9BVFZHamhIYmVpNEQyeHpkZUk2d054QmpQWmYyTHNGWitXTnJqV084TW1wVjluOEZFNGpyblhSWTMzYy9xKzFFUUNBOStqZE8xS3FVd2J1bWhxKzlWN0VqVUxleUpOaWVCMEpSWktMUmgrUEUzQjVaWmVaMXQwWXVaRTNNTzNiUkV2czRKTnVjTTBtSUlxVGF4Q3B1ZnpoN1pNTUpzY0U2QlM2QVZ4ZHFPV3Rta0lrQ3FnSjIySDFpV2IxTS8vSS9icTJQNnIvc0VsUjNvUmhzK3dUMHlIL1lhVVpzWUFGVWI3b292cmc4SzVpNW9lZEdtT2JwK2hyNzF6ZXZDQmhyWmxCYUFPSXZWMHlBbllIUFB3UUpWVEJkbmJyanBGTHBzSTllQU1ORHhkRnZKZW9qcngrcWJTWjBBNzk4NWI1SFZWdDhLUVdsMlJrVUdyTWg1SWNNZXdmaS9pS0kwaDlFS2hXU0dBSkpaU2JqQ0RnQ1hFTU1aUU43Y3hZM2MrZ3lCSjJhM2ljSGQwaDA4ZHBjTG9XcGZXc2I0ODJraE52UVFjR01NTVlaZ0FFTjI5czRYZFVjd3RtOXhDM3l3aDg2dmFYZUo5cmh4UVRreXBhQ3U5aHhDS2NCS3U3Q1ArNnY4NVg3aVBobVZMYVl1YzJkd25mMTZldStLTnJnb3hJem9BdDFlbzVUdng4anR4VjlJRms5WU1LK2F2OHZPTGQvSUlmOVpCSURXMGwxMDVCTHpCVDJTUldzc1V1b2prR2x0TllQeGhESC8yNlEydUtmMHpzRWU5RGlxZG9aSUdEV1I0VENKaXdFaFkzOUZud3ZnMXM4TU1QakFBeEZ2R3JDc3RwbEhKK2NBUjh6aDZIa0JpWVVtcnBRSk05eFRwU3h2S3NDMWw2NFozK0U3YjFQZnlibVpOZEo1UldvQzdOY1FsRUpDeXBYcFZpMVI2cko3dmpiWlJYc3dLSy82Vzg5SXRTRHVUNXZjMUxCVmVBenowYWtQSGZ5V1NBSHE1aElaQ1lTelpkdk1DNmNEQ2UrTlJKSmtBN1dRVHhuZnJmZ2dlWTYwMk4wMGZRemtla0NZa3NZQTMrSkk0MTgwVnZBOWZjWGZ4bEl0NE9BOTlCdEQ2RDRYWVVoTG8zcE83MmZETkZYKzZHeERJRHVVMGdKSGV5NEJ2VytSY1F0UWo2ajdCNTU5ZW56VmZUR2gxcnN5ZTBXbS9KK2FqeHpVQlNseG9IY0IxdDRUNzFxMENnM25MSXlCRHBQSDlCUmJQQVUrNnN2ckJoN3NQS0NseWpYNGovLzVZY0VKMVNWYXRCVEROdTQxQVdUMDZnQ3YyZjhUR2QzUWpCZXBVQmt0TEthclU0ME9TYTZFa1B1Ti0tUTlCMllTSjdMZDU2R2dMQWZFaUxZdz09--0fba61a49f0a49c2b5008cb3ab1ed7215ced3e3f; banners_ui_state=PENDING",
          "Referer": "https://www.vinted.fr/catalog?search_text=${searchText}&time=1739198768",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });
      

      

    if (response.ok) {
        const body = await response.json();
        const salesVint = parseJSON(body);
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
      //const published = photo.high_resolution && photo.high_resolution.timestamp;
      const status = item.status; 

      return {
        link,
        'price': price.amount,
        'title': item.title,
        published: formatTimestamp(item.photo?.high_resolution?.timestamp ||Date.now()),
        'status': status,
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
