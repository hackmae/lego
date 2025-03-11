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
          "cookie": "v_udt=OGIzVm1ORlkwRzl2NW5VMXJ5VFN3ZTJjNCtXaS0tTFI1bkQ3VW5xUGdGK1E2Yy0tdUVkQUdoakd5TlNMSUFhWHBHRjVxZz09; anonymous-locale=fr; anon_id=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b; OptanonAlertBoxClosed=2025-03-03T13:12:49.731Z; eupubconsent-v2=CQNsN1gQNsN1gAcABBENBfFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSgAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBLACaAFGAK0AYYAygBogDZAHeAPaAfYB-wEUARgAoIBVwCxAFzALyAYoA2gBuADiAHUAQ6Ai8BIgCZAE7AKHAUfApoCmwFWALFAWwAuABcgC7QF3gLzAX0Aw0BjwDJAGTgMqgZYBlwDOQGqgNYAbeA3UBxYDkwHLgPHAe0A-sCAIELSABMABAAaABzgFiAR6Am0BSYC8gGpgNsAbcA58B5QD4gH7AQPAgwBBsCFZCA4AAsACgALgAqgBcADEAG8APQAjgB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; v_sid=f206de2a-1741007565; __cf_bm=6_mJgV6V8T2PgvkxhMjYJ6RzKbbrNiipGQkA9X5E5fw-1741724549-1.0.1.1-S0terO4ivnu6FkBFS7y0RGl_1PwnuRxReOH.xGlyPUhpy5begd0gbbtwwlpGhUmmaSKANjQa8JadkrFHYsP05skrLtJm9XKynKcROZ9u_ueBHT0c4vcyJm8SaqZLiCr3; cf_clearance=3c93Bag7Yu9IbV3NlDRKXLj._nBYkvscoWI_EuLj1XA-1741724556-1.2.1.1-HmU_v5ogjbcxCNVNim1aIDb8bSpsspkZrgukI4_rBniGY4OIA6ZeZQFsTk_.J82t.T9Vr9a1wRQQBzd1o_lJKP34kbfzPf2vLrtj55U6zRp.ML2mRLJ1_8D_bPFQ2I4fhWQFhCgZK8M0g8rSvHRCzn2dRzkJOn2NC2f0C8RoUCUdTWBBDXprmv7gw7Z7QmBYyPo2KPFw4SThio2.jDU_QRxB.JNobj8Sm1S5yTbVwx9r9LYTdT7x7j3zMXzFPYbyBgRQN_PdZ4pJ35JEYt0LPIwHwuI.5ZvYckAYAVuLntUDuQymk2iax5_2ZrYPn5xExKVPfelVW.jG5oT.vFFnHOwcfASItnTDwy0YhNAR40Q; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNzI0NTU2LCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDE3MzE3NTYsInB1cnBvc2UiOiJhY2Nlc3MifQ.xJ-UCAggMJYd-fGaF4L36qf0rt3EWbRuj8ccUbMaEKEyPIQCkDAxiPhb2YAF5wVRMimb4wxW5gN0ytLUH8jyrqJMKJi0lz1hKX9SdvdHMEK95kwDDy5F5RWsjzjzJxU8XCVdUtFwGb2X1yu8qUdK_ViXvhGREcTBN0xpArkWjgAj5XWkctbjMnVV7dK5jsYUtFtFpGEdXaR_u6eHoKjicohldCHJURUHYc106G4kIr9XQmdXUvV5lnlyj9X2MHsohj-4-zkTYHdRsou3LkYm5uNPUawsaQRfvRBX_W8GwIKX0XRgtWtiGBjioW5kaJvIFV2PVR3H0jjkNSr9LHGdoQ; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNzI0NTU2LCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDIzMjkzNTYsInB1cnBvc2UiOiJyZWZyZXNoIn0.H24aMGzoe1GrDr-_vdDiVXQ9kkHmrXrCZkEj9jTHZw3VZnmWb2kAWKHxYQb9g_C_-JpyiB2fZKWcNFZGQNbWgdbY9V-pbfrlrAiWQ-5jlEk0nwGeRtp7z1FFVHr_zmzBMZNfPYd2Efkd9unG3RsE77VoPquTawqrIVDtHB1UFYZiegp6OV1n4Rg6u65Zx7TWeukk--H0h4wCl9DldJb73qEZR5j6D70N-LiipClG2WvQwWdxk8_f2bIHUQGSMwwbTT3hNUlYhM-1Ov467vzGNAslosN9oxweKwdbitaEhoXBsjNcA1GLbQhEC7bQ2lPYJLaGSh_a_eqbrPJyIPfzVg; viewport_size=834; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Mar+11+2025+21%3A23%3A00+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b&interactionCount=56&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&AwaitingReconsent=false&geolocation=FR%3B; _vinted_fr_session=RmtpdWROLzNFMkVPMDJEMUFBRXBzeUk4T3I4eHNGRzNuTGd6WXZkeFhxVEwxb24xbjNzR1VrNFVJazJXTHovUjJTdmpsWms1ZUFIaWtTak5MaHM0NDMyb1k2ZmlGZFJBZEE5MHBDaHdyVUU2end2dVAvTFpGbUxONnpVdGRzb0swRGovN3NXOFBhTlJENkxPTW5sYzVnTjl4NHFKOCtvS0VCc25JVzYvRTMxZXBudlhBL3g0dzc1M0hQTDhaLzVBNjZwbFQ4NHUvd3pEaXJHWHlVT2RINzNKT0Y5bGlrM2pOajcyWG9saE9pYS9xd0J2K1R0bFd6eGtSR2ZwNDIvOGVvWUl4WElBeFhSQ1FqaXFYQ2Eyb1VidVZtd3hEeHNFVHA2RXFLTitNZWk3dXFIdU9hVXp3Y0lDeUxGSjNmTFgvWksyTk9wQXZ5UXljUHhXc0Y3YjB1YUhHQklMcU8zWW4zdXQ2cHhMWmFGdGc4dkNVWGRkMUR4a1FRYlJLTEdXR3pHclFVYTROSjkwNHU2ellQaVloUGg0MlNITGlxVVRmS2J2SC9RbHFMcytFYlQrdWJWOVZxck5vMTh6NVMvanE5TU5DbEEvMDVNUllhVXY0YVQvU09pRE9SSW9FbEFuTy9sei80Qm9mdTgzVVhCN1dMWEtnSFh1Zzk0V2JCbVN2OHp1NGZhVExTbkd6MnQrYzJpUkw5Tyt6RE45YmpMTVA5R0sxUlg4ZnU2VmdDV0xnQXgzaFhKTS8ycUZyemFXRjgvVWxadURwKy85VEpDT3o5aXlkWjBsTzd4cmlIbGZDRDFtYmVIeWdWdXMwSU4wbkF3KzFkZVZSVTFXNy9UYzVacmhEV1h6VGptMkVIbnc5SmNoelBoOFB5aUdTa1Rpb3R1RWFIRmRRRW9FVUJIV0pwL0NSaCtMazBXWE82TTMraW1LMmpua25GbGlhMFZKNVFYaWN6RU5hV0xYODE1QXBtTFdZUytVbk9Gb3BaRkM2SUdDSE9DK1FDY2E3enV0a2xyeEVxZnZwSk5NR1drNzFYRFY3ekNjWWQ4NFRKNThuMnJIK2VMTTBKOE5Cdlc5cDZCRTBDNWdBWVlhSVZQa1FUQ2FBQUFjZXdURGxRbVlRa2taOGc5cEVTaWJyZDhSQzRZWGxOYWVQdTIyandyWUVlSGdhYWRod2pIL2lVa0NkcU1CMG5ZMEVaL1pmRkVQVGEvaGhPc1MxUnpBbG1tV2ZOTThyRjRnRWh5ZTZ5RTdLMW40elF1endXc1RQRjlMQkdld25xUWh2MEJ4aUw2MTRMenU3NXdLUW5vRzdReW5EQUFKUXNnU0NXdVMxMThhb1l2QVVhNUxUSkVMR0RKa3Vxd3V1MlJKeTZtaHdQL3EweXhONittM2p3ZnB6TnQ2bytCK2duZ0JWS2ZkVUw4ZStmRWFzelg0d3VVdW5PSk1JbGIzYWZlMDJybE93ZC8wcUhyYmNJVHp0WFpFeGYrc1QrTzhQUEt4ZzQ0b2ZEdUZ6eWVROWwxMUFJRHE2V0Rnb0I2RlVNY2FpVS82UGo2K0x4b3F6eTFoclFNYzl5bGo2eGFDeFVFSERpV2hMdW96dzJZeDJtWUdnMWlkUXJINFJWTzlaczlSblVTV2RwUjhXMDA5Qktyci9CNVVhUFk3OER0T084L1d1VElJTTdpNzI1N045MHI2bXlUNkZ4bzRYc09ZWi9qNFNCdnNHSE5KM0xGVGJQbnBCdVVKcmRsODM3Um5zSld1MWNmTXlsV0VucGRHcEo1ZWkwV1htaldBalN6NDNhQXNOYk9MWDZXazJKMTRCV3BwczdCNkZ3V3hnVk9pR20vekJYVkRmMERFMXczazdnWkUxT3dGQTdWR2M2NUhvTlR4dTBDbFZWbzR4MTUyUHBMNDlWcksrZlBBWmcxeHdidFp1UzcwaVNhbW55ZEhFY0w5NWNjeXR2VVIxaDRmcm1YNXE2SDJuTWdmMllab0J3UGpQN3Z0WHZ5YVIvSTdrZ1NtRG1GWGdPTG5maHdBY2ZNaThNeldSYzlPUHpFVlAwQ1pWNzVlNXJhR0NiWVBBOUJXSEY3N0tZV0RpUnYyRlZyTkhvNVRMMWlxTUhLYnNKcW03cVRRaTF1akdtZEc0a3hKb0VtckRrbVNsV1JxaWRaV25WbkxTR0R4Y2d3QW9jUjhLNnVab1JRMlR1RVIvWSttcXdPVkZOT2gxQjU1cWR0UWJ3cllPOFFZbWlWbkZyd3F4RUhDKzE2ZGZHUWVSVzRBdXYwNks3ZFAwNEovQ2FxWlZQUm1uU0Z1eGxPcTkweXJPanUrckVkUEYxbWxmV2JmdlRsdkYza1hteStkVm92d1BLUT0tLVRlek8xOW1UVnBOenhrRENKODNwUGc9PQ%3D%3D--d89e7e81847d7542002a95eaf7d6849cc203fd2b; datadome=SVArKbUjHUW_eLpU3YR~VDA7BPYPe137afXrro9~M7Jib7BEfEi~yJhDmEoaOXDS7u5BCAlj8E63rSnaAZZqjSLsu4lgbIH9Xp3PnvCBuKVq_4fd6sxOzZCq_aPKRgE0; banners_ui_state=PENDING",
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
