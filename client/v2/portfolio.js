// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/**
Description of the available api
GET https://lego-api-blue.vercel.app/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET https://lego-api-blue.vercel.app/sales

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `id` - lego set id to return
*/

// current deals on the page
let currentDeals = [];
let currentPagination = {};


// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');

/**
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({result, meta}) => {
  currentDeals = result;
  currentPagination = meta;
};

/**
 * Fetch deals from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentDeals, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

/**
 * Render list of deals
 * @param  {Array} deals
 */
const renderDeals = deals => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = deals
    .map(deal => {
      return `
      <div class="deal" id=${deal.uuid}>
        <span>${deal.id}</span>
        <a href="${deal.link}">${deal.title}</a>
        <span>${deal.price}</span>
        <span id="starDeals">*</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  sectionDeals.appendChild(fragment);
};


/**
 * Fetch Vinted sales for a given Lego set ID
 * @param {string} id - The Lego set ID to fetch sales for
 * @return {Array} - list of sales
 */
const fetchSales = async (id) => {
  if (!id || id.trim() === '') {
    console.log('ID is empty');
    return { result: [] };
  }

  try {
    console.log(`Fetching sales for ID: ${id}`);
    const response = await fetch(`https://lego-api-blue.vercel.app/sales?id=${id}`);
    const body = await response.json();

    if (body.success !== true) {
      console.error('API Error:', body);
      return { result: [] };
    }

    console.log('Fetched sales:', body.data);
    return body.data; 
  } catch (error) {
    console.error('Fetch error:', error);
    return { result: [] };
  }
};



/**
 * Render Vinted sales for a given Lego set ID
 * @param {Array} sales - list of sales
 */
const renderSales = (sales) => {
  console.log("Dates renderSales", sales);

  const salesArray = sales.result || [];

  const sectionSales = document.querySelector('#vinted-sales');
  sectionSales.innerHTML = '<h2>Vinted Sales</h2>';
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');

  if (!salesArray || salesArray.length === 0) {
    console.log("No sales !");
    div.innerHTML = `<p>No sales found for this Lego set ID.</p>`;
  } else {
    console.log("show sales");
    div.innerHTML = salesArray.map(sale => `
      <div class="sale">
        <a href="${sale.link}" target="_blank">${sale.title}</a>
        <p>Price: ${sale.price}</p>
        <p>Published: ${sale.published}</p>
      </div>`
    ).join('');
  }

  fragment.appendChild(div);
  sectionSales.appendChild(fragment);
};





/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render lego set ids selector
 * @param  {Array} lego set ids
 */
const renderLegoSetIds = deals => {
  const ids = getIdsFromDeals(deals);
  const options = ids.map(id => 
    `<option value="${id}">${id}</option>`
  ).join('');

  selectLegoSetIds.innerHTML = options;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbDeals.innerHTML = count;
};

const render = (deals, pagination) => {
  renderDeals(deals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals)
};

document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();

  setCurrentDeals(deals);

  render(currentDeals, currentPagination);
});

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


//F2 - filter by best discount -> show deals with a discount of 50% or more
const filterDealsByDiscount = (deals) => {
  return deals.filter(deal => {
    return parseFloat(deal.discount) > 20;
  });
};
const filterDiscountBtn = document.getElementById('filter-discount');

filterDiscountBtn.addEventListener('click', () => {
  const filteredDeals = filterDealsByDiscount(currentDeals);
  renderDeals(filteredDeals);
});


//F3 - filter by most commented -> show deals with more than 15 comments
const filterDealsByComments = (deals) => {
  return deals.filter(deal => {
    return deal.comments > 15;
  });
};

const filterCommentsBtn = document.getElementById('filter-commented');

filterCommentsBtn.addEventListener('click', () => {
  const filteredDeals = filterDealsByComments(currentDeals);
  renderDeals(filteredDeals);
});

//F4 - filter by hot deals -> show deals with temperature above 100
const filterDealsByTemperature = (deals) => {
  return deals.filter(deal => {
    return deal.temperature > 100;
  });
};

const filterTemperatureBtn = document.getElementById('filter-hot-deals');

