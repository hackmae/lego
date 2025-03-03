const {MongoClient} = require('mongodb');
const fs = require('fs').promises;
const path = require('path');

const MONGODB_URI = 'mongodb+srv://Hackkmae:MANGOlogan159@hackmae.lzdgy.mongodb.net/?retryWrites=true&w=majority&appName=Hackmae';
const MONGODB_DB_NAME = 'Lego';


// 🔹 Connexion à MongoDB
async function connectDB() {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB");
    return { db: client.db(MONGODB_DB_NAME), client };
}

// 🔹 Fermer la connexion MongoDB
async function closeDB(client) {
    await client.close();
    console.log("🔴 MongoDB connection closed.");
}

// 🔹 Charger un fichier JSON
async function loadJSON(filePath) {
    try {
        const data = await fs.readFile(path.join(__dirname, filePath), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`❌ Error reading ${filePath}:`, error);
        return [];
    }
}

// 🔹 Insérer les deals
async function insertDeals(db) {
    const deals = await loadJSON('Alldeals.json');
    if (!Array.isArray(deals) || deals.length === 0) {
        console.warn("⚠️ No deals found in Alldeals.json!");
        return;
    }

    const collection = db.collection('deals');
    await collection.deleteMany({});
    const result = await collection.insertMany(deals);
    console.log(`✅ Inserted ${result.insertedCount} deals from Alldeals.json`);
}

// 🔹 Insérer les ventes avec les dates au format ISODate
async function insertSales(db) {
    let sales = await loadJSON('AllVinted.json');

    console.log("🔍 Données brutes de AllVinted.json :", sales);

    if (!Array.isArray(sales) || sales.length === 0) {
        console.error("❌ Aucune vente trouvée dans AllVinted.json !");
        return;
    }

    // 📆 Vérifier et convertir la date si nécessaire
    sales = sales.map(sale => ({
        ...sale,
        date: new Date(sale.published)  // Déjà au format ISO 8601, conversion directe
    }));

    console.log("📆 Ventes avec dates converties :", sales);

    const collection = db.collection('sales');
    await collection.deleteMany({});
    const result = await collection.insertMany(sales);
    console.log(`✅ Inséré ${result.insertedCount} ventes dans MongoDB.`);
}

// 🔹 Trouver les meilleures réductions
async function findBestDiscountDeals(db) {
    const collection = db.collection('deals');
    const deals = await collection.find().sort({ discount: -1 }).toArray();
    console.log("🔥 Best discount deals:", deals);
}

// 🔹 Trouver les deals les plus commentés
async function findMostCommentedDeals(db) {
    const collection = db.collection('deals');
    const deals = await collection.find().sort({ comments: -1 }).toArray();
    console.log("💬 Most commented deals:", deals);
}

// 🔹 Trier les deals par prix
async function findDealsSortedByPrice(db) {
    const collection = db.collection('deals');
    const deals = await collection.find().sort({ price: 1 }).toArray();
    console.log("💰 Deals sorted by price:", deals);
}

// 🔹 Trier les deals par date
async function findDealsSortedByDate(db) {
    const collection = db.collection('deals');
    const deals = await collection.find().sort({ date: -1 }).toArray();
    console.log("📆 Deals sorted by date:", deals);
}

// 🔹 Trouver les ventes pour un Lego spécifique
async function findSalesForLegoSet(db, legoSetId) {
    const collection = db.collection('sales');
    const sales = await collection.find({ legoSetId }).toArray();
    console.log(`🏷️ Sales for Lego Set ${legoSetId}:`, sales);
}

// 🔹 Trouver les ventes récentes (< 3 semaines)
async function findRecentSales(db) {
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

    console.log("📆 Date limite pour la recherche :", threeWeeksAgo);

    const collection = db.collection('sales');

    // Afficher toutes les ventes triées par date
    const allSales = await collection.find().sort({ date: -1 }).toArray();
    console.log("📊 Toutes les ventes triées par date :", allSales);

    // Filtrer les ventes < 3 semaines
    const sales = await collection.find({ date: { $gte: threeWeeksAgo } }).toArray();
    console.log("📊 Ventes trouvées (< 3 semaines) :", sales);
}

// 🔹 Exécution principale
async function main() {
    const { db, client } = await connectDB();

    console.log("\n========== 🟢 INSERTION DES DONNÉES 🟢 ==========\n");
    await insertDeals(db);
    await insertSales(db);

    console.log("\n========== 🔥 MEILLEURES OFFRES 🔥 ==========\n");
    console.log("🔍 📉 Trouver les meilleures réductions :");
    await findBestDiscountDeals(db);

    console.log("\n========== 💬 DEALS LES PLUS COMMENTÉS 💬 ==========\n");
    console.log("🔍 💬 Trouver les deals avec le plus de commentaires :");
    await findMostCommentedDeals(db);

    console.log("\n========== 💰 DEALS TRIÉS PAR PRIX 💰 ==========\n");
    console.log("🔍 💲 Trouver les deals triés par prix croissant :");
    await findDealsSortedByPrice(db);

    console.log("\n========== ⏳ DEALS TRIÉS PAR DATE ⏳ ==========\n");
    console.log("🔍 📆 Trouver les deals triés par date (les plus récents en premier) :");
    await findDealsSortedByDate(db);

    const legoSetId = "42156";
    console.log(`\n========== 🏷️ VENTES POUR LE LEGO SET ${legoSetId} 🏷️ ==========\n`);
    console.log(`🔍 🏷️ Trouver toutes les ventes pour le Lego Set ID: ${legoSetId}`);
    await findSalesForLegoSet(db, legoSetId);

    console.log("\n========== ⏳ VENTES RÉCENTES (< 3 SEMAINES) ⏳ ==========\n");
    console.log("🔍 🆕 Trouver les ventes ajoutées il y a moins de 3 semaines :");
    await findRecentSales(db);

    await closeDB(client);
}

main().catch(console.error);
