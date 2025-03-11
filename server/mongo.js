const {MongoClient} = require('mongodb');
const dealabs = require('./websites/dealabs');
const vinted = require('./websites/vinted');
const fs = require('fs').promises;
const path = require('path');

const MONGODB_URI = 'mongodb+srv://Hackkmae:MANGOlogan159@hackmae.lzdgy.mongodb.net/?retryWrites=true&w=majority&appName=Hackmae';
const MONGODB_DB_NAME = 'Lego';


// Connexion à MongoDB
async function connectDB() {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB");
    return { db: client.db(MONGODB_DB_NAME), client };
}

// Fermer la connexion MongoDB
async function closeDB(client) {
    await client.close();
    console.log("MongoDB connection closed.");
}

// Charger un fichier JSON
async function loadJSON(filePath) {
    try {
        const data = await fs.readFile(path.join(__dirname, filePath), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
}

// Insérer les deals
async function insertDeals(db) {
    const deals = await loadJSON('Alldeals.json');
    if (!Array.isArray(deals) || deals.length === 0) {
        console.warn("No deals found in Alldeals.json!");
        return;
    }

    const collection = db.collection('deals');
    await collection.deleteMany({});
    const result = await collection.insertMany(deals);
    console.log(`Inserted ${result.insertedCount} deals from Alldeals.json`);
}

// Insérer les ventes
async function insertSales(db) {
    let sales = await loadJSON('AllVinted.json');

    if (!Array.isArray(sales) || sales.length === 0) {
        console.error("No vinted sales in AllVinted.json !");
        return;
    }

    const collection = db.collection('sales');
    await collection.deleteMany({});
    const result = await collection.insertMany(sales);
    console.log(`Inserted ${result.insertedCount} sales in MongoDB.`);
}

// Best dicount deals
async function findBestDiscountDeals(db) {
    const collection = db.collection('deals');
    const deals = await collection.find().sort({ discount: -1 }).toArray();
    console.log("Best discount deals:", deals);
}

// Most commented deals
async function findMostCommentedDeals(db) {
    const collection = db.collection('deals');
    const deals = await collection.find().sort({ comments: -1 }).toArray();
    console.log("Most commented deals:", deals);
}

// Deals by price
async function findDealsSortedByPrice(db) {
    const collection = db.collection('deals');
    const deals = await collection.find().sort({ price: 1 }).toArray();
    console.log("Deals sorted by price:", deals);
}

// Deals by date
async function findDealsSortedByDate(db) {
    const collection = db.collection('deals');
    const deals = await collection.find().sort({ published: -1 }).toArray();
    console.log("Deals sorted by date:", deals);
}


// Sales for a specific Lego Set
async function findSalesForLegoSet(db, legoSetId) {
    try {
        if (!legoSetId) {
            console.log("Invalid Lego Set ID provided.");
            return;
        }

        const collection = db.collection('sales');

        console.log(`Searching for sales with ID: ${legoSetId}...`);

        // Recherche basée sur le champ `id`
        const sales = await collection.find({ id: legoSetId }).limit(100).toArray(); 

        if (sales.length > 0) {
            console.log(`Found ${sales.length} sales for Lego Set ${legoSetId}:\n`);

            sales.forEach((sale, index) => {
                console.log(`--- Sale #${index + 1} ---`);
                console.log(`ID: ${sale.id}`);
                console.log(`Title: ${sale.title}`);
                console.log(`Price: ${sale.price}€`);
                console.log(`Published: ${sale.published}`);
                console.log(`Status: ${sale.status}`);
                console.log(`Link: ${sale.link}\n`);
            });

        } else {
            console.log(`No sales found for Lego Set ${legoSetId}.`);
        }
    } catch (error) {
        console.error(`Error finding sales for Lego Set ${legoSetId}:`, error);
    }
}





// Recent sales (< 3 weeks)
async function findRecentSales(db) {
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
    console.log("Last date acceptable for the search :", threeWeeksAgo);
    const collection = db.collection('sales');

    const sales = await collection.aggregate([
        {
            $addFields: {
                dateAsDate: {
                    $dateFromString: {
                        dateString: "$published", // Champ contenant la date
                        format: "%d/%m/%Y %H:%M:%S" // Format correspondant à tes dates
                    }
                }
            }
        },
        {
            $match: {
                dateAsDate: { $gte: threeWeeksAgo }
            }
        },
        {
            $sort: { dateAsDate: -1 }
        }
    ]).toArray();

    console.log("Sales (< 3 weeks) :", sales);
}



// Exécution principale
async function main() {
    const { db, client } = await connectDB();

    console.log("\n========== DATA INSERTION ==========\n");
    await insertDeals(db);
    await insertSales(db);

    console.log("\n========== BEST DEALS ==========\n");
    console.log("Best dicount :");
    await findBestDiscountDeals(db);

    console.log("\n========== MOST COMMENTED DEALS ==========\n");
    await findMostCommentedDeals(db);

    console.log("\n========== DEALS BY PRICE ==========\n");
    console.log(" Deals by price (ascending) :");
    await findDealsSortedByPrice(db);

    console.log("\n========== DEALS BY DATE ==========\n");
    console.log("Find deals by date (most recent first) :");
    await findDealsSortedByDate(db);

    const legoSetId = "42182";
    console.log(`\n========== VENTES POUR LE LEGO SET ${legoSetId} ==========\n`);
    console.log(` Trouver toutes les ventes pour le Lego Set ID: ${legoSetId}`);
    await findSalesForLegoSet(db, legoSetId);

    console.log("\n========== RECENT SALES (< 3 weeks) ==========\n");
    await findRecentSales(db);

    await closeDB(client);
}

main().catch(console.error);