filterTemperatureBtn.addEventListener('click', () => {
  const filteredDeals = filterDealsByTemperature(currentDeals);
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
  if (sortOption === 'date-asc') {
    return deals.sort((a, b) => new Date(a.published) - new Date(b.published));
  } else if (sortOption === 'date-desc') {
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



// F8 - Display total number of sales
const updateTotalSales = (sales) => {
  const spanNbSales = document.querySelector('#nbSales');

  // Ensure sales.result exists and is an array
  const salesArray = Array.isArray(sales.result) ? sales.result : [];

  // Update the displayed number of sales
  spanNbSales.textContent = salesArray.length.toString();
};


selectLegoSetIds.addEventListener('input', async (event) => {
  const inputSetId = event.target.value.trim();
  console.log('Input Lego Set ID:', inputSetId);

  const sales = await fetchSales(inputSetId);
  
  renderSales(sales);  // Display the sales in the UI
  updateTotalSales(sales); // Update total sales count
});



// F9 - Display average p5, p25 and p50 price value
const getAveragePrice = (sales) => {
  if (!sales.result || sales.result.length === 0) return { p5: 0, p25: 0, p50: 0 };
  // Extract prices and filter only valid numbers
  const prices = sales.result
    .map(sale => parseFloat(sale.price))
    .filter(price => !isNaN(price))  // Remove NaN values
    .sort((a, b) => a - b); // Sort in ascending order

  if (prices.length === 0) return { p5: 0, p25: 0, p50: 0 };

  // Calculate percentiles
  const p5 = prices[Math.floor(prices.length * 0.05)] || prices[0];
  const p25 = prices[Math.floor(prices.length * 0.25)] || prices[0];
  const p50 = prices[Math.floor(prices.length * 0.5)] || prices[0];

  return { p5, p25, p50 };
};

const updateAveragePrice = (sales) => {
  const { p5, p25, p50 } = getAveragePrice(sales);

  // Select elements
  const spanP5 = document.querySelector('#p5');
  const spanP25 = document.querySelector('#p25');
  const spanP50 = document.querySelector('#p50');

  // Update UI
  if (spanP5) spanP5.textContent = p5.toFixed(2);
  if (spanP25) spanP25.textContent = p25.toFixed(2);
  if (spanP50) spanP50.textContent = p50.toFixed(2);
};

// Attach event listener
selectLegoSetIds.addEventListener('input', async (event) => {
  const inputSetId = event.target.value.trim();
  console.log('Input Lego Set ID:', inputSetId);

  const sales = await fetchSales(inputSetId);
  
  renderSales(sales);       // Display sales
  updateTotalSales(sales);  // Update total sales count
  updateAveragePrice(sales); // Update price percentiles
});



// F10 - Display lifetime value -> how long it exists on Vinted
const getLifetimeValue = (sales) => {
  if (!sales.result || sales.result.length === 0) return 0; // Handle empty data
  const dates = sales.result.map(sale => new Date(sale.published));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const lifetimeMiliSec = maxDate - minDate;
  const lifetimeInDays = Math.ceil(lifetimeMiliSec / (1000 * 60 * 60 * 24)); // Convert ms to days
  return lifetimeInDays;
};

const updateLifetimeValue = (sales) => {
  const lifetime = getLifetimeValue(sales);
  const spanLifetime = document.querySelector('#lifetime');
  spanLifetime.textContent = `${lifetime} days`;
}

// Attach event listener
selectLegoSetIds.addEventListener('input', async (event) => {
  const inputSetId = event.target.value.trim();
  console.log('Input Lego Set ID:', inputSetId);

  const sales = await fetchSales(inputSetId);
  
  renderSales(sales);       // Display sales
  updateTotalSales(sales);  // Update total sales count
  updateAveragePrice(sales); // Update price percentiles
  updateLifetimeValue(sales); // Update lifetime value
});




/*
// F11 - Open deal link in a new page
sectionDeals.addEventListener('click', async (event) => {
  const dealId = event.target.closest('.deal').id;
  const deal = currentDeals.find(deal => deal.uuid === dealId);

  if (deal) {
    window.open(deal.link, '_blank');
  }
});

// F12 - Open sold item link in a new page
document.addEventListener('click', async (event) => {
  const sale = event.target.closest('.sale');

  if (sale) {
    window.open(sale.querySelector('a').href, '_blank');
  }
});*/



// F13 - Save a deal as a favorite
const saveFavorite = (deal) => {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Check if the deal is already in favorites
  if (!favorites.some(fav => fav.uuid === deal.uuid)) {
    favorites.push(deal);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
};

// Clear favorites on page reload
window.addEventListener('load', () => {
  localStorage.removeItem('favorites');
});

// Event listener for saving a deal as favorite
sectionDeals.addEventListener('click', async (event) => {
  const dealId = event.target.closest('.deal')?.id;
  const deal = currentDeals.find(deal => deal.uuid === dealId);

  if (deal) {
    saveFavorite(deal);
  }
});


// F14 - Filter deals by favorite
const filterDealsByFavorite = (deals) => {
  return deals.filter(deal => {
    return deal.temperature > 100;
  });
};

const filterFavoriteBtn = document.getElementById('filter-favorite-deals');

filterFavoriteBtn.addEventListener('click', () => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  renderDeals(favorites);
});

//sales = thread_details_dealId that you can find on a deal page