//const fetch = require('node-fetch'); It is already included ! (error 403 if you use this line)
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
          "cookie": "v_udt=OGIzVm1ORlkwRzl2NW5VMXJ5VFN3ZTJjNCtXaS0tTFI1bkQ3VW5xUGdGK1E2Yy0tdUVkQUdoakd5TlNMSUFhWHBHRjVxZz09; anonymous-locale=fr; anon_id=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b; OptanonAlertBoxClosed=2025-03-03T13:12:49.731Z; eupubconsent-v2=CQNsN1gQNsN1gAcABBENBfFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSgAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBLACaAFGAK0AYYAygBogDZAHeAPaAfYB-wEUARgAoIBVwCxAFzALyAYoA2gBuADiAHUAQ6Ai8BIgCZAE7AKHAUfApoCmwFWALFAWwAuABcgC7QF3gLzAX0Aw0BjwDJAGTgMqgZYBlwDOQGqgNYAbeA3UBxYDkwHLgPHAe0A-sCAIELSABMABAAaABzgFiAR6Am0BSYC8gGpgNsAbcA58B5QD4gH7AQPAgwBBsCFZCA4AAsACgALgAqgBcADEAG8APQAjgB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; v_sid=f206de2a-1741007565; domain_selected=true; v_sid=f206de2a-1741007565; __cf_bm=JeIBp_ZUaC0O.SnSMyrTQ5y0g.T2QLvercCO4P_bYPA-1741082067-1.0.1.1-nR317eEy1UUfrawyBwj57xwfi6j4w9D9rV6B_2NBIg4XB_65rr6f.v9Vbx9C7ZexhoPRz1DZgd3r2KnDCHmSAzzP4OhGsG5onjXTLMyjJUxwJ9eEtB6sAutCVfQizjNZ; cf_clearance=ZElIyA2AQrbdq5GXeibftHyXfS8.IkkacefMsdTc3u0-1741082068-1.2.1.1-pMS.ijOft3PqTjoSVk5SdGJzYU7idSbl0vMtxgmBMGcezOjHbEa_TETYADB7Is6bi3tZQYsNQKvAWqG.P14pD_CGcenF._Ofw5u1K4O5snloaxqXHqRaeaQAyWW43R2aOfsmYKdz8QsgWKFzWgjse5nebYftq5ciPzInKa.bTSESqmYzSSH.G1ZGFXoGirI9g9D59WZBYqXNl6..I8vU2XSGccBVw91cxmBR70rH6Xe2z.StTdQM89cG.pyYBKNdhDATXooP_hyUYNgLTRF1oaN42FNfC3WVbKGR_M_.BgFjzq2FaYmULddlQRLoGMfH9lZS75Vx4ur_1O2TieHaVpFIawhxNGQaFc.qb4_r8Obdse20HvJJw3KCoCRXf3UaqrY8oC6wlY7pDjZFzxv3KWzhNPX4xeBiRTcGusUhL8A; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxMDgyMDY4LCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDEwODkyNjgsInB1cnBvc2UiOiJhY2Nlc3MifQ.AJDRuAPrLS-BEV50Uv_iIIdgM4hQmz0VmZLZtlOIEneBj9JbjnTGXQiwc5kypwW0Za3Z4KkuH03DDYpTqPfAtOX5KiX6WFNWiqn76FSCvBTIf9Pq5ow_7hAz6CgNPK6vERwFSqsD6Vr3XGuVySaTmsMMQAXUyqEUr7ONqNpkhfjCIi5iwY02I9beGdWhnLlSN5KYeBem7WZz8Gy-h1Q-nKTSVtV1ChqdUyUcjMgnWyow3vRcD9zrwqtqL1TU0rRphyNJCB1VYy8eE_3lHhlOg0jZMWlpl4azKsnlqstqlg3PrU4c-nJKx3F9DPzkvdtc9U18ucnqq7s4MuMvhH0Cqw; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxMDgyMDY4LCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDE2ODY4NjgsInB1cnBvc2UiOiJyZWZyZXNoIn0.CoX-1GFHeyrINy2SvATLG_kVMKaZs1NZLc7HNokYw9v0qgkC9SVso_PTiK1sEPmjqjFW_47sHQrXSDRyjZ6izU0Ej7sQM1xV3EwoX7dhys6hskBBLo5kwGa4JVFNMNPcEQmSQ6Hcd7iLdc_hv4ZRacHgMiDoHfw-ZdNNz_m2WJ9tiRjkUNlXSdkORXKYMokWV8TMDvDBsyVaf9aFT73jMagO7ek3ae2KgGrZs5stgcIy_ysLVjYi7cKVxhvU0S798LgHlwbYE6OpPrcfbgqxzsSudxOrT9e7U6dwivCsu-JK7elCPgGVop9G3SxnCFN6AH11I9kPQPevCO30A5ssvw; viewport_size=566; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Mar+04+2025+10%3A54%3A49+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b&interactionCount=13&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&AwaitingReconsent=false&geolocation=FR%3B; datadome=1a5uu41LcJqiyLW6_8J9oinA7WEUocB3JI6uv6WtWZPyomBGK52nv~G0dVZmOpC_VkscYfDnzji36UVfa8NhLVn8443~KDZS3fUxiDSczATwj~t0qva7fI6L2TestDGi; banners_ui_state=SUCCESS; _vinted_fr_session=VVFBeGdLWHRhZGF6dXdZdStSWXl3SXRQTHpqRUh6cFdnT2h5b0EvK2JQTGJSbHl6b0F1eWFDLzVvbnNDcGRQQ20xZE4vNlR3UjJpRVpKTFY0emMwN1E1cjR4a252Q2R1Q2xQRGFJbGRBM1MvOVdUV3MrdFVqTkRmM29DWlFyVFY0c3JyYmNsZlUvZ1BMVkZEU2ZRZ0ZvYmtidUlkREptVjdWL2l1VW41dW5tR3lRazEzRm1VSFM5Q0hZbERSSWFYOTlERGxMMU90OFZpbWlaYjBvbGQ5S0NPb1dhVUUyanZPMjA1QnF1QTlQUWJhdkdvL3d2OGtkWVNFY25iMk1tYjhhWkhsbWxMMFdOcTVRWXA1OU94d1ZIOW1XaVRUY2FrNFU5T3NuNk1XeVFBeE9xUUpFVDZEWGNyQlcvRkpQcDlwVzNWZXZXaHB3dXFjQ0dBby93b2JUTVg5aDB2WkdhWWJGbkJvU1o0OWNVd2M4dVN4ZUVIVVZMYUN6V1pyc1F3N2o3aFE3RlhoREJQTWpzelFQbFUwNUJaMnVHSE5hVGh6YWxkeXEvNU5mdDVaUmdXWUNucFBmUnM5S2N5VU5QYW5SdHY0ZS85ZU1iby82THhYOFY0V1JlTmljY0JJVFEza0pjSEl2Yjg2SEpDUVh6c0F0SnliMThQbE1ycWxQT2ROSjE3a3ExdDhrUHNGOEswaDhQdkhwbFJ4UXFqcmJjVlgyalljaFJZenoyMytacXpXUlNqelEzbXBnTzlSMll6aGdaQks5T0RscjNuSWMyL1RhejN6THZRemdYS2FsRmxndEVPMXBxYkhUdFVIdHFvb1Axb3UvTFZOb2Q1ckZSb25Zb0p1YWtGcVdBSzQ0MHE1elFxMEZDZU5ueTlSK1RaSXprVmZIT2Y3VEZ3U2hRbndWSk1HZXZVU0xBR1pOc1U3V3hidGJxbVRJcFdORlZ2bUVHT1FRdmwyZjVOcG9SckNnaUhRamF3U0VjTWhGUXlEK1J4bDYvR0xGT3F5YStZTWVIeXRYWWc2c2t4NUFJdHQzd2E0eXBjRkt6VTF5TmRtVTNpVFBDY2FDWFUwM3FLUWlMb2RsdkZNb1lHeEljM2k0cGJ5dFVpTnFCSEVqK25saU10enVwL0MvdU1nMFY3SnlIRmluWEJyazBLQjNNaGVNYXNMSjNBQTZSanNuUlgrdUJ4Nm5HVGtlams3K2RqNkI3MmxNeGdZOVpEWmZmRGpZWStJQ1RjdlNqU0R3V0VQY0l6bWc4NGxKcVEvZ0R5ZVltbFd4cGdMYW9YZ2Z2M3JMbDdyVUNiZ0hWZlNtZ0phQUd6VjFJTmRxTFlyeW5EdGNGbXdYaHZKdHpKb1pLU29JQlFld1R1OEh2RFRYNk5zejFuQ3VId1Q0YUpFUGxoWlU2V3Z4bzFxRVJHVGFXai9PbC9hUThXS2RKMHpEWnVUTEthYmVZdFVSdVRVY3ZUNWRQRFRwZ1plc2YzejJ0YURRNG9GUExQWDNLSElaRGRhNlJsZkZrSUl4Q1IrSDV6UDlyR2crWGI0aUNQekMxektRb1dBajlvWkxlalgyTnNjbjZ1cjJLQndYZ1NVNWVCaGVOVjd4eEp1UXFnNE01bTRJb3orN2dhcDRFQzh4NVlwcGk1NFFnc3Z5cjBvMFNtS241K1cxQTAvRG9OMVdVTWgvdC9WZWhDM1NxTXpBT09QTHNYY2M0N1U5ckM3aWZOT0NYZ1c0WWl5ejNoYzZ2alV6SGNiWjF4YWVXOFExcmxFdmpFdVBzUFFWQ3VzZFNrS0pkT01rb01BK3VJdGphY1lzMTdhQVloR0lhMHNXQ0dPQ1BHdEpwUHhhQkxpVzdvQ1lGd3paWUowMjh2azB3OE1mMC90UC9ndXcyMHJSUHJwcTJPMWJFYkZsVm1TMnFUUVp0NEQ2di96VXczTWQvQUJxcFVzLzJuc2FDQ2I0NUp1Y2loWmtCUjQxNVh5dGZVb2YyOTNVby9ucndOTnAzSkRYWnFGaVh2RzVOaTdrOGZyUjJQNlhrVTV4Qzd5TDArMjd6L1I0cE1xYVQ4VTVTYlB3eXQ4RDZ1cVlSWWZ1TkdSM3FZRWxuWDhtY1pZN0VaZnhvbTdydlNkV1BPWjV4QUdpRStGamliaThFdmNQMFd5bDdsWGFXcVpaODJqU2xubVNWMlhjU2M2Zld6Nlcwc0syLzlYMDdNdmJiMmt2bjRzUEpOQmFoZnVHR3JsNlpweWw0OHlPaENTbWFzcDFDNVdibE9Ub0Rxbm00TE1WRlJrazREOVo4YUI0bWJ6NU5BY05LQTdiZWIwalIxa0dyQVFKVnpBcSt2U1QyaTJkd0FQTjBQYktuWm9oQT0tLWZhNkd5U2VPSWlJVmdKbjRhL0hXRHc9PQ%3D%3D--cbf545c6e0e3e17fd3cc619b92855b744ab82247",
          "Referer": "https://www.vinted.fr/catalog?search_text=42181&time=1739198768",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });
      

      

    if (response.ok) {
        const body = await response.json();
        const salesVint = parseJSON(body);
        fs.writeFileSync('AllVinted.json', JSON.stringify(salesVint, null, 2), 'utf-8');
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
        'published': new Date(published * 1000),
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
