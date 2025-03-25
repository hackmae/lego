// 🚀 Activer le mode strict
'use strict';

// ✅ Nouvelle API
const API_URL = 'https://server-six-blond-36.vercel.app/deals/search';

// 🌍 Variables Globales
let currentDeals = [];
let currentPagination = {};
let isLoading = false;

// 🟢 Sélecteurs DOM
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals = document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');

// ✅ Fonction pour afficher le loader
const showLoader = () => {
  sectionDeals.innerHTML = '<p>Loading deals...</p>';
};

// ✅ Fonction pour masquer le loader
const hideLoader = () => {
  sectionDeals.innerHTML = '';
};

/**
 * 🌟 Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({ result, meta }) => {
  currentDeals = result || [];
  currentPagination = meta || {};
};

/**
 * 🌟 Fetch deals from API
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=6] - size of the page
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    if (isLoading) return;
    isLoading = true;

    showLoader();

    const offset = (page - 1) * size;
    console.log(`🚀 Fetching deals from page=${page}, size=${size}, offset=${offset}`);

    const url = `${API_URL}?limit=${size}&offset=${offset}`;
    console.log(`➡️ Fetching from URL: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`❌ API responded with status: ${response.status}`);
    }

    const body = await response.json();

    if (!body.results) {
      console.warn('⚠️ No deals returned from the API');
      return { currentDeals: [], currentPagination: {} };
    }

    isLoading = false;
    hideLoader();

    return {
      currentDeals: body.results,
      currentPagination: {
        currentPage: page,
        pageSize: size,
        totalItems: body.total,
        pageCount: Math.ceil(body.total / size) // ✅ Recalcul dynamique du nombre de pages
      }
    };
  } catch (error) {
    console.error('❌ Error fetching deals:', error);
    isLoading = false;
    hideLoader();
    return { currentDeals: [], currentPagination: {} };
  }
};

/**
 * 🌟 Render list of deals
 * @param  {Array} deals
 */
const renderDeals = (deals) => {
  console.log('🔎 Rendering deals:', deals);

  if (!deals || deals.length === 0) {
    sectionDeals.innerHTML = '<h2>Deals</h2><p>No deals found.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'deals-container';

  deals.forEach(deal => {
    const id = deal.id || 'N/A';
    const title = deal.title || 'Unknown Title';
    const price = deal.price ? `${deal.price.toFixed(2)} €` : 'N/A';
    const link = deal.link || '#';
    const date = deal.published ? new Date(deal.published).toLocaleDateString() : 'Unknown Date';

    // ✅ Gestion d'image par défaut
    let image = deal.image || 'placeholder.png';
    image = image.replace(/\$\{[^}]+\}/g, '');

    const dealCard = document.createElement('div');
    dealCard.className = 'deal';

    dealCard.innerHTML = `
      <img 
        src="${image}" 
        alt="${title}" 
        onerror="this.src='placeholder.png';"
      >
      <h3>${title}</h3>
      <p><span class="highlight">ID:</span> ${id}</p>
      <p><span class="highlight">Price:</span> ${price}</p>
      <p><span class="highlight">Date:</span> ${date}</p>
      <span class="favorite-deal">★</span>
      <a href="${link}" target="_blank">➡️ Open Deal</a>
    `;

    div.appendChild(dealCard);
  });

  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  sectionDeals.appendChild(fragment);

  console.log('✅ Deals rendered successfully');
};

/**
 * 🌟 Render pagination (Dynamique)
 * @param {Object} pagination
 */
const renderPagination = (pagination) => {
  console.log('📊 Rendering pagination:', pagination);

  const { currentPage, pageCount } = pagination;

  if (!pageCount) return;

  // ✅ Supprimer et reconstruire les options
  selectPage.innerHTML = '';
  
  for (let i = 1; i <= pageCount; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    selectPage.appendChild(option);
  }

  // ✅ Mettre la valeur sélectionnée
  selectPage.value = currentPage;
};

/**
 * 🌟 Render number of deals
 */
const renderIndicators = (pagination) => {
  const { totalItems } = pagination;
  spanNbDeals.innerHTML = totalItems || 0;
};

