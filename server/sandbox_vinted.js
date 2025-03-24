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

// Affichage du tableau d'IDs
console.log("Liste des IDs :");
console.log(Lego_set_ids);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeVintedWithPagination(legoSetId) {
  let currentPage = 1;
  let totalResults = 0;
  const maxPages = 10; // Limite le nombre de pages pour éviter le blocage

  try {
      while (currentPage <= maxPages) {
          console.log(`Scraping page ${currentPage} for Lego Set ID: ${legoSetId}...`);

          const deals = await vinted.scrapeWithCookies(legoSetId, currentPage);

          if (deals && deals.length > 0) {
              totalResults += deals.length;
              allVintedDeals.push(...deals);

              console.log(`Found ${deals.length} new deals on page ${currentPage}`);

              // Sauvegarde dans un fichier séparé par ID
              fs.writeFileSync(
                  `./vinted-${legoSetId}.json`,
                  JSON.stringify(deals, null, 2),
                  'utf-8'
              );
          } else {
              console.log(`No more results for page ${currentPage}...`);
              break;
          }

          currentPage++;
          await delay(2000); // Pause de 2 secondes entre les requêtes
      }

      console.log(`Total results for Lego Set ID ${legoSetId}: ${totalResults}`);
  } catch (error) {
      console.error(`Error scraping Lego Set ID ${legoSetId}:`, error);
  }
}

// Scraper toutes les recherches LEGO en parallèle
async function scrapeAllLegoSets() {
  console.log(`Starting to scrape ${Lego_set_ids.length} Lego Set IDs...`);

  const scrapingTasks = Lego_set_ids.map(async (legoSetId) => {
      await scrapeVintedWithPagination(legoSetId);
  });

  // Lancer toutes les requêtes en parallèle
  await Promise.all(scrapingTasks);

  console.log("All scrapes completed!");

  if (allVintedDeals.length > 0) {
      fs.writeFileSync(
          './AllVinted.json',
          JSON.stringify(allVintedDeals, null, 2),
          'utf-8'
      );
      console.log(`All sales saved in AllVinted.json`);
  } else {
      console.log("No deals found to save.");
  }

  process.exit(0);
}

// Lancer le script automatiquement
scrapeAllLegoSets().catch(error => {
  console.error("Error during scraping:", error);
  process.exit(1);
});

