/* eslint-disable no-console, no-process-exit */
const vinted = require('./websites/vinted');
const fs = require('fs');

// ✅ Tableau des LEGO Set IDs
const Lego_set_ids = [
    '42182', '60363', '43231', '75403',
    '75404', '21034', '42635', '75405',
    '76266', '42176', '42635', '71460',
    '42202', '40524', '75402', '76262',
    '77051', '71387', '76303', '21333',
    '43224', '10363', '60373', '72032',
    '75332', '76959', '76969', '40460'
];

// ✅ Fonction principale pour scraper une recherche Vinted
async function sandbox(legoSetId) {
  try {
    const url = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1739194586&search_text=${legoSetId}&catalog_ids=&size_ids=&brand_ids=&status_ids=&material_ids=`;

    console.log(`🕵️‍♂️ Scraping Vinted for Lego Set ID: ${legoSetId}...`);
    
    const deals = await vinted.scrapeWithCookies(legoSetId);

    if (deals && deals.length > 0) {
      console.log(`✅ Found ${deals.length} deals for Lego Set ID: ${legoSetId}`);

      // ✅ Sauvegarde dans un fichier nommé automatiquement
      fs.writeFileSync(
        `./data/vinted-${legoSetId}.json`,
        JSON.stringify(deals, null, 2),
        'utf-8'
      );

      console.log(`✅ Results saved in: ./data/vinted-${legoSetId}.json`);
    } else {
      console.log(`⚠️ No deals found for Lego Set ID: ${legoSetId}`);
    }
  } catch (error) {
    console.error(`❌ Error scraping Lego Set ID ${legoSetId}:`, error);
  }
}

// ✅ Boucle pour scraper tous les LEGO Set IDs (séquentiel)
async function scrapeAllLegoSets() {
  for (const legoSetId of Lego_set_ids) {
    console.log(`🚀 Starting scrape for Lego Set ID: ${legoSetId}`);
    await sandbox(legoSetId); // Scraper chaque ID un par un (séquentiel)
  }
  console.log("✅ All scrapes completed!");
  process.exit(0);
}

// ✅ Lancer le scrape automatique
scrapeAllLegoSets().catch(error => {
  console.error("❌ Error during scraping:", error);
  process.exit(1);
});
