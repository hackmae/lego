/* eslint-disable no-console, no-process-exit */
const vinted = require('./websites/vinted');
const fs = require('fs');
const path = require('path');

// Lire le fichier AllDeals et extraire les IDs
const allDeals = JSON.parse(fs.readFileSync('./AllDeals.json', 'utf-8'));

const allVintedDeals = [];

const Lego_set_ids = allDeals.map(deal => {
  let match = deal.title.match(/\((\d{4,6})\)/); // Priorité aux nombres entre parenthèses

  if (!match) {
    // Sinon, capturer le premier nombre de 4-6 chiffres disponible dans le texte
    match = deal.title.match(/\b\d{4,6}\b/);
  }

  return match ? match[1] || match[0] : null; // Prendre la valeur capturée
}).filter(id => id !== null); // Filtrer les résultats null

console.log("Liste des IDs :", Lego_set_ids);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeVintedWithPagination(legoSetId) {
  let currentPage = 1;
  let totalResults = 0;
  const maxPages = 10; // Limite de pages

  try {
    while (currentPage <= maxPages) {
      console.log(`Scraping page ${currentPage} for Lego Set ID: ${legoSetId}...`);

      const deals = await vinted.scrapeWithCookies(legoSetId, currentPage);

      if (deals && deals.length > 0) {
        totalResults += deals.length;
        allVintedDeals.push(...deals);

        console.log(`Found ${deals.length} deals on page ${currentPage}`);

        fs.writeFileSync(
          `./vinted-${legoSetId}.json`,
          JSON.stringify(deals, null, 2),
          'utf-8'
        );
      } else {
        console.log(`No more results at page ${currentPage}`);
        break;
      }

      currentPage++;
      await delay(1500); // Attendre 1.5 seconde entre les pages
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
    await delay(3000); // Attente entre les différents sets (3 secondes)
  }

  console.log("\nAll scrapes completed!");

  if (allVintedDeals.length > 0) {
    fs.writeFileSync(
      './AllVinted.json',
      JSON.stringify(allVintedDeals, null, 2),
      'utf-8'
    );
    console.log(`Saved ${allVintedDeals.length} total deals to AllVinted.json`);
  } else {
    console.log("No deals found.");
  }

  process.exit(0);
}

scrapeAllLegoSets().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
