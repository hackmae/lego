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
          "cookie": "v_udt=OGIzVm1ORlkwRzl2NW5VMXJ5VFN3ZTJjNCtXaS0tTFI1bkQ3VW5xUGdGK1E2Yy0tdUVkQUdoakd5TlNMSUFhWHBHRjVxZz09; anonymous-locale=fr; anon_id=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b; OptanonAlertBoxClosed=2025-03-03T13:12:49.731Z; eupubconsent-v2=CQNsN1gQNsN1gAcABBENBfFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSgAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBLACaAFGAK0AYYAygBogDZAHeAPaAfYB-wEUARgAoIBVwCxAFzALyAYoA2gBuADiAHUAQ6Ai8BIgCZAE7AKHAUfApoCmwFWALFAWwAuABcgC7QF3gLzAX0Aw0BjwDJAGTgMqgZYBlwDOQGqgNYAbeA3UBxYDkwHLgPHAe0A-sCAIELSABMABAAaABzgFiAR6Am0BSYC8gGpgNsAbcA58B5QD4gH7AQPAgwBBsCFZCA4AAsACgALgAqgBcADEAG8APQAjgB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; __cf_bm=11dF0mw4cxtKo1gAZP72IQ77sqbV8vFGFm11bIUOwG8-1741016383-1.0.1.1-Rb6RlclifBHymuqL86P2weHZLGFuApbQaxwGs1I7utdXriZGLITWjnA7HZdwbgIBtA7IBRwBMY7z3cNXhy72xzCwfW4sBE34vB8bW65Q6ZZOldzftNqKgwEl9B0uPkhx; cf_clearance=eQ1qzVadC76Qs8IAtG5uolLUYv7CtSi71aUyU82y.oQ-1741016383-1.2.1.1-HTZnfkyqwyQrcVffCYZ0tNYFn_x2N_WmRS1C_.27v439.DRdiAY38.R3z8wtnPzHo1EFsA9CFHS65jSnXRhAn5DKCWFnRnkFV5C0umUNyZjAzE2tNC75BYkdAy9HB9kZC4fa4bPbE_f01c7mVRY8SFDjm5WFnC30NlUyJmImA8It1DsTPIfYUR4VVh9Fl3muKhh9yg9s7mjNOFNajqKFtiGGCGJQPKP7OuX8x9tCAS2Xah43LPigus4u9rmonYb77GwkxAv4jouRaXSc3Sk2YJvvFwLWQ2CCfXdgQKT03ihxUc9f6msOSa0PNMVa5.Wa6tRQb.KYOItn.8SxJOEkSeyo9vJ9b5RJb0eh2byl2kXpe1ApXVYNgWVPLpiuFFHOZBNSn7p8CFVy7qvtmow_CpkRIhYda5J9iniAoCPPChg; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxMDE2Mzg0LCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDEwMjM1ODMsInB1cnBvc2UiOiJhY2Nlc3MifQ.HdGX_BLs1JtFRoRYL-s7JPcHCZlkR49tb9opYG0KSs4PspJurN82OfHiERlpTxDOKeaCSt_3Zh7MU9QFX9nfb7Bd3TVNF3igOOYD8ZCQznL2laToVjnIlxy8m-KMLvkLW6Vfjmro0EVSRvfD-6PAWY02mfh3dh6oErz8rlk1jvL2d0ud6ykZAO38uwNOVC8DLJ1DJLYc6x7pq9WTVflNZsX_OV0gojnn-uwIiSf51JtVpHFCMEON6JXcPCPEsIvGn3wnidHBgRV-OGmSlHCr9ywrFZubqioOoMyOhQar58wT0v-Zbl98QrLKtCfyShI4H7UGqtAzziJNqBk9sGUKCQ; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxMDE2Mzg0LCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDE2MjExODQsInB1cnBvc2UiOiJyZWZyZXNoIn0.SChpdlZ_HldBEu_Iowfur7u--9-4M2rSD7G7NYX6vuo2_bIrfIGoB7i3Tycy_XJZwPgor0Es_Az7JAi01SXTb6ff4funMZxCztvCeyFbLJ7K1vg8gFe9pCUCc8L7OO2t52UC4vJpP48vxpl3tUbr8KWALyJZjmsWwciothboWg7e59l-MMfkaAu7_lY2I8_4Aoj830q1K1JNBsBqWT7Z2-59OGuv6BHuFx03raPjSmfCFNpPfSScb-vuP638dfzu7JSyQd4jAupqt2kQ29zJJjo9VJfXw0h6AMIQkYaxISOS2LGI9niCg_msylZ1P0OC1s32lP3pOyXfvX89dGmUjQ; v_sid=f206de2a-1741007565; domain_selected=true; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Mar+03+2025+16%3A39%3A45+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b&interactionCount=10&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&AwaitingReconsent=false&geolocation=FR%3B; v_sid=f206de2a-1741007565; viewport_size=712; datadome=eoS7NXz~yFaMt7g~HkSqc8hSV6jxgLGKXMgwROYtkJO2urDWr7O3XYbLqbsGeB_pQDUXjlcZeG3XXuj75hrEgBMKrNcBRbGgu2J5RoX83e2v0AnkrpXB8tFcXBvTpyB2; banners_ui_state=SUCCESS; _vinted_fr_session=akFFbCttYjh5V3grdGJuTm1ZREJaeXVKUlo3N1pxQW95cUpiZ2VvczZablZTeEIvaFM3b1ZtVTd2NHo3S0ZrOWoveXpncTVmQ0hZVlZDT3hiVzh0a1JjQit3VzdaMStuTDloeVdzVy9CRDBPemxSWHZWbTF0enJPZUJaZE5TWVdQMGNkcFdOUmpjLzZKejNXSEpwa2EzNHlmL2RjcXpJUVBYdDRHYzJPZE5VSE5PV0dzVHN2MDN2Q1dVWXlFWDVSajk5ZHpiSDFOSzUyZVJ4S3NVUzlQdDRYOS82ZXFxdStJNFFzOTRBWHFYOHBVR0NMTldKNm9hS1QyVXhCTC9hbjNMR3NEcE1HaUtvZlYyVlVhbHZSbTJWc3k4SFpjSS85bVc1Wkg3cjdNSDhkVDQ5SEx5QldYNmdqT3FLRTRIdlBDMjliRE5ITUluK3NjdUx1MHB6a0xYekYxc2ZvakYzV1pybUtBQUwvMFhYUHFneWxtZnJKV1ZIR3BxUWNOMHllRmJxdWJNbWhra3dMcXNHTVo5Q0hIK2tRUnRTSHArNDU3MGszTGNOb2hnbkRRRThOc2pVc1pQOVEyeHYxcCtyY0lYM2dhMWluaXR1dWNZLzhsYkduNEdTcFRNVGhvdWtKNVhSZ1ltdmRRQk03eTNEbzZvaEVrbE1OVC9ZMHFDRlBPRC9rL0ZuY29GRXRGSVdhT0IxL3FJbW1ndXo5ekZuR2hWMzZwRFhKdEdhdzh3MWJ3dEFZcG5LSTBjVFBtUUd1cG95Q1ZHalIwRW9JdlNMSGMrZU5tdWRZY1IzcjVUcktsYlNKOVdKMk1ZY0toTFBZR1ZlTHpWYk9BeFdDK1dTNHBtUzFtVGJSK3duT1IzNjJTbXNxOUljSWJRNlcvMHdCeXg1Z0tNeklmSGwrU1RncnJpbWRGV2VyV0RsRnNnaVhlWDlUYmxmZWQ2RGlEb21FVXFXakZpamlDU1l2Y0VURWR2TjZKbUlnWnk2RzVaR1N0RVk0UVRUcWg2bjFtc2RWNGNHcVA3aUhNSFUwSDN4NWJkbkpTZDY5SnRhZ1hsRWtvVHl4a0lkaVhFVmpmNlNhMUwyWXNkR2d0YzNKVWZmcnFGNDNVMjh5bVdWTzJKbFM0QjlEUUt4MFd4cUZqRXhtZjBZK1BVakNYYlZRMlgxc1NhOUlCajhiQ3RpQ29OM2xVcFVXYUZSL1VxTThkblhkQ3hxWjJ6VHdYeDNxbzVKVG5WcUpkekdmNmRQeHNtQ3Q1dS9vZ3V0QklsNzUzWW9NdTRVUmJvejVUS0l6dzRTRDNVdnpxMmdiV1FYMUVSb3hjK2lIT2RqSHVhSVp1REpoYW82UjJPeVFqQ3FRZ2djV3NiUEdHNGNXQ0cvWU1lNmM3aFF4bk42M3dHZjg0VyttczRtSEgyWUVrMjd5ejZnVVF3S2lscndaTTRYcUE4MWVRU3VJTGFjVTRsVVVMS1lka2FvcE5MSVd0TmVnZ2lJaGdCNjE3TVc3ZFpvVmZEd0RyN3pVZEd2TWtsdkFHdlF6RlByL1FCSWpXYzZicit4SWlKaG1XNnlJQW5xU201Nk5GaUpueUtVUitDTUlFekZxUS9CZUtPWlJXRjFGZ29zaHM5cFRydzMrZ0Q0UUhvRkJXc3FYQmJCUktjUitOTU1tVEVCR040NjU0UzdtT2hmanRyeWJSaHJyZys0U1RxU3p3WlRWeUpBS2lKdUh3VUtIMjhMKzBqQUxma05KbGdJdUtnUXhESTY3VnAxTjgyYUx4RjVjODE2SDQ0WTh6cWtPUjN6Mm9xQmtuSzBxTUdpK1dLZjFtQ0dCaUtra004SUZZM01xRnNuUTM1dVI5cDRvWGIxS3pWUlNrNEdYNDAveGZIeXNIUUQvNy9naXUrdUYxeC9hN1hrQ3JGN2lqR0EyUTMyYzMxZ2pzQkl4V3ExN3pEKzV2RjBzY3lFSHlPMUxwM2grZzg5cGk5ajI4azk0cC93eXdld0JxVVpzR2NUWGFDQy9POU5JL3pxMmtHb0pLaGhvcXljYnRHcjE1YnFzUlRyMU5UaHNReDJTNW9UZ2hra1JaLzdnYVRlMDFlcFFuQTA0dCt5eDF6bFNkN2JiekRnUis3K3FKSkc1WGVLTEV6clpORXBlcksrTTRPSUVHZjBja2M1QXpFSGJ1VUIrM01mM0tEWEpYTU1sTFBWaVNZMVZJUmRSd1Q5NlVSejhyaDkrMHJmYXIrc2M4S251bTkwb2JmUVE1cTY3OTRYRDQ3cWZoc1YyRzJMUmZTcUhVWHlLKzl5RFBSU1AzTUtud3A5Zk9MTDgrNUdhWlZNOUNBN21xYWM0Q3ZJSUEzcytBb2hFeE5TMkkxL1ZlWnRHcTltc3IzL1RzL3FTY1l1ci0tM0VhWVBDaGRPejJyeVVZT0JSUVlJdz09--b180593ac664e52139496484abab4cd8d78ca360",
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
