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
          "cookie": "v_udt=OGIzVm1ORlkwRzl2NW5VMXJ5VFN3ZTJjNCtXaS0tTFI1bkQ3VW5xUGdGK1E2Yy0tdUVkQUdoakd5TlNMSUFhWHBHRjVxZz09; anonymous-locale=fr; anon_id=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b; OptanonAlertBoxClosed=2025-03-03T13:12:49.731Z; eupubconsent-v2=CQNsN1gQNsN1gAcABBENBfFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSgAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBLACaAFGAK0AYYAygBogDZAHeAPaAfYB-wEUARgAoIBVwCxAFzALyAYoA2gBuADiAHUAQ6Ai8BIgCZAE7AKHAUfApoCmwFWALFAWwAuABcgC7QF3gLzAX0Aw0BjwDJAGTgMqgZYBlwDOQGqgNYAbeA3UBxYDkwHLgPHAe0A-sCAIELSABMABAAaABzgFiAR6Am0BSYC8gGpgNsAbcA58B5QD4gH7AQPAgwBBsCFZCA4AAsACgALgAqgBcADEAG8APQAjgB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; v_sid=f206de2a-1741007565; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNzAzODA1LCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDE3MTEwMDQsInB1cnBvc2UiOiJhY2Nlc3MifQ.wLPlhevO2M5mQxrTVA5LZVEBePTCz8PccqVuszvExNsEHZ5y6pL2gQW0zu7Brp55nlN3bmOOokgr2YbmqEVAz6244sVH2dz6p3-APw7E1zD57SQ_wf0l_smGMuEyWCZgCRho4Iz2oFPeq9r2nw8w_2lIVzI302khgMPUudU_Ei7-AsSq0a8gwAVzgiGdPDVOd7GuzDdwkHfZkLY9gEhcwS0ULJY-FZQ1-Kcy4bm-P2_ciLS6fFnlTI1trMlcJqeeXwZ7bwCuhTA_l6qr8LIn4IKkKssDmwFSCqlB9GSAYCR2PICtLxWz8DETiC-g0tzWIJyHXcMAd9g1VU7Xw7R3sA; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNzAzODA1LCJzaWQiOiJmMjA2ZGUyYS0xNzQxMDA3NTY1Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDIzMDg2MDUsInB1cnBvc2UiOiJyZWZyZXNoIn0.rZP3Ob76nMWLIzKN4k5Te26G-SID373ANx2KmXgeUZ2wo_QnGGs51yFmD9xhkQurcq7VxlgMC7XFHllfeilUpgeSop0VabgQ7i-4dLuhj-2h6xd8lVMwX3Tf2igWhJAV4aGpyni_52HfLZOq-LxzsyUMpni85m3FM5C76dj5ITjTjdNcBZtuYqvFjEq19zZIbNcGrJjJF07kgukespc3Wqtc4xHT5FIfonuK26A6TGC-wdTYL90kQFBA0IJsyL0Drfi1lbCCd4hlUxqLV-BnXmu4Ng9EVABs_Kwaj3Kuki6d3qSuTo-o3QS4ev6M7jkZP6Am6IBf4wwv4qLldRHCfg; __cf_bm=Gk2b2w4Sz70uqQk9s8_HuCMq_NZldyaXbqPLK3qtTgk-1741706137-1.0.1.1-dET6c37OxtYuJ1LIENQHTFfd1qmtdo0AR0vBhpg8I9VgN5gaSpKcCmaDCStcJYJC4xOK9Rfifo6ApbW1vWYpVRxWijRdaX.Xa0N31a2IT0I9yLcytUpxXXqoDl8I_nKy; cf_clearance=hGwazdswsLvnOEi5PaseUB.ra2RuhOeJapJJczSDc7c-1741706137-1.2.1.1-oYASc6wpEVx_ejb3KvLNOtRuc.qYSL4LMVisBvKYXkmdswM5bNP7vYIAcGm7ybAdoEU1pFQ.xQg5CzATTKQslCWwwT6DlldH70ECw1IBKPizI4k.VaRQgKcO0F2SwQYkNcQt3uUJqzERWDwL197mLvVd4rPCHAJKMptJNJmic8SfvY9YnKhalXuYUJ98NXGgTCOy7ePVlr9IjodO.8DohIKpP3_SNQyXP4nMrORAZISapGm6R_PCEC6cH5la8ifxuNp32K_zEvXc8mUuxP6uy_3xwQJDbNg4fM.rf.t9AMbymJeMX9M6TnO.kT1sWDm.DiQzQImHZpIOqEX1HVP_mKyGDFCCALCDB8rjdCuc8x0; datadome=JxXuW58gpejgzgYeOHbEZJKy~zfShkZO0eytnsw6NZ0clov9g7GI~Z0huRbr6S5VukHInzvYHHVxnh0Ml3scii5JwglHGEAAvxmh4AzdjuFap6BfkVEQDFpTatfPwgWe; viewport_size=834; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Mar+11+2025+16%3A15%3A48+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=cc975c7f-3923-4011-a5a5-0d8c9b4d5b0b&interactionCount=45&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&AwaitingReconsent=false&geolocation=FR%3B; _vinted_fr_session=dmtEQjY2M1dTamxiVHpSUTlyQmk0YVIrSWh0bVQ0cThVNjFrUHhIZVdiYm15RGM1YnQwRDhOOEdIOHljZ01oZ1JPSldVMElPeUg1Ykk3dkh5TjdUNW5Gc2czb0NtcFd5K1E4cHZWU0djK1dmUEoydnA0c2JUcVVhWUx4TlpmcGUxc0NOd1ZOelJzb3VsVlhPb2xqYjVVbDJZSGpNM1ZEN2JGUU5LL0dpLzRpTGJpSk9TbFlwSzFMM0hhLzVvam9WSk5MWUpYVDlsL1FBVStXSmR2bTlRU2gxdkNZSDJWelU5bVp3WjBMdVVaWW1heDZSdHZIaFV1WFkzVVNkT0tQaGgxUWZrVzhidGVZbDNGV3NLSWlIckxkUXVxZTE5V0dOTkExYkp2YW1sZmVobDJuOFVmRmN0ODZFeHhDV01ITGtpTFJBYlRucWVSWU50VWJ4SUl2ZS96VmFjeEhxQ0k2UnVjNHVUZTVtUkErbmcyaXd4UEdmRWtCUzJ4cHo5dER3dzVuWnp6R0dFWWkxcVQxaHQzK2c3K2dLd1FjVk9sYU8yLzFFV1VoMDB1V2NIZ2Y3aHNKY1U5ZDNFVUsrMFNCcHRzUVh2Y1hpazhSK1BQczFDcUR1OWJadFFXTEJrNzFKWThKcFpUNnlpQVpQWThBcWY5RWpsWk5UN0tpbm9PZUZWbjNWd2hXUDFPaDZ4SnZHb3BaMEJJaE9kOTRZSmxNQTJDMmN0aGdTMkh1SE51bjAveHg4azZOVTJMcnRVaGZHdkdvSm1VRERySXMvZitxY1MxUmFaYW1rdFBFVmUvZk5jWVZHNW1YczZWOEpPNDBKaWFHNDF0NUNPT3JucjA5clFWZ2dnOE9QNzBOSGhjNXBORDlDWnFyeXJBdFFQQTZUekczTW91NERpbVMxaXVpaVBZSmN6STB3aTR0RVFzRlhrL1F5U1JndTcxc3VYOGNrbzVuMFNLbUUyYmFhYlBENjNZV3RqREcyTTJPUEFMcmtXcTYzaWluRnYwaEREN3ZZdllJQS9IbzI3RGR2WDg5Y3oxc0s2K0dhMTZMbXArSktsRmdaTWJFa2xHelNKeTdnOWZ2MzZBZEU4b2lyM1JaSjFzSXd2RVNCdXpZalo2VkhNMzJESzY1V2tGMDYyYTdZRXFNSGFkVTFUT29DVkpHcGppRm5vMzZBZlgwakE1ejQyTHBVODNHL2NFRXM1eitmaERrRXNwb1NkeG9DWXYyZWIvOVJ2Q2YyekRra1ptU0ZmbC9QazhpOXdhdWp5a2hYUUxLZ3pLb2dqTUVsUlNaNlYxd2RKT3puT3dpOTZaSE1yeW9lZ0hlVm9YMDZDOWFuNUhxRHVpeEJEUzZQZEttNWRHc0FxRWVKZVZRcWN0OFRJcVI2MlJ4aFBUbTYwT2NobVppZlFtNkJwb2FNRWRuMEhTN2FEYlJ6Y0d6VlNSSjJndEZEWXFnOGhlUk9EZlcwbit5aTBMYWJjbkFTSnNCaytlaWRxZW13VElXWXlrdXB4cUdpdk1ZZk5jcGl1Wm9salBFMmpka0JUcmpxY0h2SUdockJHT2t3WGRPckxKaCtxc3dzUERlMVBVSDJkUVdCNFY5ZnRxeXFiY2F6dmg4QXRDYUlISHVNVThzc0trb3doSjBhQ1ZGVXFSRXdUaUxSc1JjZUd5eGREYkZBZDJreGwwN1NIYm9UbmlpRm9EL0x6M1R6NDViWjF3UWdjQlNjTjJJaXhmRTU0VGs0d1pJMGdLbllIK0RlN2xLci9UcTNIQUFhWHJURHQxOUFXaCtxRUVEQnhvK3gyVHBONDF4VzNvNkt1UUJWUGV0dzB1THoyT3VMYzBFOUdjSVNZMUFVUDFGbDgrcTU1OXNBNkN3Z0JTdHhZdjREd2M4RnpHcW9MeEFaT0pLREZTOG5RTVVqUXF1cHp4S0d3MW9XUVFrNHVrVDRIdUo2M1IyNmRQb1BoV29FeTE2V20yVW01YkFEZ204OWdjN3dRUGdxYXpJTVQrOE4zUjhrTlZ4UWFOWHdSem9pUnkrWHZnMU02SzNXQjU0U1ZXamNINml4OSt6MUc4N3JzZkJJZEhzTGdiMHR1ZmczUklqb2FVNGluVGM3MitRdURsRnVVWlVuZnp6YlhMUnFNcldlQmxGbXpaOCtwV1NOZTRvVmdNdTB3Z0MwY0JTdkQrU2JBSXJ2U21ZSDFNNWltUy81RGtzUDJ1QTRQY0VIRGE5dVpEWjJ0TENHUnFSdmhrcDA1L3phRDNNZ3ZjYlY4ZmVaZ0JkNXhaU2xaQU5LbHBOdlg3N3k3am94YnpmVzZYL3VCdzcvV2JlMjRKREgydzZpVTVXVTl3bkVObkZzTVNBRlBxUmVrZnpPcnJiNXV2ckhQVkJBQUdZTi0tei92ZjB1a0dwQVZlSkNtdW04Y3Aydz09--43637ef4acb5cef9e9eb6183abfb4534e8f2d1be; banners_ui_state=PENDING",
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
        'id': IdLego,
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
