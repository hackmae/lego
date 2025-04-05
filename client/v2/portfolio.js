'use strict';

const API_URL = 'https://server-six-blond-36.vercel.app/deals/search';

let currentDeals = [];
let allDeals = []; // pagination manuelle
let currentPagination = {
  currentPage: 1,
  pageSize: 6,
  pageCount: 1,
  totalItems: 0
};
let isLoading = false;

// Sélecteurs
const selectShow = document.querySelector('#show-select');
const sectionDeals = document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const paginationContainer = document.getElementById('pagination-container');

// Afficher loader
const showLoader = () => {
  sectionDeals.innerHTML = '<p>Loading deals...</p>';
};

// Masquer loader
const hideLoader = () => {
  sectionDeals.innerHTML = '';
};

// DEALS

/**
 * Fetch ALL deals from the API
 */
const fetchAllDeals = async () => {
  try {
    showLoader();

    const url = `${API_URL}?limit=1000&offset=0`;
    const response = await fetch(url);
    const body = await response.json();

    if (!body.results) {
      console.warn('No deals returned');
      return;
    }

    allDeals = body.results;
    currentPagination.totalItems = allDeals.length;
    currentPagination.pageCount = Math.ceil(allDeals.length / currentPagination.pageSize);

    console.log('Fetched All Deals:', allDeals.length);
  } catch (err) {
    console.error('Failed to fetch deals:', err);
  } finally {
    hideLoader();
  }
};


//Paginate deals manually
const paginateDeals = () => {
  const start = (currentPagination.currentPage - 1) * currentPagination.pageSize;
  const end = start + currentPagination.pageSize;

  currentDeals = allDeals.slice(start, end);

  console.log(`Paginated deals for page ${currentPagination.currentPage}: ${start} -> ${end}`);
};


