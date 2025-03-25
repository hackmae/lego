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
          "cookie": "v_udt=OGIzVm1ORlkwRzl2NW5VMXJ5VFN3ZTJjNCtXaS0tTFI1bkQ3VW5xUGdGK1E2Yy0tdUVkQUdoakd5TlNMSUFhWHBHRjVxZz09; anonymous-locale=fr; anon_id=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b; OptanonAlertBoxClosed=2025-03-03T13:12:49.731Z; eupubconsent-v2=CQNsN1gQNsN1gAcABBENBfFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSgAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBLACaAFGAK0AYYAygBogDZAHeAPaAfYB-wEUARgAoIBVwCxAFzALyAYoA2gBuADiAHUAQ6Ai8BIgCZAE7AKHAUfApoCmwFWALFAWwAuABcgC7QF3gLzAX0Aw0BjwDJAGTgMqgZYBlwDOQGqgNYAbeA3UBxYDkwHLgPHAe0A-sCAIELSABMABAAaABzgFiAR6Am0BSYC8gGpgNsAbcA58B5QD4gH7AQPAgwBBsCFZCA4AAsACgALgAqgBcADEAG8APQAjgB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; v_sid=144fa49d-1742809745; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQyODk1MjcxLCJzaWQiOiIxNDRmYTQ5ZC0xNzQyODA5NzQ1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDI5MDI0NzEsInB1cnBvc2UiOiJhY2Nlc3MifQ.japuZEez-En4phUN6TeFOAFd0HMZWhl-6jRXIlNGdcDNyfFXPmLfmVU5g2fGmJVdF4qxElAezuDenyCIlepfRsjggToE_sl16JPH-NimRQ6z4D7xWDvIrNiTq_d0Cd6ae2px64mNhpBkL7Kpjng5OJqqpYr-1alyoaKhzoZpAxT69wJqiupzEqbaP2jYD9Hl6qBBdkwHAihoLkwxxiHha2LLMM4O0AOK-jpEQMiznR0EitxdAzYiMV3GZelW6OMrGCrZN43L21PcGezkWdVPOePtlYqtcF1pOJ3dO5COJa1hKmF1LJHO2P6QPGyPfJCeDuJGlLl6pRVTeTH0O9078Q; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQyODk1MjcxLCJzaWQiOiIxNDRmYTQ5ZC0xNzQyODA5NzQ1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM1MDAwNzEsInB1cnBvc2UiOiJyZWZyZXNoIn0.v9-yPMOTCixb7HK8mwoXt9N_LL0a9lWmtrZZgbxnpzZja3prfXL_vs27g9yNHFapegSpxe8Ouze26e1agMrTkN3qv3Ut5IgxzTPA2GokILKqnAuLWgNKqnE6pBtcf5DPxayqq-dC1UjaU2nlXY5FqqMNIZvKvHLw7Uc5FVQijKIY3teZ1VpNwQ_kdyZNZ0FBDJfq7gJIEEFH0fZFV-VwQVjTf5_X0ub4I5UgckbDyTP11vgdExI1-HJ7C3JiJFhOayB08serPABh3i26yqjLFFa4NY0p1OKQsZSOoqDyLQxTskLPnqLwviw6-rWfhOiybevjNnGV4NKWFTmK-9c5rg; __cf_bm=5pNVc5_d6_mcahUiIr2o.kTFOphSPs8oyg3mHLmjf08-1742899945-1.0.1.1-bf1Uy4cOPz3V_ZF1.jhNAkHXZNWuChsK5wCXgY4vTY8p8F99LWJ0uDAdsRPHBu.g8YGqR7pTIeo4z0ylRhW1Kzuuo4d27IzZY.3S3rHfYC9WpFa382kAGJyGOXlkgj1q; cf_clearance=YS9.v1KBawzC9qFhzT_f3lqmrLAkpuJu7JtPnkIkGZM-1742899946-1.2.1.1-TuPIK__poMuonhWwqvbsuHWp6iIwCFxcuGHKQS51vNLSpZoruR_b7H6DaJUewT3DzNCaOFsOo1urzJ723TXm_b3BsjgqSPP2Ujj3UCtygbLOxdnJZ4Ifj7nZ531UfuRV9XshK4_5oMuGQwRC_pCqFlMlOlwb4hDNG9dhToeKu2_reVIXFbUti0JW2sDIoxqkg.3wqv_fRFSGHxgC2rVtt6A8FWG65ObfCAAZGDQVQbaiHzmgWNLKS2V.u3xi6tG.SYp.wX86M4jadlGs6ByFLz4gxE.hqbJmqkGhojW1PX_nndKSz_bbKfEBGHgUM6zFhxFRl15iJ2vwjqSm2gKXKWPfJjMn2O0_x4Q8OKm_e_0; viewport_size=1082; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Mar+25+2025+11%3A52%3A43+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b&interactionCount=69&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&AwaitingReconsent=false&geolocation=FR%3B; datadome=K1WWiyoeiZD1pUCVShneHzaNgIPxrVkskC8hY~yDwpASdxJhGKBoQ_ikmv4MqNBnWXXik7huykn0IY9GH2cwK3kX4O04Z7PtHD1UehxXtHIC5_3FElGqKcB0rKIGdsXr; banners_ui_state=SUCCESS; _vinted_fr_session=TWEzT25nY0lvNjBZNk5RSjkrdU1hcUVwZ0ozVUI1cGhIdnN4WEd0c3RJMFNUYyt1MjlsbE1ETTNJN2pLaTVBRXVTYmZTNVlBd2gyakJSQ1hYSEhyb2d4bEtLNzZ5Q0dBdG5kT1NFWG9UZkE3OHBBSFlOT2FDRVpCMzliNzU0ckg3QkZBcVpvRWt3OWV0VEFnMnYwMGFRbnpLSnYwUzhKZlJqUkg1dXRxMytHSUhVM1BIenRvNVQ2WWd4eCtWdEZscjhFVldVMi92Y3FWaWZSaDBwUzBiZVQyTXNrQVJNZ0J2WmJLaGgrcGRVdHlrQ3lsL1RMS1ZyY1pJd3lMdGpsb2cwNjZZTFFuRGx6SHczTjlMY01nczBieWNJRXUrTVlCWTZ6SzArSTZGNGJaN09xMEtIVVIyN0R4MWNjS1E1LzhqZnEvS1U0M2FHVHhLM3BGejZQMDdCR2Nxb0NTalV3bmM4eUtBeW5NTEJQcXlCS09rWm53d2FkWmJyb0tjZURpWU9ISHVsc3pkcW1saHJCcG54M0MrTVJTanlNSlpOZi9ZUFV1NVFuQjFmYWxMUWlGYVQwUXhrTmt3OHFsOG1tdFM5YWtGM1RLcDg4THNlVVhrWVpRbWhucndVejM5TmZJT1RKOHNzUTVPMjZTMmhZdXJWS2ZEaHB5ZFNZQmxPY2JHeE54VE1ZbW5rK3kwWkZqdEFPTWdWMlhrcHp5b0VKQmp4bmE4V2tRNkNZVzYzU1VILzdEY0xFRlY5U0M5T1JmSy9EMWlrVkRzVWhEOTEvTzBZZ2xOMmIwOFBaTXd4RDlzT2trb2p5QjVmclBmRjJZemtwNjBrNldiWCtWQi9UUGZrL2wvd2NBZXRDT1VzblA3dkNZZE9RU0hUa0c2SHFidXhIMmcxTXhvc0lsbDFzaFpyVlJJYXdvWVZWZllvUHJ2dE5QclViV2V5TTNQSnphaVV1M0dkVXBrYzZNZDJhL21QTzlqMlN5UVl0bTQrTDlQVTliMitkT2hCem9VNVNrL2xUTUY3dVV5YTZnZTJhelp5Z3NxQkIxaWc1eWwydHBZa3dGR3YzSy95WmEwekhYYWc0RkVmRUFxUWFHb0JxRnZCaXdqbUtVK0NyQU12TGtjRkQzODdDUFFVTmxHcmFVVjZRZXlPUHRFZkZlVU1Jc29vWmdCc2Nka1JEVVNoVDNSTmJ4aTcwdFJIRk84MVNuemRKWlZJb3pvK21ubHRVVmtKdmI2MWs1N01NMGNhTGl0eFkvSWkwY2MrRnhmUHJiMi9vRVlMTFVNb1NzUFdFZzlLa3ppSjV5UVdpdVg4YVBFNm9ZL0JZNGhXb1FKWVJERDVlTHNrZGR3bEpzbEZ0eXJGUjdxNWNKSW01Zm9FWERQUE1MdjBZeU1NS0VNQ1B4WXFoOVZEcitiS0RXWTRzV3ZpSmlJYkVFSU95dnl5NFRkSG1POXB2NHFOdFBGZUlLUllqZDdsS0pEdzVZU0ZsN3I0L2VBc1pOUEJsaGFNUDNFb21qUzRkMmpzR004Q1NrQmhxWCtaOWFLSC96M2VNTlFOaWU5cm1QbVpHbVFoRzN1Q0owaHZLL05rTCsvTzM3S1E1bnR3UWFDcHlRV3U0TVRBbFlhVUtSalRLenJqTE9VcnY1MEpGNWRXL0tNV0Z6ZlpFODBVbEhjT28wZm44clNMMUNlYjNubGtBbEZsNCtReXFCbVVSU0xXdldMcG9XWG9nYnd6V1hGOGo2RGtiZTVodUhsRm8wakFqdUNGckdkdHJEZmNvbEpGb29seTF5S0tpVnRWWWkzMnRIRFBjcG85TmI5QzZWWnJRR1VFSGN2a3B5d0xYeGRjdkpjY3YxZEU4SGVWTkhBWXNHbHl1ci8rdmxpQWVIWUpadDh6SjJuVVNMbHlzVHhUUFhvc0ljUUdIOTBhUld6alVCQlJNS0RsVDcxcm5GRy9heFR6VHdwTjJxYVZiMDJLRzFsMVFlWnQycEV6b1I4VmZJb3RraUJVYkwvandTQnIwbDRzMG1QZU1saC92eG16YnVFUzdTdmZkakI3ZjVwVFA4NitmSzVnRzV5MFdvbVNVNWlSdnpHK3lBWDF3cnc0aHhUeTF5MFVjMGU5UzJDUmIxM3NHSDR3MU56N2tOUkRPd3hjbDJKSWhwSWlqSFA0WEN0cldHUWdzTlgxdDZGWmtLdzhYYjhwYXovZXRxV0NBem9zYy95TDU1UEVtOXZacmV6TTdYYVlZYUJSa000ekZGZ1A5OU90bERxNzVwSTlsT1pJdjJYN0krTElCNUNsN2NraXdYNVBnR0xsSkNqZjBiNjNEeEt4c3VTdlZDS1l1MitlOUdoRGt4d3F0Z0Noaz0tLVJ4N050S2c3WDRyeThhemVFbldZYXc9PQ%3D%3D--36d915acc73f42fcff28d1714f0394e85b316451",
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