/**
 * 🌟 Render lego set IDs
 */
const renderLegoSetIds = (deals) => {
  const ids = [...new Set(deals.map(deal => deal.id))];
  selectLegoSetIds.innerHTML = ids.map(id => 
    `<option value="${id}">${id}</option>`
  ).join('');
};

/**
 * 🌟 Main render function
 */
const render = (deals, pagination) => {
  renderDeals(deals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals);
};

/**
 * 🌟 Handle Pagination
 */
const handlePagination = async (page = 1, size = 6) => {
  const { currentDeals, currentPagination } = await fetchDeals(page, size);
  setCurrentDeals({ result: currentDeals, meta: currentPagination });
  render(currentDeals, currentPagination);
};

/**
 * 🌟 Init on Page Load
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🌍 Document loaded');
  await handlePagination(1, 6);
});

/**
 * 🌟 Update Pagination on Change
 */
selectPage.addEventListener('change', async (event) => {
  console.log(`📲 Page changed to: ${event.target.value}`);
  await handlePagination(parseInt(event.target.value));
});

/**
 * 🌟 Update Number of Deals on Change
 */
selectShow.addEventListener('change', async (event) => {
  console.log(`📲 Changing number of deals to: ${event.target.value}`);
  await handlePagination(1, parseInt(event.target.value));
});

/**
 * 🌟 Update when Lego Set ID is Selected
 */
selectLegoSetIds.addEventListener('change', async (event) => {
  const id = event.target.value;
  const filteredDeals = currentDeals.filter(deal => deal.id === id);
  render(filteredDeals, currentPagination);
});






const SALES_API_URL = 'https://server-six-blond-36.vercel.app/sales/search';

/**
 * 🌟 Fetch Vinted sales for a given Lego set ID
 * @param {string} id - The Lego set ID to fetch sales for
 * @return {Array} - list of sales
 */
