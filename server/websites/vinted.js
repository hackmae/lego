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
          "cookie": "v_udt=dnIxalJiMi8rNEhRSE9NWHUwRzZNdG4vZTBaKy0tS3hTSG5uYmx1SFR5amw2Ry0tRy9JUEtoQXVBak91d0c3QjE0Z1AxUT09; anonymous-locale=fr; anon_id=8c861941-8774-4eb8-b55b-c377e82e3d46; ab.optOut=This-cookie-will-expire-in-2026; OptanonAlertBoxClosed=2025-01-06T14:51:22.504Z; eupubconsent-v2=CQKzpVgQKzpVgAcABBENBXFgAAAAAAAAAChQAAAAAAFBIIQACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcEA5MBy4DxwHtAQhAheEAOgAOABIAOcAg4BPwEegJFASsAm0BT4CwgF5AMQAYtAyEDIwGjANTAbQA24BugDygHyAP3AgIBAyCCIIJgQYAhWBC4cAwAARAA4ADwALgAkAB-AGgAc4A7gCAQEHAQgAn4BUAC9AHSAQgAj0BIoCVgExAJlATaApABSYCuwFqALoAYgAxYBkIDJgGjANNAamA14BtADbAG3AOPgc6Bz4DygHxAPtgfsB-4EDwIIgQYAg2BCsdBLAAXABQAFQAOAAgABdADIANQAeABEACYAFWALgAugBiADeAHoAP0AhgCJAEsAJoAUYArQBhgDKAGiANkAd4A9oB9gH6AP-AigCMAFBAKuAWIAuYBeQDFAG0ANwAcQA6gCHQEXgJEATIAnYBQ4Cj4FNAU2AqwBYoC2AFwALkAXaAu8BeYC-gGGgMeAZIAycBlUDLAMuAZyA1UBrADbwG6gOLAcmA5cB44D2gH1gQBAhaQAJgAIADQAOcAsQCPQE2gKTAXkA1MBtgDbgHPgPKAfEA_YCB4EGAINgQrIQHQAFgAUABcAFUALgAYgA3gB6AEcAO8Af4BFACUgFBAKuAXMAxQBtADqQKaApsBYoC0QFwALkAZOAzkBqoDxwIWkoEQACAAFgAUAA4ADwAIgATAAqgBcADFAIYAiQBHACjAFaANkAd4A_ACrgGKAOoAh0BF4CRAFHgLFAWwAvMBk4DLAGcgNYAbeA9oCB5IAeABcAdwBAACoAI9ASKAlYBNoCkwGLANyAeUA_cCCIEGCkDgABcAFAAVAA4ACCAGQAaAA8ACIAEwAKQAVQAxAB-gEMARIAowBWgDKAGiANkAd8A-wD9AIsARgAoIBVwC5gF5AMUAbQA3ACHQEXgJEATsAocBTYCxQFsALgAXIAu0BeYC-gGGgMkAZPAywDLgGcwNYA1kBt4DdQHBAOTAeOA9oCEIELSgCEAC4AJABHADnAHcAQAAkQBYgDXgHbAP-Aj0BIoCYgE2gKQAU-ArsBdAC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhW.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; v_sid=8395684249d75015bc6e46545e359fa2; datadome=Kf1zpXLS1YEWhlCfa2i9SOge9yN9qSWvn00ACKo0WdhSeNxQlyShBSR_24C3StY2~lzwuTaPq1I~bxvV4qcKvqqcIZUOdzqYsC5K9vVnKqgVVHIqiwNmXb_0e6IgoYVS; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaWF0IjoxNzM5MjAxOTA1LCJzaWQiOiIwMjQ2MTllNS0xNzM5MTkzOTY5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3MzkyMDkxMDUsInB1cnBvc2UiOiJhY2Nlc3MifQ.Dmw783abH2Uy7SM-GGWs4aFnSOlTjFtzbuPy-js4-RwkBdX4drskckE_124hnlmzcBTQzCWdwkxzTFb697RWONipBfp_6o-sjouCkcfqjWvGYSfOnZDyVDVLrzZlRudQ42VrXExa2zuXpZ7iKnlFaGrGs0RUeXzcGDDczwCHEMNPHnjEQj5tG7QHVEjEszv2RawhXG3nN-TxM7OOOm56Y1fBVaAIrmTyNjqxVFXExyvCbmrr9arP4ee15Pq8BqeRt02ugv7TZzIwxlhCxzCOUwT9igRF00xgNky4gapvSun8a0MKwV5bcSDrAFBf4k0AQBdnjhG9kY7dtsJ3djBR6w; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaWF0IjoxNzM5MjAxOTA1LCJzaWQiOiIwMjQ2MTllNS0xNzM5MTkzOTY5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3Mzk4MDY3MDUsInB1cnBvc2UiOiJyZWZyZXNoIn0.Y3FrMZqHcbXGKg77hByOPxuDW9WjeyMv4mOK2QWA9SIoDZv7W4LxRc6lUUYPvPgYzn5EVTNPxzQWJPSXseF-_EsTaMl_OOzLMB4nXEu8JsOtd_1oA5jWFCGrJeEBP8XCWlJZ2bJ4LjW1dpAlXE9GxaOVWzZbjGYObTWQ-t8WX4EXp1OyCi_sY3t2qaHPcBT9cs8U_MgiuJW3ekYtRkXdC1SRJq0RHcJRWm6xmh7aE4aft9_91fHX4ssjHtcDBJDwt13tJdt3EFYGdmVjOc_h-AVK6OAGLhJmz15QVJDyqt0YL_TQseVywwU4mlxWleolBAV58TCDHkq8I6VpacAd3A; __cf_bm=jfhsNuCHr.Tgu9X0bKuPyVSq0Zktixk4OHo85zzmXZo-1739201906-1.0.1.1-xpoBipav7LFMV2uYxNwk66nToPQ0TEZqXD4xnj8ItCWchmNl.NGBqlImdkag33R50F4XUd6BQb.uU1dIBH41Cm.VyD9q.6CH12X_0cdItLM; cf_clearance=_Y7BsaHrYxIh3VlT0nL_Mw.tO_Q3hmwI_c0TRPqhPGs-1739201907-1.2.1.1-iH3jfR9morWxU4bCeNBkeORwtp647SaSw8ZG4ZQSwJOk2hNBZb3gISad6NH556aRKIxtE9evX5sa6TXTErxJ.LQ9xyK.BdWuohweEMmKWbDbBfpFwZoazWVJpWaxzh7SDMwhKlunGxjoxe6TuG3fBkiu65Bl4OAuOFRT5amHSHsg3qNkTrlPhUhMDFDW0GMPIWU7bUwjrt1LabcqA85P.3frepRyahpE2TII0uMa9OGLiENjcYxwtWDIiEAO3oz5F9hWJfByLoiNNzjzVjQ7P2NNuqFNwMbUPoPP5NtO5XA; viewport_size=468; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Feb+10+2025+16%3A38%3A27+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=8c861941-8774-4eb8-b55b-c377e82e3d46&interactionCount=31&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3BIDF&AwaitingReconsent=false; _vinted_fr_session=YlBHTUpNZCs2cWhJcTgzL0IzZG1INVBOOUV1dUtlVEw5am1aZlRMSDUrTXBHTDg2cnVHUmxDMGIyRTBqbHJCemJ4cVArMnNOam9mQlp5Z2NGRFEreStUYi9YWFhiUk9MMFBCdjBYY2pFeGJtNkR1RzYrV1lLbE4rVVZ5bU9odUFJSnF3c2lMVElVS0hoeTNFQ1FoQ21yeHdnd2NTYlhVM1lpZGwyS0c5aDZNVFZCaWEzN3R4MWYzTGExS3VnYWsxaFpkUlZXVUUraUdsN3FCTit6SExmSWZwcnNBTG5lcnhiNGZpVnQ4V2hnb25NVkYramQyOThacnV4bGxzTnZMUi0tTWM5TmJRMENCckljN3FoL3ppQm1GQT09--5509016b5701db5e847010634177d207b10abee6; banners_ui_state=PENDING",
          "Referer": "https://www.vinted.fr/catalog?search_text=42181&time=1739198768",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });

    if (response.ok) {
        const body = await response.json();
        const salesVint = parseJSON(body);
        //fs.writeFileSync('AllVinted.json', salesVint, 'utf-8');
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
