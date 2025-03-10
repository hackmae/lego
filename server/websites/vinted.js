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
          "cookie": "v_udt=OGIzVm1ORlkwRzl2NW5VMXJ5VFN3ZTJjNCtXaS0tTFI1bkQ3VW5xUGdGK1E2Yy0tdUVkQUdoakd5TlNMSUFhWHBHRjVxZz09; anonymous-locale=fr; anon_id=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b; OptanonAlertBoxClosed=2025-03-03T13:12:49.731Z; eupubconsent-v2=CQNsN1gQNsN1gAcABBENBfFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSgAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBLACaAFGAK0AYYAygBogDZAHeAPaAfYB-wEUARgAoIBVwCxAFzALyAYoA2gBuADiAHUAQ6Ai8BIgCZAE7AKHAUfApoCmwFWALFAWwAuABcgC7QF3gLzAX0Aw0BjwDJAGTgMqgZYBlwDOQGqgNYAbeA3UBxYDkwHLgPHAe0A-sCAIELSABMABAAaABzgFiAR6Am0BSYC8gGpgNsAbcA58B5QD4gH7AQPAgwBBsCFZCA4AAsACgALgAqgBcADEAG8APQAjgB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; v_sid=f206de2a-1741007565; viewport_size=834; datadome=Jc9KtcA6MOzP_rUiHBcq7UQaFgNDc8wPvnG9su_B9vTNxiUTxBn5VOqcgunS~8RzVcSkzGNB9T_WkRf1l5yn3RasHBWWJ7CPlbtqT_6qRu9lKhth1Vl3yIKZ5p2qR_II; __cf_bm=rGc92y0stNyaL087KJKA.f6GIxAeMBZYONXTfr.jJR8-1741630942-1.0.1.1-9BjZR1cnBGt9qrrtYHeyGKrUIzEig0CsHfEPNKmdnxqRdSmtn0UgKA.gAtQu9ll1wiYbV3xitvP4TFN_amo.HHJbI04A.bTV7XiMW4gEgBpRkNKO9nnHp0Bd3ddwGWbf; cf_clearance=krUeuZfDEXYVXDSUdwSi1VStY0ou0IFGFWKhlD50CFA-1741630943-1.2.1.1-uQ4A8vuYSfu6VLMb5_pnW6JrnJYaudpMSO4TGIHK8JSgl..M.wD.1a98JTM_cC35Hck8DnxLGEEK_jFuPgE.IMOcx.TIgt_10WUzDR8pD1LmEooHT4CniZowHCxWf4kCzlEQ3MRXDypjwUFJumAIx8fb_a.WgRURsyYoxAmph0S.MitJGRc4ywpQeXnQymAv_xxTfuBYtOXMw8llS.4sKB1WB0x8AyasyX4CnSloSs_.utUh9ocopjqB84y0X8xD6Mc8qU.nP4l.lWQn0Hh2mO.zzjnV7wA9yKqXxwtf.QeU.ELjkLxSfsGC5EycL9AZ.OlUBpwceCtg.hPeAO7cFQoFL9.3S4BZAEyHwaGY.clj3FojR6R_zcqbdmcpA77InwhX1Tt_eX7fHV1okBynH_lMSSZ9nsLad.Vd5iOckcU; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjMwOTQzLCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDE2MzgxNDMsInB1cnBvc2UiOiJhY2Nlc3MifQ.L89bx15qQeyvhehoKS78UKXXeYMD4q9q6wyRUrrL-AWYTPLa7mPtovkIKJkBrUun6KQHj_gT8wb-ksgCTxL-5hFkDelrx__lQ02kBBi8cIFXiF6Lx4VEo6-VUvQQP6GJEpUMrD9VbZNc7qA6jfL1CjEo_p2WyOAEu_HxvOePLUmGtYxY2zPlbYrP-RMKcXr79B2DclDhTLUBVU-vMgPvsUy3gjzdqlYZ9FlEIvEml2k42BUTHjKTmIyhtwZ-QfCioziTgqChnP1Vem4F_KQ4B_hVkhEBSmoV65kmHACbvGWylYjfF1YG_kAoyVN_HS9rSb-zkCKe0T_anfa7YMyQFw; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjMwOTQzLCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDIyMzU3NDMsInB1cnBvc2UiOiJyZWZyZXNoIn0.PES9LJIyx81A4MSY09gQdLsBq9bRDAIZD4s_0p17dZUuzsyyuh7P3seMizJQDCehX3rRZg4kvz00WHBqRNkzMcPczPE9PhbVwdKX9vj2y1jTjTHWQ-HZFJ7xVBrvqj0-LMOU8Q9xBiSFahhv_EsUmkKqpokdxW6oOdn95TuHHW6eZfNtr8MAB7cgYn_GrvuCCC-3hMETwFPTVFeNBVYyyYGeNFP23E7zrPbXyKbEsW9FACt8o3yHVCJhQrjd10EaGlwGgDKEUPqjmjp_EIIdLd8eLeQTG8v64zThe7FLikNaxuuW6euz2J-NCxpnEqZAHFV_0xYl2bVx_NWdtsKmSg; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Mar+10+2025+19%3A22%3A25+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b&interactionCount=35&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&AwaitingReconsent=false&geolocation=FR%3B; _vinted_fr_session=YWJ2Y2YwVzNMN0VCZnNkelQ0SzBVU3k0cW1iMWpFRHF5eUlTNk9CemJGTURhSG9SOUUrSVpXdlJCb0IrSEFHRDBBc2VIRTlpbzdxSVFnVzhRNGpjVGlNTlVqTnM0WXRjQ2hEaWhOY1JDYTUyMEIvdmFjdkV1ZGJycmxJTEtGU0t4ZE9FVVF1dWFzeWc5TmV2bFVNR3Q3dkxYTUlpRVRaNWxiZkY0ZHpKQXhQZGJ2VGl3VzNmclpDRmFLaGIyV3RpSUFlZjVvQ3loOWhoNS9mWEl5UDhGMjJBci9YTm9JQWF5Y1NYeGlXS21jTzBYVzRMQjRsdzBtaCtRMUJjVEZFZzh1ZGxVQkF3enMrMmQ0djJ5Nk5ZVWI0dEJBQlVEelZ4SEczdmRCRWxwNm5LUG1WYlpzci9Ua3dhOFQvUlJGblcrSnhROWlMQzd5bXdBUW1XRGt2d0k2NGxwR1FlUzVTZU1YSFhrVlUxeElhM1JsWnFhcjdUblhDWjdKUHN6TFBFSStOeGloc3pHcHcxWDVtNncvQUZnMk83VG5hVjNjL3ZwZ3Q0U3h3bno1dzljaHZtZVc4OW9rL1Yrb2lzRVg5a1lIMDlNcmtUVStkdVlienM5TmhiZkdaSWpxNFREaWJIWE10UGZrc1NoWVlrWFBTbmhJNDU5ditFM3loRDlLbUYxbzM3UkJOaTJXZ0lZa2h0T3pOUE9Xb3ZPY0I3ZVdXemRTSFYwblZEZE8rOE0zMGVvWUNxUmlOaVVycWJoRVkvK1cyZW85L2ZJcFFDU3JpS3JkRjJKTWxnQVlIMU0rdThYWEtSeS9DUkJMLzNzWHhYRVdaVzd0QnJ2RXo3U0ZKelp2UnlkVTI1LzZnWDhXa0lXczUxUUQrc2grMXRteXBCSnk4TUxWdUl0TTFvckF0K1hlS3p4QlVtNEV6WHZ0UGhEZEh3RW9jUDlXLzMwcUtKdUx5V2VBREZMNXcxd2ttK3VkSVlJUUFRZXBJYXdzdk1SV0Z4TUZONlJoYzZjUFhRbXAreWlIeUVSRUg5cnB1QmU2dTZsa1hMK1ZKOXRiTnBqeC9ycXdPVFRQeUt4ajZwT1FrOFFsVVNadWl1OUZtZk5MK3VrdmVCVEtCbjQvdUNLaVFqS2paMVJMTUNVK2lYanRpZnE4YmljY3YzM09UbFlSTEdId2w1c0hQN2s5dDR3TFp5a09qc0VFdmViRmFZNGlEWlQ0NTVjenpmNTI2QktWbGNTVk1jM3lHMXNuYXVackhxVGVuU1FQWlYycUtmcFVyaVJaTFArTzZpUk5yU01TUXNqckVaQkxXbzNZWVVkUGJtOS80K2hPejNMWFhVVDZzRms0YkZlL2Q4aVowWC9qaDd4d3c0a3FqUTZXUysxL1hYT2I4d1lwS3dqYmtMWXJ0b2c0TzRQQzVMb3FBeDYwWTFTSXVoaXlGMEhqTElVUVFFZW5oN1QvYWVQQnFNbFVXY1hhdUovbmtXalE3YU1EOGpmN0NMSjJuVWxjRkR0bFBhSTRvRFBickVhZ01tdmhWeWVEVGtmVHpBTzZIc1o1eXVTR0FwYUNDZ3BxMmVzSWw3T21Pa0dxRTJoZUFvYVQyNHgxYjQ4Z3dSMHhFNWx1WjcrTEVUNzZnTFlaZGpDck9iUTlUQ1VuUmNiNDU5dEhoNGZya2FYSXhKOTI3aGpjL1VHVGNRcWVwbkw2dU9yeERWSHA5RGV3Y3ZWL2hScm85UU8vRGVoNStFTzdGS2NHSllrZDIwaFlBWjF6MmhwL3hpRXlSbjd3ZG9NSUIxRXVFNWZacm5qN05HZUZFc0xaZnB3K1VIbXFzbFVySmRra3BWWWRuVmdRV3N6WUpLU0doMlJ3T0xKakJ0UWJUY1hXZytjREw0TWNVMUdKV2xwR3NaOU16TFhzMm5vbnhGRWxVeDFHSEwzY3hGRTZsc2R2a1lpWStjV2wreXFzaWdQbXpBVXlwc3NUTU1EaUtGVXhDN2VzdUJXbXJuTkZoaVIxVFZjVjV4K3hUWGZiTFJLTU9QaG1uV2JCL3lwYnVqQVI3akVhRzh3cktpUjl3WnlHYXZ5YktVYmlJVWV5di8vQi9JRzZBM2ZhOUZ2Y0tZcTlPaFpvdFV4K1NUQm1rVENlVyszazBDOWVuRCtUU1dxRVcxR3FmSndNZjNsQy84Z29raXFBY1psemJRckhOa3lRVnF4b1FsbEp1NnpPMkkxWEF2bFZ3YWkydWtpSGV0dE4zYkduSUlvNkNBUGxPMndpdVVaWHltZHFwbE9RNXJTTm5VSDkremg5dnRIV1VqN2QyNGI2M0c2dW5ScFBoU3NMcUh2ODRWZFJXKzdJWWoxOFNUMHM2eGZwWFZkZ3NmaXpqT0lDakx1bmgwTlNsby0tdVhMN1YyVzkzOTRiY01LV04yQWpoZz09--e82183084654de0e3ba2ca3c1a2e4b8d3833dc0e; banners_ui_state=PENDING",
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