const fetchSales = async (id) => {
  if (!id || id.trim() === '') {
    console.log('⚠️ ID is empty');
    return [];
  }

  try {
    console.log(`🚀 Fetching sales for ID: ${id}`);

    const url = `${SALES_API_URL}?legoSetId=${encodeURIComponent(id)}`;
    console.log(`➡️ Fetching from URL: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors', // ✅ Active CORS pour éviter les problèmes de politique CORS
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`❌ Failed to fetch sales. Status: ${response.status}`);
    }

    const body = await response.json();
    console.log('✅ Fetched sales:', body);

    // ✅ Vérification de la structure de la réponse
    if (!body.results || body.results.length === 0) {
      console.warn('⚠️ No sales returned from the API');
      return [];
    }

    return body.results;
  } catch (error) {
    console.error('❌ Error fetching sales:', error);
    return [];
  }
};

/**
 * 🌟 Render Vinted sales for a given Lego set ID
 * @param {Array} sales - list of sales
 */
const renderSales = (sales) => {
  console.log("📊 Rendering sales:", sales);

  const sectionSales = document.querySelector('#vinted-sales');
  sectionSales.innerHTML = '<h2>Sales</h2>';

  const salesContainer = document.createElement('div');
  salesContainer.className = 'sales-container';

  if (!sales || sales.length === 0) {
    console.warn('⚠️ No sales to render');
    const noSalesMessage = document.createElement('p');
    noSalesMessage.textContent = 'No sales found for this Lego set ID.';
    sectionSales.appendChild(noSalesMessage);
  } else {
    sales.forEach((sale) => {
      console.log(`➡️ Rendering sale: ${sale.title}`);

      const saleDiv = document.createElement('div');
      saleDiv.classList.add('sale');

      saleDiv.innerHTML = `
        <p><strong>ID/Name:</strong> ${sale.title || 'N/A'}</p>
        <p><strong>Price:</strong> ${sale.price ? `${sale.price} €` : 'N/A'}</p>
        <p><strong>Date:</strong> ${sale.published}</p>
        <p><strong>Buy Link:</strong> <a href="${sale.link}" target="_blank">${sale.link || 'N/A'}</a></p>
      `;

      salesContainer.appendChild(saleDiv);
    });

    sectionSales.appendChild(salesContainer);
    console.log('✅ Sales rendered successfully');
  }
};






/**
 * Declaration of all Listeners
 */

/**
 * Select the number of deals to display
 */
//F0 - Show more deals
selectShow.addEventListener('change', async (event) => {
  const deals = await fetchDeals(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});



//F1 - Browse available deals to load more deals
selectPage.addEventListener('change', async (event) => {
  const deals = await fetchDeals(parseInt(event.target.value));

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});



// F2 - Filter by discount 
const discountSlider = document.getElementById("discount-slider");
const discountValue = document.getElementById("discount-value");

// Function to filter deals based on the selected discount value
const filterDealsByDiscount = (deals, minDiscount) => {
  return deals.filter(deal => parseFloat(deal.discount) >= minDiscount);
};

// Update the discount value and filter deals when slider changes
discountSlider.addEventListener("input", () => {
  const selectedDiscount = parseInt(discountSlider.value);
  discountValue.textContent = `${selectedDiscount}%`;

  // Filter and render the deals dynamically
  const filteredDeals = filterDealsByDiscount(currentDeals, selectedDiscount);
  renderDeals(filteredDeals);
});



// F3 - Filter by comments using the commented slider
const filterDealsByComments = (deals, minComments) => {
  return deals.filter(deal => deal.comments >= minComments);
};

const commentedSlider = document.getElementById('commented-slider');
const commentedValue = document.getElementById('commented-value');

commentedSlider.addEventListener('input', () => {
  const minComments = parseInt(commentedSlider.value);
  commentedValue.textContent = `${minComments}`;
  const filteredDeals = filterDealsByComments(currentDeals, minComments);
  renderDeals(filteredDeals);
});



// F4 - Filter by hot deals using the hot deals slider
const filterDealsByTemperature = (deals, minTemperature) => {
  return deals.filter(deal => deal.temperature >= minTemperature);
};

const hotDealsSlider = document.getElementById('hotdeals-slider');
const hotDealsValue = document.getElementById('hotdeals-value');

hotDealsSlider.addEventListener('input', () => {
  const minTemperature = parseInt(hotDealsSlider.value);
  hotDealsValue.textContent = `${minTemperature}`;
  const filteredDeals = filterDealsByTemperature(currentDeals, minTemperature);
  renderDeals(filteredDeals);
});



//F5 - filter by price -> sort by price ascending or descending
const filterDealsByPrice = (deals, sortOption) => {
  if (sortOption === 'price-asc') {
    return deals.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    return deals.sort((a, b) => b.price - a.price);
  }
  return deals; 
};

const sortSelect1 = document.getElementById('sort-select');

sortSelect1.addEventListener('change', async (event) => {
  const sortOption = event.target.value; // Get selected sort option
  const sortedDeals = filterDealsByPrice(currentDeals, sortOption);
  renderDeals(sortedDeals);
});



//F6 - filter by date -> sort deals by date
const filterDealsByDate = (deals, sortOption) => {
  if (sortOption === 'date-desc') {
    return deals.sort((a, b) => new Date(a.published) - new Date(b.published));
  } else if (sortOption === 'date-asc') {
    return deals.sort((a, b) => new Date(b.published) - new Date(a.published));
  }
  return deals; 
};

const sortSelect2 = document.getElementById('sort-select');

sortSelect2.addEventListener('change', async (event) => {
  const sortOption = event.target.value; // Get selected sort option
  const sortedDeals = filterDealsByDate(currentDeals, sortOption);
  renderDeals(sortedDeals);
});



const inputLegoSetId = document.getElementById("lego-set-id-select");
const fetchSalesBtn = document.getElementById("fetch-sales-btn");

// F7 - Display Vinted sales for a given Lego set ID (click on Sales button)
fetchSalesBtn.addEventListener("click", async () => {
  const setId = inputLegoSetId.value.trim();
  if (!setId) {
    console.log("Please enter a Lego set ID");
    return;
  }
  
  console.log("Sales for the lego set :", setId);
  const sales = await fetchSales(setId);
  renderSales(sales);
});


/// F8 - Display total number of sales
const updateTotalSales = (sales) => {
  const spanNbSales = document.querySelector('#nbSales');

  console.log('➡️ updateTotalSales -> sales:', sales); // ✅ Log de debug

  // Vérification que sales contient bien un tableau
  if (!sales || !Array.isArray(sales)) {
    console.warn('⚠️ No valid sales data to count');
    spanNbSales.textContent = '0';
    return;
  }

  // ✅ Nombre total de ventes
  const totalSales = sales.length;
  console.log(`✅ Total sales found: ${totalSales}`);

  // ✅ Mise à jour de l'UI
  spanNbSales.textContent = totalSales.toString();
};

// F9 - Display average p5, p25 and p50 price value
const getAveragePrice = (sales) => {
  console.log('➡️ getAveragePrice -> sales:', sales); // ✅ Log de debug

  if (!sales || sales.length === 0) {
    console.warn('⚠️ No sales to calculate average price');
    return { p5: 0, p25: 0, p50: 0 };
  }

  // ✅ Filtrer les prix valides
  const prices = sales
    .map(sale => parseFloat(sale.price))
    .filter(price => !isNaN(price)) // Retirer les NaN
    .sort((a, b) => a - b);

  console.log('✅ Sorted Prices:', prices);

  if (prices.length === 0) return { p5: 0, p25: 0, p50: 0 };

  // ✅ Calcul des percentiles
  const p5 = prices[Math.floor(prices.length * 0.05)] || prices[0];
  const p25 = prices[Math.floor(prices.length * 0.25)] || prices[0];
  const p50 = prices[Math.floor(prices.length * 0.5)] || prices[0];

  console.log(`✅ Percentiles - P5: ${p5}, P25: ${p25}, P50: ${p50}`);

  return { p5, p25, p50 };
};

const updateAveragePrice = (sales) => {
  const { p5, p25, p50 } = getAveragePrice(sales);

  const spanP5 = document.querySelector('#p5');
  const spanP25 = document.querySelector('#p25');
  const spanP50 = document.querySelector('#p50');

  if (spanP5) spanP5.textContent = p5.toFixed(2);
  if (spanP25) spanP25.textContent = p25.toFixed(2);
  if (spanP50) spanP50.textContent = p50.toFixed(2);

  console.log('✅ Average prices updated');
};



// F10 - Display lifetime value -> how long it exists on Vinted
const getLifetimeValue = (sales) => {
  console.log('➡️ getLifetimeValue -> sales:', sales);

  if (!sales || sales.length === 0) {
    console.warn('⚠️ No sales to calculate lifetime value');
    return 0;
  }

  const dates = sales
    .map(sale => {
      console.log('➡️ Raw date:', sale.published);

      // ✅ Format DD/MM/YYYY -> YYYY-MM-DD
      const europeanDatePattern = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
      const match = sale.published.match(europeanDatePattern);

      if (match) {
        const isoDate = `${match[3]}-${match[2]}-${match[1]}T${match[4]}:${match[5]}:${match[6]}`;
        console.log('✅ Converted date:', isoDate);
        return new Date(isoDate);
      }

      console.warn(`⚠️ Invalid date format: ${sale.published}`);
      return null;
    })
    .filter(date => date !== null && !isNaN(date.getTime())); // Retirer les dates invalides

  console.log('✅ Dates after parsing:', dates);

  if (dates.length === 0) return 0;

  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  console.log('✅ Min Date:', minDate);
  console.log('✅ Max Date:', maxDate);

  const lifetimeMiliSec = maxDate - minDate;
  const lifetimeInDays = Math.ceil(lifetimeMiliSec / (1000 * 60 * 60 * 24));

  console.log(`✅ Lifetime in days: ${lifetimeInDays}`);

  return lifetimeInDays;
};

const updateLifetimeValue = (sales) => {
  const lifetime = getLifetimeValue(sales);

  const spanLifetime = document.querySelector('#lifetime');
  spanLifetime.textContent = `${lifetime} days`;

  console.log(`✅ Lifetime value updated: ${lifetime} days`);
};



// 🌟 Event Listener to Fetch Sales and Update Indicators
selectLegoSetIds.addEventListener('input', async (event) => {
  const inputSetId = event.target.value.trim();

  console.log('➡️ Input Lego Set ID:', inputSetId);

  if (!inputSetId) return;

  const sales = await fetchSales(inputSetId); // ✅ Fetch complet (avec metadata)
  
  console.log('✅ Fetched Sales:', sales);

  // ✅ Display sales
  renderSales(sales);

  // ✅ Update indicators
  updateTotalSales(sales);  
  updateAveragePrice(sales); 
  updateLifetimeValue(sales);
});




// F11 - Open deal link in a new page
sectionDeals.addEventListener('click', async (event) => {
  // Check if the clicked element is an anchor tag (link)
  if (event.target.tagName === 'A') {
    const dealId = event.target.closest('.deal').id;
    const deal = currentDeals.find((deal) => deal.uuid === dealId);

    if (deal) {
      // Open the deal link in a new tab
      window.open(deal.link, '_blank');
      
      // Prevent the current page from being refreshed
      event.preventDefault();
    }
  }
});



// F12 - Open sold item link in a new page
document.addEventListener('click', async (event) => {
  // Check if the clicked element is an anchor tag (link)
  if (event.target.tagName === 'A' && event.target.closest('.sale')) {
    // Open the sale link in a new tab
    window.open(event.target.href, '_blank');
    event.preventDefault();
  }
});



// F13 - Save a deal as favorite
const toggleFavorite = (deal, starElement) => {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Check if the deal is already in favorites
  const index = favorites.findIndex((fav) => fav.uuid === deal.uuid);

  if (index !== -1) {
    // Remove from favorites
    favorites.splice(index, 1);
    starElement.style.color = 'gold'; // Reset star color
  } else {
    // Add to favorites
    favorites.push(deal);
    starElement.style.color = 'red'; // Turn star red
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
};

// Clear all favorites on page reload
window.addEventListener('load', () => {
  localStorage.removeItem('favorites'); // Clear favorites
  document.querySelectorAll('.favorite-deal').forEach((starElement) => {
    starElement.style.color = 'gold'; // Reset all stars to gold
  });
});

// Event listener for saving/removing a deal as favorite
sectionDeals.addEventListener('click', (event) => {
  // Ensure only the star is clicked
  if (event.target.classList.contains('favorite-deal')) {
    const dealId = event.target.closest('.deal')?.id;
    const deal = currentDeals.find((deal) => deal.uuid === dealId);

    if (deal) {
      toggleFavorite(deal, event.target);
    }
  }
});

// F14 - Filter deals by favorite
const filterFavoriteBtn = document.getElementById('filter-favorite-deals');

filterFavoriteBtn.addEventListener('click', () => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (!favorites.length) {
    console.log('No favorite deals found.');
    renderDeals([]); // Clear the displayed deals
    return;
  }

  renderDeals(favorites); // Render only favorite deals
});





//BEST DEALS
// ✅ Fonction pour filtrer les Best Deals
const getBestDeals = async () => {
  console.log('🏆 Filtering Best Deals...');

  if (!currentDeals || currentDeals.length === 0) {
    console.warn('⚠️ No deals to filter');
    return [];
  }

  const filteredDeals = [];

  for (const deal of currentDeals) {
    console.log(`➡️ Processing deal: ${deal.title}`);

    if (!deal.id || !deal.price) continue;

    // ✅ Fetch sales pour ce deal
    const sales = await fetchSales(deal.id);
    console.log(`✅ Sales for ${deal.id}:`, sales);

    // ✅ Vérification que sales est bien un tableau (via `results`)
    const salesArray = Array.isArray(sales) ? sales : sales.results || [];
    console.log('➡️ Sales Array:', salesArray);

    if (!salesArray || salesArray.length === 0) {
      console.warn(`⚠️ No sales for deal: ${deal.title}`);
      continue;
    }

    // ✅ Lifetime du deal (conversion du format)
    const lifetime = getLifetimeValue2(salesArray);
    console.log(`➡️ Lifetime for ${deal.id}: ${lifetime} days`);

    // ✅ Prix percentiles
    const { p5, p25, p50 } = getAveragePrice(salesArray);
    console.log(`➡️ Percentiles for ${deal.id}:`, { p5, p25, p50 });

    // ✅ Vérifie si c'est un bon deal :
    // - Lifetime < 100 jours
    // - Prix médian (p50) > 1.5 * prix de base
    if (lifetime < 100 && p50 > parseFloat(deal.price) * 1.2) {
      console.log(`✅ Adding Best Deal: ${deal.title}`);
      filteredDeals.push({
        ...deal,
        lifetime,
        salesCount: salesArray.length,
        p5,
        p25,
        p50
      });
    }
  }

  // ✅ Trie par lifetime le plus court en premier
  filteredDeals.sort((a, b) => a.lifetime - b.lifetime);

  // ✅ Limite à 5 deals
  console.log(`🏆 Final Best Deals:`, filteredDeals);
  return filteredDeals.slice(0, 5);
};

// ✅ Fonction pour afficher les Best Deals
const renderBestDeals = async () => {
  console.log('🏆 Rendering Best Deals...');

  // ✅ Montre le message de chargement
  const loadingIndicator = document.getElementById('best-deals-loading');
  loadingIndicator.style.display = 'block';

  const bestDeals = await getBestDeals();
  console.log('✅ Best Deals:', bestDeals);

  // ✅ Cache le message de chargement après traitement
  loadingIndicator.style.display = 'none';

  if (!bestDeals || bestDeals.length === 0) {
    console.warn('⚠️ No Best Deals found');
    sectionDeals.innerHTML = '<h2>Best Deals</h2><p>No deals available</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'best-deals-container';

  bestDeals.forEach(deal => {
    const template = `
      <div class="best-deal" id="${deal.id}">
        <img src="${deal.image || 'placeholder.png'}" alt="${deal.title}" />
        <h3>${deal.title}</h3>
        <p><span class="highlight">ID:</span> ${deal.id}</p>
        <p><span class="highlight">Price:</span> ${deal.price.toFixed(2)} €</p>
        <p><span class="highlight">Date:</span> ${new Date(deal.published).toLocaleDateString()}</p>
        <div class="badge">Number of sales: ${deal.salesCount}</div>
        <div class="badge">p5 sales price: ${deal.p5.toFixed(2)} €</div>
        <div class="badge">p25 sales price: ${deal.p25.toFixed(2)} €</div>
        <div class="badge">p50 sales price: ${deal.p50.toFixed(2)} €</div>
        <p class="lifetime">Lifetime: ${deal.lifetime} days</p>
        <a href="${deal.link}" target="_blank">➡️ Open Deal</a>
      </div>
    `;

    div.innerHTML += template;
  });

  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Best Deals</h2>';
  sectionDeals.appendChild(fragment);

  console.log('✅ Best Deals rendered successfully');
};


// ✅ Correction du format de date dans lifetime
const getLifetimeValue2 = (sales) => {
  if (!sales || sales.length === 0) return 0;

  const dates = sales.map(sale => {
    if (!sale.published) return null;
    // Format : DD/MM/YYYY HH:MM:SS ➔ YYYY-MM-DDTHH:MM:SS
    const [date, time] = sale.published.split(' ');
    const [day, month, year] = date.split('/');
    return new Date(`${year}-${month}-${day}T${time}`);
  }).filter(date => !isNaN(date));

  if (dates.length === 0) return 0;

  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const lifetimeMiliSec = maxDate - minDate;
  const lifetimeInDays = Math.ceil(lifetimeMiliSec / (1000 * 60 * 60 * 24));
  return lifetimeInDays;
};

// ✅ Attacher le bouton Best Deals au DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌍 DOM Loaded');

  const filterBestBtn = document.getElementById('filter-best-deals');
  console.log('🏆 Best Deals Button:', filterBestBtn);

  if (filterBestBtn) {
    filterBestBtn.addEventListener('click', async () => {
      console.log('🏆 Best Deals button clicked');
      await renderBestDeals();
    });
  }
});
