/* eslint-disable no-console, no-process-exit */
const vinted = require('./websites/vinted');
const fs = require('fs');
const path = require('path');

const allDeals = JSON.parse(fs.readFileSync('./AllDeals.json', 'utf-8'));
const allVintedDeals = [];

const Lego_set_ids = allDeals.map(deal => {
  let match = deal.title.match(/\((\d{4,6})\)/);
  if (!match) match = deal.title.match(/\b\d{4,6}\b/);
  return match ? match[1] || match[0] : null;
}).filter(id => id !== null);

console.log("Liste des IDs :", Lego_set_ids);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const seenLinks = new Set(); // Pour éviter les doublons globaux

async function scrapeVintedWithPagination(legoSetId) {
  let currentPage = 1;
  let totalResults = 0;
  const maxPages = 10;

  try {
    while (currentPage <= maxPages) {
      console.log(`Scraping page ${currentPage} for Lego Set ID: ${legoSetId}...`);

      const deals = await vinted.scrapeWithCookies(legoSetId, currentPage);

      if (deals && deals.length > 0) {
        const uniqueDeals = deals.filter(deal => {
          if (seenLinks.has(deal.link)) return false;
          seenLinks.add(deal.link);
          return true;
        });

        totalResults += uniqueDeals.length;
        allVintedDeals.push(...uniqueDeals);

        fs.writeFileSync(
          `./vinted-${legoSetId}.json`,
          JSON.stringify(uniqueDeals, null, 2),
          'utf-8'
        );

        console.log(`Added ${uniqueDeals.length} new deals on page ${currentPage}`);
      } else {
        console.log(`No more results at page ${currentPage}`);
        break;
      }

      currentPage++;
      await delay(1500);
    }

    console.log(`Total results for ${legoSetId}: ${totalResults}`);
  } catch (error) {
    console.error(`Error scraping ${legoSetId}:`, error);
  }
}

async function scrapeAllLegoSets() {
  console.log(`Starting to scrape ${Lego_set_ids.length} Lego Set IDs...\n`);

  for (const id of Lego_set_ids) {
    console.log(`Scraping for Lego Set: ${id}`);
    await scrapeVintedWithPagination(id);
    await delay(3000);
  }

  console.log("\nAll scrapes completed!");

  if (allVintedDeals.length > 0) {
    fs.writeFileSync(
      './AllVinted.json',
      JSON.stringify(allVintedDeals, null, 2),
      'utf-8'
    );
    console.log(`Saved ${allVintedDeals.length} unique deals to AllVinted.json`);
  } else {
    console.log("No deals found.");
  }

  process.exit(0);
}

scrapeAllLegoSets().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
