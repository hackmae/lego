/* eslint-disable no-console, no-process-exit */
const vinted = require('./websites/vinted');
const fs = require('fs');

// Lire le fichier AllDeals et extraire les IDs
const allDeals = JSON.parse(fs.readFileSync('./AllDeals.json', 'utf-8'));

const allVintedDeals = [];

// Récupération des IDs uniques depuis AllDeals
const Lego_set_ids = allDeals.map(deal => {
  const match = deal.title.match(/\b\d{4,6}\b/); // Cherche un ID LEGO (4 à 6 chiffres)
  return match ? match[0] : null;
}).filter(id => id !== null);

// Affichage du tableau d'IDs
console.log("Liste des IDs :");
console.log(Lego_set_ids);

// Fonction principale pour scraper une recherche Vinted
async function sandbox(legoSetId) {
  try {
    const url = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1739194586&search_text=${legoSetId}&catalog_ids=&size_ids=&brand_ids=&status_ids=&material_ids=`;

    console.log(`🕵️‍♂️ Scraping Vinted for Lego Set ID: ${legoSetId}...`);
    
    const deals = await vinted.scrapeWithCookies(legoSetId);

    if (deals && deals.length > 0) {
      console.log(`Found ${deals.length} deals for Lego Set ID: ${legoSetId}`);

      // Sauvegarde dans un fichier nommé automatiquement
      fs.writeFileSync(
        `./vinted-${legoSetId}.json`,
        JSON.stringify(deals, null, 2),
        'utf-8'
      );
      allVintedDeals.push(...deals);

      console.log(`Results saved in: ./vinted-${legoSetId}.json`);
    } else {
      console.log(`No deals found for Lego Set ID: ${legoSetId}`);
    }
  } catch (error) {
    console.error(`Error scraping Lego Set ID ${legoSetId}:`, error);
  }
}

// Boucle pour scraper tous les LEGO Set IDs (séquentiel)
async function scrapeAllLegoSets() {
  for (const legoSetId of Lego_set_ids) {
    console.log(`Starting scrape for Lego Set ID: ${legoSetId}`);
    await sandbox(legoSetId); // Scraper chaque ID un par un (séquentiel)
  }
  console.log("All scrapes completed!");


  if (allVintedDeals.length > 0) {
    fs.writeFileSync(
      './AllVinted.json',
      JSON.stringify(allVintedDeals, null, 2),
      'utf-8'
    );
    console.log(`✅ All sales saved in .AllVinted.json`);
  } else {
    console.log("❌ No deals found to save.");
  }

  process.exit(0);
}

// ✅ Lancer le scrape automatique
scrapeAllLegoSets().catch(error => {
  console.error("Error during scraping:", error);
  process.exit(1);
});
