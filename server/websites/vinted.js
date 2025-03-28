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
          "cookie": "v_udt=OGIzVm1ORlkwRzl2NW5VMXJ5VFN3ZTJjNCtXaS0tTFI1bkQ3VW5xUGdGK1E2Yy0tdUVkQUdoakd5TlNMSUFhWHBHRjVxZz09; anonymous-locale=fr; anon_id=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b; OptanonAlertBoxClosed=2025-03-03T13:12:49.731Z; eupubconsent-v2=CQNsN1gQNsN1gAcABBENBfFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSgAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBLACaAFGAK0AYYAygBogDZAHeAPaAfYB-wEUARgAoIBVwCxAFzALyAYoA2gBuADiAHUAQ6Ai8BIgCZAE7AKHAUfApoCmwFWALFAWwAuABcgC7QF3gLzAX0Aw0BjwDJAGTgMqgZYBlwDOQGqgNYAbeA3UBxYDkwHLgPHAe0A-sCAIELSABMABAAaABzgFiAR6Am0BSYC8gGpgNsAbcA58B5QD4gH7AQPAgwBBsCFZCA4AAsACgALgAqgBcADEAG8APQAjgB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; v_sid=144fa49d-1742809745; datadome=_HeE4TVR25k4knLkOIy0w6gXqtqIsTiRwyUwm~BteDMJLbC2yChnjNBc_BKoWX9Kvkt8qSgxAAACK2B9ZHTjpaCuGWCyhkzBWvJmoyqZd0dStqTAQkA6phfdgRX7ePTw; __cf_bm=Uwip.1WH3teRODG_esC481g0CpqOn6SLMmcCKQgpLew-1743154596-1.0.1.1-0JwGnU4V417DpnXiqDuLDKNWwHInZoKnaZxp1qTjGK1qdFib8Xl2v9DcCd.Afh5rpaBhDg80cQWDAhQ2UZ2AYsRrx9Qt2PSzLQUmcDwP.jguyTg9Bdi1zHwseda4f6JD; cf_clearance=ujDgEHz5miXOgRJ2aNGwK0KYfEEfj4kOFS2KC.Ezg_4-1743154604-1.2.1.1-K6JHdQfLwL45ev_1lcpK6j2jw5pdyGrSyfgmKpMxZvrpdNDwhynuLiDv.W8J9BPrkv2ZTcApKXyfG24X3Ff8F6CgHyhiFPhhvk9RuGI1tJjhDD6B1vMJ.4VTF3wDEiHsPk1qFe3MyCg1vg6PxgqBBjAP9DCkKTQDsGW7c1iue0L1VKhHRgNkVfDsn5WBWqy1xE8C6gfoHOxHCzLIVwAFkt7az9tXfbG0iPElRJyEH7gV.NK7VDf1rnpCwTjUH3F9YDiOviwA141Exsd7BBawyqJDkjF0Hew4aL3oCjbQPSx.fDyNGGzaGQptlTBbFFe_HiFaSz2s6s8olI_W.fCPR4rTGv8K0AqElfb6XSVhamo; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzMTU0NjA0LCJzaWQiOiIxNDRmYTQ5ZC0xNzQyODA5NzQ1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDMxNjE4MDQsInB1cnBvc2UiOiJhY2Nlc3MifQ.Shh4v86NLGhjkstj58DPcjAIhnRfXJpykeZqHD3Wcoq0ktJVIRJlQv2urLqf86pzJF-0XgdujN61WTM-YP6aizaLsIKLKop_ZV11uxaka20Luv-ESDC6J0-dN10p0n2OouKZ3aJmEr1C4mQxIfaF-XZ6q7Hb56bGAB4_qMSgjm06H_Cpwl2w0nowi0HW-zMr8ZLvzfcYNYXOoEovM0H12p3j-VZkN4Cd3BnosFxn5vZyu4eOR0Pu_9J8-jIW4-ce8uSTfguC3q8Vio1nCjM4MxjUiyV1G63FjDcs41Wn7oGdC44vtCqcgxOvhUyC-5Qso97K8wirfk72PUjHd9YN7A; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzMTU0NjA0LCJzaWQiOiIxNDRmYTQ5ZC0xNzQyODA5NzQ1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM3NTk0MDQsInB1cnBvc2UiOiJyZWZyZXNoIn0.Y0Cw5KGCdjS9XHV-MDqgiikBvNTKgHTtuzqzOQ_mfBiTWrgx6h9GSStgCXknqMTVuV_hUB1iHVMOKbhJoEaPxDKnChiibzh7xhdEj5ZVxqCMBxzZo1PcF-hWii4wPcQnH8hA2ldEKdgrHaWByD0_AxM9RHzjoFBr8cETGP85OQWFglPbgsMvVyOfabG4V48cMh84-nPgbVenuFChKQiOuTsKIL3iFUEc4UC9nT8eN_wp88rZPGkIe6jGAaVcRVE3DrMouHLoWhISvgYEZIg8kB9kYBq8qmYizcjheNvNtkEbItHks4HMlucB3chGhbjKNkiWkfxuvX9UnJCoQY0k8g; viewport_size=978; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Mar+28+2025+10%3A36%3A59+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b&interactionCount=82&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&AwaitingReconsent=false&geolocation=FR%3B; _vinted_fr_session=UmZPVStQbHp0V29Jb1QyUThxVXRLWEhuZ2dwTThOM0lDOFQ2NCtvcmMrTklnbXcySk80SVU1Vmx6c2IwRUtXZWt6SDNNUDFFVW1nNnRGamVSb0tDM0Y1ZWFyOWJNWS9LOE4rM0xacnRWNnhZalQ4N2s4akF6VitzQ2NNYWs4WHZrUExvWXkzaFQwN2Y4S1ZoS001TUR3eXl0S1VnUzNtVFRzbUNKT1A0cGRVTzEwTncySkl4R3RBcjB5a0V0ZmhzZXBtUFoxbEo2bVUwVmVqQ3R0WERBNUU0WWpVblo0RCs5c0VYaDV2RGZuc29YNE81eER3U3lDRzZ4cTFZZ0JMWTlYMVRtNmlQTkRTRjJHSkZoVFcwK0hjUXFIdkcrUVNhUnVqK3FhcFVRalAzQTZobEhIWkZYNFAzNDl2Yk9nKzhDenE0clhHbUtmL1d4UW4rVm9QbmcvU3dsTTExNld6UWpVNFkvalJ3d3k1QnczUXVpQ3Nsa1EzeWQ3aVg5V09TMm9CM0xUWnI3ZnJBcy9zRC9WZkZmNitkRGxMNklEKzBBTjhCMFhzZXdXUmY3cUt5b1J2NmtidjN1Z1ZBejZkOXRvR3Z3cEVEYzJZUHZ1RFJTVlA1akJtRXljUUNNUFR6YjRrLy9HL3ZuMzZTanZUQitkM3J3WFAzMDFTekEzWXZMNjh2UkdXbjhlM2l3MmtvbHErakZweDVaWnIzK1FVdFNyK092QWFqVHNMbUZMT2dEYS9lWFVhSlY0RmhXcndSSEFEUThXU2JSYlFqVENLaGYzZXhWcS84NmpxSWc4S1RJZG5nT210ZDZtSFFnNkZDMUV4empVQWhGUUhXbGRmUXhiK0FGejFXWXRZa09zbXZZU25uQ2tXODJIemJqQkxWZTdnd2xCMlRNc08yZlNGcjhMSkRjMklZUzBZUVNOOWpHeFk1aGRMZHF4UUpBeWFzUGxlc2lyd3FqSHhJbXQvb29MV1kvQnFMMTdVaE13eW9pT0ZBTEZuRWQyU2pMSm5xa09QbzQyZExjY01RSk5rTGRWaHUyQ1hVbTgvc1R6SWlIdmR5M0hpZHVPVWxsQ2xYWTdJTDcrNGRpeDJOQk5qVGk5MFc2NFRlZEhURU1ucTQyNkFKdmxsZktCMkhOK1V3eGwvUGxzOGpyV0ZrcGZsL0xvS2dmbWdEbXIwQm9HRWdsTkJBcWVxb2J5Qk1hbmhSV25wL2hhQUhibm5nY1pUUzBPVE41NTVlRXVRQjBZVzdxd3cyZVdsdHJDYjlaMU9FTnBOUHRReE95SFl2OE5qNGE0ZVZUbXVlV0I3WWRIaHhUVkhGS2F3akl3R3VZeVhmYWlBR2FGWlJPRkIxd3UydmtrbThXM1ozUnQ1MHFubGUwa29rdHpKRWZZYXltTVgxNVdoN1I2ZnhRbTZiRmc3dTZ1RGFxem50ZDd4dDE0ZjJISVhRRHhUVkxKVld3aG9YbUxPR2tOVWhhY1NjeHZvRjVJbURLc2cyM29Ld1pZaVhHMS9QM1d2YkZaQ0M3cHR5QjVVUmU4emY3OEl4ckErcFlkVi9OOEJHaXJtZzBMQjh2dFNsYzBGRktzcWZEZWtjeWtrbjc5MnFaM3lET2dmYm5Sbkc3SVZBNVNXQnRVdktBb1JkeGVGZ2pYSmM3OUVZbGdWMjhDR1hUS0laOWt2MTRVcGp5eHhnSUxVR25WbTYwcndheVJJb01wZXR5dkwwamJINjBQUkkwYUpnOTdUdE5ZZ21KV1NVek10NHU1NW9JRkxnSHViTXE4VitPd3Q1UnZwWDl5TnMwVUppU3pLOFVqT1ozRFNxUFFKUXp3VjdIRzhlQVZlM2JjM2U2WmwwZW5rYzZIUGd6aG1RSzkyWEhhY2gwVk1tYTlPNlN2WFc1YkhzWFBVbjhvak5XTlRzUkUwTW5iNFVtcXQzbjVEd3E0NS9qU0JEOEswUjBtWW1vOFdrbXIwQjVkSjF0dWgvUmRFY3lJL0FIeEFVM0JOb0NaOGhKT1lscFI2SG5TNld5OGZobFBqZ3oxQnJRcmxOUWVUZk1abDFZd3Z4UzdRMEtQMzFIRFZqMmlDSDdWMU9oRlU1bmZuUDl5cEdUM3l2clQ3TS9uOElRT3ZNdHJNTFZGa1IyanB5czhrc3ZHRERnYUMwOTlDYWtPK1duZS82VUkzRjlQcCtUbXZCSUpSNS8wVDhXbXFDdHZuRUhrOUhhMkt5QVZndHl1QzM4R2o3ZmxsZjRmdWUraVkxKzFNZFBQWmJYR29TQlg1WHNWSWdJQnd2cTIvNFlBenZPeWZ6cnFtRnk3NUNqdEVqc2lPdUkrVlAyNHpCaEltQUExYmFFYXBFTmY0TlM4a2crTGpycjVaY3VGOUh3YWUxeXc0Vy0tWW5FS0pIOFFrTkoyUGlPZEkzSmRXQT09--7390620692ed83ba0efa4c15333a1f7888f4164a; banners_ui_state=PENDING",
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
