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
          "cookie": "v_udt=OGIzVm1ORlkwRzl2NW5VMXJ5VFN3ZTJjNCtXaS0tTFI1bkQ3VW5xUGdGK1E2Yy0tdUVkQUdoakd5TlNMSUFhWHBHRjVxZz09; anonymous-locale=fr; anon_id=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b; OptanonAlertBoxClosed=2025-03-03T13:12:49.731Z; eupubconsent-v2=CQNsN1gQNsN1gAcABBENBfFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSgAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBLACaAFGAK0AYYAygBogDZAHeAPaAfYB-wEUARgAoIBVwCxAFzALyAYoA2gBuADiAHUAQ6Ai8BIgCZAE7AKHAUfApoCmwFWALFAWwAuABcgC7QF3gLzAX0Aw0BjwDJAGTgMqgZYBlwDOQGqgNYAbeA3UBxYDkwHLgPHAe0A-sCAIELSABMABAAaABzgFiAR6Am0BSYC8gGpgNsAbcA58B5QD4gH7AQPAgwBBsCFZCA4AAsACgALgAqgBcADEAG8APQAjgB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; __cf_bm=kpZ8bbX7nJnfpXasFER5hyI4OU8XE1Xh2_j_oeF6Zfs-1743879154-1.0.1.1-mpcMJfPbkTFsag4nNdIMQojgaFQymn1GovxiaqpPgHx_o7t8cqnIffK0TzDKXjl1S4E4aiI9jPILWrIEJYMSzhZJ336wXIJmk6RGGgQsuMP5z_ThZJffbS5wq4LiqR3Z; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzODc5MTU1LCJzaWQiOiI0ZjI4MGUyOS0xNzQzNzgzOTY0Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM4ODYzNTUsInB1cnBvc2UiOiJhY2Nlc3MifQ.hktiWaLFXfU2ozT7RCAcuKcStE7mSemevu1qJigu2dA65KsMfeB_JgNKMTF9NMrp7Ddf6pt_VvJyImqrO5-fECTzvJ6alxUALsvUfqziihZrvz2FkCtYJdRg_R-y0u00OsE5iTiMQLMTQAPKMPO4TJH7ZpwJU3YzCblsoIEC3PLrxYx3g3ox9OwiDTzAXW1fa8EFT0MH7twlzcKh6YqEwMEhzwArubGjNo5BEmtPl6euNp4fP7K29hrfT9THzHXdyJEfOKkq54j0UgFe9lWJdKJDPEyHVNrH_-CZ5Co0McpzxZIDnkR4_4f9tTrVHJXzRn2ZWyUH547OOTz00m68GA; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzODc5MTU1LCJzaWQiOiI0ZjI4MGUyOS0xNzQzNzgzOTY0Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDQ0ODM5NTUsInB1cnBvc2UiOiJyZWZyZXNoIn0.nkNit1ovRkkM9CgzUVhOA4G-SHn4e2Tr19290OEprZQqtG8xjoqa4subzunalNhv0SLL-nZRWhwhtYi47FGIvYCCtOl0mnP6xvdXWpup6_x1Hsf8s_9RLpzhN90vnitW2NaXzYVI0z7oThKt0TiM8Jo6npAwqhlDMOlalqtCMp7vV1uAcnH9ouwxlWW8q5g9hGbFnZ-Wwn0J_tm07S_6XYheEu7l24CQwjXfVJlEqkN0linZg7Iqk36_KHqXyJIPDL2PvQAXVjAD4Ss-kASpPIfP1kshscErTheC6QDqTEqdyHUp_GDcDsHSdMwFQkjH6wti3nYDaEReEEH4AzkhhA; v_sid=4f280e29-1743783964; viewport_size=1301; cf_clearance=t8WSr9hw3fSVIAZO8LW1muqK9E02xxBkxgxGCUSFxW4-1743880466-1.2.1.1-Ee6C9Ro4aJzqbEpo3aCDuLMDB_Km5N2vH2GL.aIKp5CscDN7i0IRsQqRwCJJ6Ho7Tu.KFLgWbXFoQ8VKi5p3_1sIXMDK_RoPT32u.g.03PEkdCml9q62f6ZAaAPFHRqgmLIVRQlVGRbIFHaJ8I.CZsMN6GGOXe7vqoCcC7Srk7jaRqdXZUgeiQquhVFvXovq5j_fLFtZ53rb.ngnQIbHo0TfokvMxz1WKoYOEdc.e15sl2V2MLHvfug.lPZg0uVpbUkdNVOeOCblp5ZgGy31uVYBC_rS58kh.lnimqWLPuG18npKd3KTolEZF3KQh3EN.RAShgV7CTo3_H39MDnSc3kQggQ4N4NBeWL2.0mblXs; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Apr+05+2025+21%3A15%3A35+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b&interactionCount=93&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&AwaitingReconsent=false&geolocation=FR%3B; datadome=22GP0E5ELd0NbQE~TB57EgZdPU3ZAQbIznmS4MTXmazLYExTE0lXN8DLh1pL_CMUZDHV_FisuJW408MHKRul80UkvzutvNMJAvphyrDrXBmA5TkdaYnHnynI7xd~15hH; banners_ui_state=SUCCESS; _vinted_fr_session=Kzl3M0xrVDZWMVhkZWMrMVdCYlpCV2JJZHFYVUJUbXRod09Gam85NWdwSlRubi9oUFIvY04zMVcrSnhVKzZFTHhLSUdvTGc5SGR1R0dnaFZGR1FZVkpDdVJ0SzArc1ZDSWdsdmpyVWpBVmpINVNVcVhldzFsckdld1plR3NTb1Z3MHJvV1hHNjB6Zmpua0lzWmROZDVUQkl0MG5HUnNWYm13NTB3U1MzNm1qbndUQ3pId2c1Z04vOFpqRUNOYTlNYi9KcXVpc09QK1hXWnhvSlhvUStRZEl6TWQxNzR6QmpuWFU2V0U4Y2ZBa0dLUGhlTE1XOGZDRkNoRExnZ3pISUNWQ05kd3R1NGZzSDN1eDJrTkZKTTNVME5tUjBRbzdJRkVYQ0pRTmxFZ0VXeDRDTEI4NnlZblFPME9UMlVNdVBydndYUFdyaFpuNFNWWW9ENmt6Q3EwcG9iN0kvNXVCNkI4UW9HcENUWFZLS3NtazNDaStRcTRWYXRreFVNM0FaT0h5MUVoQnoyQjN3ODBESWY1Z0JISGkxQUFiK0QvTzAwZTBtWmV5dXFiQlQrL1dRSm1Bak52ME56RE5tNmtCZ1I1aUNVQVVVQXNBOGdnQm40UWk4MUFqbUd2YlhCbEJOYW50eklOTW1NQ1RycEJJNDMzWjVKWUtscmg4a1NCZjZaVmtEc0NPa3hWSksrWGxuNmg1STZPb3pJZFJSMkxpOWdtMjJUelJueExWK3pTdjNOQmRLbUxxWENBWWt0bFhoMGZRUzBhenFselhiUE5WaGZ0ckRzUS9BY3dwU3FobzlMTG9qMGRvN3JsT29zMDY3VnZXcHV4dUdIZ3Q4UXBmVTNaSTg5Nk9rbDBGODBOWTZyeXhmL3dpY2psclNySFpQQUYza3p0VHdLQkNvekxMWXRFa0FraEJsYml6bHRqcVUzRHZvTUoreHpoV0tQOEJJU3pxdFpLemxaYThvcEhHL1FnaDh0WU9NeUlvMjZKQjZTZ25Pc0sxV2YyQkdBSFI0Z3cwTFhVbGFxMXdTYUd0Sjd0aW1PTVhJcFdoMTlzQzkxTW4zYnpNb0x3eStRSlJBc00zWHM2SGRUUndJQ2NVano3cUMwaW5LNExoeHBhbGhGdkpSNW1KbUJnRnBQUW14VlpXRmNsU0p5dzVodXp1OW5QRmtBNXE5TVh2emNnZ0ZxWTBLaEpiTllWaUNVbzVPMEJTZjJXNHRBOGluREZ3aU9INXk2VUp6WTdCY0ppZ1BEVlRlOEdXNm9RS3c0eW05eExEdmJ4WTA5eW84K3AyOVMzRWhTMTBydGk4MXIwcUc4c1hMKzRSbzdMdG50dHhWRUk4b0FrdmRGaXAxcmUxN1JEMjZTd1Q3UWdSSVBBTmpGeWhuNzJlWmVzWVFlSklFTGptanozWHhsSm5yRm96U0gxa2pHSjkxT291MGpZZzArUHVlcGZIMjh5azZEV2NscXFkM2MzcWo5OTFvTFptZzhUZ0laMHZqNW5sTkRaNlYwSHFMcm5TRGVyemU1V3ZGMjBqa3B3SnFJUXNmeGRQaS9xYnR3N2MxeG0vRTZrQlU3Qnd1THRDT29ldDZjNDRsNXErdnZuME9qYXpEemdydUxlVXFHc091ckxKaEI5OVljdmpMWHRPYzFtS1VCQWF4Qm5tU1RyVGQyUnFjNVhOOEx0ZDdXbDZ4bVRHS1BYK1hsczVVNzVWRVVMQU0va0JUSWgxQnJTN0N0OWMzY3loSFRrSHdrQkhic2lLVnhLdWUwY0FxU1lFVWZrTW5ISnFtdWJ6ekdQUnJCS2dxdzlreElLOTRHRVBFNit4d1U5eHVKUFZ5SkxLZDQ3cXE4bnNpcVNPYnBVS3BxRHNUSXBDV3JyVHVMamlJeUdmUmpmSTdnb3FqNVVIVGxaR2crdUNLQ3NVclpEcUo5N0dVRnBzZEVtUFFBSUgyL013eTNGN2NZamtoNERFU0FlaUVtT0tNODJMUnFpV1AxSFF3V1o0ZWZLaURhWFYzOVJPSC9OSjNoMzlDRHdVMGkxcVJ4NEplZFNIYnM4SXErZUlyWnNnZHVKZ1JUUzN2OHh4dFdZMUtKK1ZhN2thVk9xaVd1TGMzMmFNVUVQYUZDNVJieUxoMlRobEZuSDBhbzdYbDlMYnZlQ2IwQjhUd0xDNWsxRXBJWVMvbytmLzZUZ0Rha1R1Y2phTEdPQ1FwVUpIZkc1ZGJYNWFvZXBBZitKaUxmdzJwS0lISVNaWDl3OUVBWldkU3BhNFdtYkZ0WjUxQStOb2QvQ1NkT1cvUlFVRlZnNmNlL3EraE00TkgweHYrSlNaVzNQTnAxOGtweUZZOVpPM204Nnc0WnN1LzYxQitWYkZvRERmMHZkcFhUWXhaWXJ0Sy0tZFJIUkU5Qm5KRkNUUTdlczl2dlgwZz09--bfd9bb92f0cad445307cc252e646f519c3ebe340",
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

// Parse les résultats JSON Vinted
const parseJSON = (data, IdLego) => {
  try {
    const { items } = data;
    const seenLinks = new Set();

    const filtered = items
      .filter(item => item.brand_title === 'LEGO')
      .filter(item => {
        const link = item.url;
        if (seenLinks.has(link)) return false;
        seenLinks.add(link);
        return true;
      })
      .map(item => {
        return {
          link: item.url,
          price: item.total_item_price.amount,
          title: item.title,
          published: formatTimestamp(item.photo?.high_resolution?.timestamp || Date.now()),
          status: item.status,
          id: IdLego,
          brand: item.brand_title,
        };
      });

    return filtered;
  } catch (error) {
    console.error('❌ JSON parse error:', error);
    return [];
  }
};

// Formate un timestamp en date lisible
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

module.exports = {
  scrapeWithCookies
};