//Render list of deals
const renderDeals = (deals) => {
  console.log('Rendering deals:', deals);

  if (!deals || deals.length === 0) {
    sectionDeals.innerHTML = '<h2>Deals</h2><p>No deals found.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'deals-container';

  deals.forEach(deal => {
    const id = deal.id?.toString() || 'N/A';
    const title = deal.title || 'Unknown Title';
    const price = deal.price ? `${deal.price.toFixed(2)} €` : 'N/A';
    const link = deal.link || '#';
    const date = deal.published ? new Date(deal.published).toLocaleDateString() : 'Unknown Date';

    let image = deal.image || 'placeholder.png';
    image = image.replace(/\$\{[^}]+\}/g, '');

    const dealCard = document.createElement('div');
    dealCard.className = 'deal';
    dealCard.setAttribute('data-id', id);

    dealCard.innerHTML = `
      <img src="${image}" alt="${title}" onerror="this.src='placeholder.png';">
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
};



//Render number of deals
const renderIndicators = () => {
  spanNbDeals.innerHTML = currentPagination.totalItems || 0;
};

//Render lego set IDs
const renderLegoSetIds = () => {
  const ids = [...new Set(allDeals.map(deal => deal.id))];
  selectLegoSetIds.innerHTML = ids.map(id => `<option value="${id}">${id}</option>`).join('');
};

//Render styled pagination buttons
const renderPagination = () => {
  if (!paginationContainer) return;
  paginationContainer.innerHTML = '';

  const { currentPage, pageCount } = currentPagination;

  if (pageCount <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '«';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => handlePagination(currentPage - 1));
  paginationContainer.appendChild(prevBtn);

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => handlePagination(i));
    paginationContainer.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '»';
  nextBtn.disabled = currentPage === pageCount;
  nextBtn.addEventListener('click', () => handlePagination(currentPage + 1));
  paginationContainer.appendChild(nextBtn);
};

// Main renderer
const render = () => {
  paginateDeals();
  renderDeals(currentDeals);
  renderPagination();
  renderIndicators();
  renderLegoSetIds();
};

//Handle pagination trigger 
const handlePagination = (page) => {
  currentPagination.currentPage = page;
  render();
};

//Init
window.addEventListener('DOMContentLoaded', async () => {
  await fetchAllDeals();
  handlePagination(1);
});

//Show selector
selectShow.addEventListener('change', (e) => {
  currentPagination.pageSize = parseInt(e.target.value);
  currentPagination.pageCount = Math.ceil(allDeals.length / currentPagination.pageSize);
  handlePagination(1);
});

//Lego Set ID selector
selectLegoSetIds.addEventListener('change', (event) => {
  const id = event.target.value;
  const filtered = allDeals.filter(deal => deal.id.toString() === id);
  renderDeals(filtered);
});




// SALES
const SALES_API_URL = 'https://server-six-blond-36.vercel.app/sales/search';

/**
 * Fetch Vinted sales for a given Lego set ID
 * @param {string} id - The Lego set ID to fetch sales for
 * @return {Array} - list of sales
 */
const fetchSales = async (id) => {
  if (!id || id.trim() === '') {
    console.log('ID is empty');
    return [];
  }

  try {
    console.log(`Fetching sales for ID: ${id}`);

    const url = `${SALES_API_URL}?legoSetId=${encodeURIComponent(id)}`;
    console.log(`Fetching from URL: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors', // Active CORS pour éviter les problèmes de politique CORS
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sales. Status: ${response.status}`);
    }

    const body = await response.json();
    console.log('Fetched sales:', body);

    // Vérification de la structure de la réponse
    if (!body.results || body.results.length === 0) {
      console.warn('No sales returned from the API');
      return [];
    }

    return body.results;
  } catch (error) {
    console.error('Error fetching sales:', error);
    return [];
  }
};

/**
 * Render Vinted sales for a given Lego set ID
 * @param {Array} sales - list of sales
 */
const renderSales = (sales) => {
  console.log("Rendering sales:", sales);

  const sectionSales = document.querySelector('#vinted-sales');
  sectionSales.innerHTML = '<h2>Sales</h2>';

  const salesContainer = document.createElement('div');
  salesContainer.className = 'sales-container';

  const uniqueSales = removeDuplicateSales(sales);

  if (!uniqueSales || sales.length === 0) {
    console.warn('No sales to render');
    const noSalesMessage = document.createElement('p');
    noSalesMessage.textContent = 'No sales found for this Lego set ID.';
    sectionSales.appendChild(noSalesMessage);
  } else {
    uniqueSales.forEach((sale) => {
      console.log(`Rendering sale: ${sale.title}`);

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
    console.log('Sales rendered successfully');
  }
};

const removeDuplicateSales = (sales) => {
  const seen = new Set();
  return sales.filter(sale => {
    if (seen.has(sale.link)) return false;
    seen.add(sale.link);
    return true;
  });
};



// FILTERS

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


/// F8 - Display total number of sales (without duplicates)
const updateTotalSales = (sales) => {
  const spanNbSales = document.querySelector('#nbSales');

  console.log('updateTotalSales -> raw sales:', sales);

  // Vérification que sales est bien un tableau
  if (!Array.isArray(sales)) {
    console.warn('No valid sales data to count');
    spanNbSales.textContent = '0';
    return;
  }

  // Supprimer les doublons avant de compter
  const uniqueSales = removeDuplicateSales(sales);
  const totalSales = uniqueSales.length;

  console.log(`Total unique sales: ${totalSales} (filtered ${sales.length - totalSales} duplicates)`);

  // Mettre à jour l'UI
  spanNbSales.textContent = totalSales.toString();
};


// F9 - Display average p5, p25 and p50 price value
const getAveragePrice = (sales) => {
  console.log('getAveragePrice -> raw sales:', sales);

  const uniqueSales = removeDuplicateSales(sales);

  if (!uniqueSales || uniqueSales.length === 0) {
    console.warn('No sales to calculate average price');
    return { p5: 0, p25: 0, p50: 0 };
  }

  // Filtrer les prix valides
  const prices = uniqueSales
    .map(sale => parseFloat(sale.price))
    .filter(price => !isNaN(price))
    .sort((a, b) => a - b);

  console.log('Sorted Prices:', prices);

  if (prices.length === 0) return { p5: 0, p25: 0, p50: 0 };

  // Calcul des percentiles
  const p5 = prices[Math.floor(prices.length * 0.05)] || prices[0];
  const p25 = prices[Math.floor(prices.length * 0.25)] || prices[0];
  const p50 = prices[Math.floor(prices.length * 0.5)] || prices[0];

  console.log(`Percentiles - P5: ${p5}, P25: ${p25}, P50: ${p50}`);

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

  console.log('Average prices updated');
};




// F10 - Display lifetime value -> how long it exists on Vinted
const getLifetimeValue = (sales) => {
  console.log('getLifetimeValue -> raw sales:', sales);

  if (!Array.isArray(sales) || sales.length === 0) {
    console.warn('No sales to calculate lifetime value');
    return 0;
  }

  // Supprimer les doublons par lien
  const uniqueSales = removeDuplicateSales(sales);
  console.log('Filtered unique sales:', uniqueSales);

  const now = Date.now();
  const durations = uniqueSales
    .map(sale => {
      if (!sale.published) return null;

      // Gère format "DD/MM/YYYY HH:mm:ss"
      const europeanPattern = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
      const match = sale.published.match(europeanPattern);

      let publishedDate;
      if (match) {
        const isoDate = `${match[3]}-${match[2]}-${match[1]}T${match[4]}:${match[5]}:${match[6]}`;
        publishedDate = new Date(isoDate);
      } else {
        publishedDate = new Date(sale.published); // fallback
      }

      if (isNaN(publishedDate)) return null;

      const ageInDays = (now - publishedDate.getTime()) / (1000 * 60 * 60 * 24);
      return ageInDays;
    })
    .filter(days => days !== null && !isNaN(days));

  if (durations.length === 0) {
    console.warn('No valid publication dates found');
    return 0;
  }

  const averageLifetime = Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length);
  console.log(`Average Lifetime: ${averageLifetime} days`);
  return averageLifetime;
};

const updateLifetimeValue = (sales) => {
  const lifetime = getLifetimeValue(sales);
  const spanLifetime = document.querySelector('#lifetime');
  spanLifetime.textContent = `${lifetime} days`;
  console.log(`Lifetime value updated: ${lifetime} days`);
};





// Event Listener to Fetch Sales and Update Indicators
selectLegoSetIds.addEventListener('input', async (event) => {
  const inputSetId = event.target.value.trim();

  console.log('➡️ Input Lego Set ID:', inputSetId);
  if (!inputSetId) return;

  const sales = await fetchSales(inputSetId); 
  console.log('Fetched Sales:', sales);

  renderSales(sales);
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




// FAVORITE DEALS

// Supprimer les favoris à chaque rechargement de la page
window.addEventListener('beforeunload', () => {
  console.log("🧹 Clearing favorites before page unload");
  localStorage.removeItem('favorites');
});

// Toggle deal as favorite (add/remove from localStorage)
const toggleFavorite = (deal, starElement) => {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const dealId = deal.id?.toString();

  console.log("toggleFavorite -> clicked on:", deal.title, `(ID: ${dealId})`);
  console.log("Current favorites:", favorites.map(f => f.id));

  const alreadyFavorite = favorites.some(fav => fav.id?.toString() === dealId);

  if (alreadyFavorite) {
    favorites = favorites.filter(fav => fav.id?.toString() !== dealId);
    starElement.classList.remove('active');
    console.log("Removed from favorites:", dealId);
  } else {
    favorites.push(deal);
    starElement.classList.add('active');
    console.log("Added to favorites:", dealId);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
  console.log("Saved favorites:", favorites.map(f => f.id));
};

// Gestion du clic sur les étoiles
sectionDeals.addEventListener('click', (event) => {
  if (event.target.classList.contains('favorite-deal')) {
    const card = event.target.closest('.deal');
    const dealId = card?.getAttribute('data-id');
    console.log("Star clicked in card with ID:", dealId);

    const deal = currentDeals.find(d => d.id?.toString() === dealId);

    if (deal) {
      toggleFavorite(deal, event.target);
    } else {
      console.warn(`Deal not found in currentDeals for ID: ${dealId}`);
    }
  }
});

// Restore star appearance based on favorites
const restoreFavoriteStars = () => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  console.log("Restoring stars for favorite IDs:", favorites.map(f => f.id?.toString()));

  document.querySelectorAll('.favorite-deal').forEach(star => {
    const card = star.closest('.deal');
    const dealId = card?.getAttribute('data-id');
    const isFavorite = favorites.some(deal => deal.id?.toString() === dealId);

    if (isFavorite) {
      star.classList.add('active');
      console.log(`Star marked active for deal ID ${dealId}`);
    } else {
      star.classList.remove('active');
    }
  });
};

// Filter favorite deals button
const filterFavoriteBtn = document.getElementById('filter-favorite-deals');

filterFavoriteBtn.addEventListener('click', () => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  console.log("Filtering favorites -> found:", favorites.length, "deal(s)");

  if (!favorites.length) {
    console.warn('No favorite deals found.');
    renderDeals([]);
    return;
  }

  console.log("Rendering favorite deals:", favorites.map(d => d.id));
  renderDeals(favorites);
  setTimeout(restoreFavoriteStars, 100);
});

// Restore stars after page load
window.addEventListener('load', () => {
  console.log("Page loaded -> restoring favorites (if any)");
  setTimeout(restoreFavoriteStars, 200);
});




//BEST DEALS
// Fonction pour filtrer les Best Deals
const getBestDeals = async () => {
  console.log('Filtering Best Deals...');

  if (!Array.isArray(allDeals) || allDeals.length === 0) {
    console.warn('No deals to filter');
    return [];
  }

  const bestDeals = [];

  for (const deal of allDeals) {
    if (!deal.id || !deal.price) continue;


    console.log(`Processing deal: ${deal.title}`);

    const price = parseFloat(deal.price);
    const discount = parseFloat(deal.discount || 0);
    const comments = parseInt(deal.comments || 0);
    const temperature = parseFloat(deal.temperature || 0);

    const sales = await fetchSales(deal.id);
    if (!sales || sales.length === 0) continue;

    const uniqueSales = removeDuplicateSales(sales);
    const lifetime = getLifetimeValue(uniqueSales);
    const { p5, p25, p50 } = getAveragePrice(uniqueSales);

    console.log(`Price: ${price}`);
    console.log(p5, p25, p50);

    let score = 0;
    const reasons = [];

    if (price < p5) {
      score += 2;
      reasons.push("💥 Prix < p5");
    }
    if (price * 1.2 < p25) {
      score += 1;
      reasons.push("✅ price * 1.2 < p25");
    }
    if (price *1.5 < p50) {
      score += 1;
      reasons.push("✅ price *1.5 < p50");
    }
    if (comments >= 10) {
      score += 1;
      reasons.push("💬 ≥ 10 commentaires");
    }
    if (temperature >= 100) {
      score += 1;
      reasons.push("🔥 Température ≥ 100");
    }
    if (discount >= 25) {
      score += 1;
      reasons.push("💸 Réduction ≥ 25%");
    }
    if (uniqueSales.length >= 8) {
      score += 1;
      reasons.push("📈 ≥ 8 ventes");
    }

    if (score >= 4) {
      bestDeals.push({
        ...deal,
        lifetime,
        score,
        scoreNote: `${score}/8 - ${reasons.join(', ')}`,
        salesCount: uniqueSales.length,
        p5,
        p25,
        p50
      });
    }
  }

  bestDeals.sort((a, b) => b.score - a.score || a.lifetime - b.lifetime);
  console.log('Final Best Deals:', bestDeals);
  return bestDeals;
};



const renderBestDeals = async () => {
  console.log('Rendering Best Deals...');
  const loadingIndicator = document.getElementById('best-deals-loading');
  loadingIndicator.style.display = 'block';

  const bestDeals = await getBestDeals();
  loadingIndicator.style.display = 'none';

  const sectionDeals = document.querySelector('#deals');
  if (!bestDeals || bestDeals.length === 0) {
    sectionDeals.innerHTML = '<h2>Best Deals</h2><p>No deals available</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  const container = document.createElement('div');
  container.className = 'best-deals-container';

  bestDeals.forEach(deal => {
    container.innerHTML += `
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
        
        <div class="score-summary">
        <span class="badge score">Score: ${deal.score}/8</span>
        <span class="badge ${deal.price < deal.p5 ? 'ok' : 'neutral'}">💥 Price < p5</span>
        <span class="badge ${deal.price < deal.p25 * 1.5 ? 'ok' : 'neutral'}">✅ Price < 1.5*p25</span>
        <span class="badge ${deal.price < deal.p50 * 2 ? 'ok' : 'neutral'}">✅ Price < 2*p50</span>
        <span class="badge ${deal.comments >= 10 ? 'ok' : 'neutral'}">💬 ≥ 10 Comments</span>
        <span class="badge ${deal.temperature >= 100 ? 'ok' : 'neutral'}">🔥 Temperature ≥ 100</span>
        <span class="badge ${parseFloat(deal.discount || 0) >= 25 ? 'ok' : 'neutral'}">💸 Discount ≥ 25%</span>
        <span class="badge ${deal.salesCount >= 8 ? 'ok' : 'neutral'}">📈 ≥ 8 Sales</span>
      </div>
      </div>
    `;
  });

  fragment.appendChild(container);
  sectionDeals.innerHTML = '<h2>Best Deals</h2>';
  sectionDeals.appendChild(fragment);
};



document.addEventListener('DOMContentLoaded', () => {
  const filterBestBtn = document.getElementById('filter-best-deals');
  if (filterBestBtn) {
    filterBestBtn.addEventListener('click', renderBestDeals);
  }
});
