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
      <div class="deal" id="${deal.uuid}">
          <img src="${deal.photo || 'placeholder.png'}" alt="Deal Image">
          <p><strong>ID:</strong> ${deal.id}</p>
          <p><strong>Name:</strong> <a href="${deal.link}" target="_blank">${deal.title}</a></p>
          <p><strong>Price:</strong> ${deal.price}</p>
          <p><strong>Date:</strong> ${new Date(deal.published)}</p>
          <span id="starDeals" class="favorite-deal">★</span>
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
  sectionSales.innerHTML = '<h2>Sales</h2>';
  const fragment = document.createDocumentFragment();

  if (!salesArray || salesArray.length === 0) {
    console.log("No sales!");
    const noSalesMessage = document.createElement('p');
    noSalesMessage.textContent = "No sales found for this Lego set ID.";
    sectionSales.appendChild(noSalesMessage);
  } else {
    console.log("Show sales");

    salesArray.forEach((sale) => {
      const saleDiv = document.createElement('div');
      saleDiv.classList.add('sale');

      saleDiv.innerHTML = `
        <p><strong>ID/Name:</strong> ${sale.title}</p>
        <p><strong>Buy Link:</strong> <a href="${sale.link}" target="_blank">${sale.link}</a></p>
        <p><strong>Price:</strong> ${sale.price}</p>
        <p><strong>Date:</strong> ${sale.published}</p>
      `;

      fragment.appendChild(saleDiv);
    });

    sectionSales.appendChild(fragment);
  }
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
  const index = favorites.findIndex(fav => fav.uuid === deal.uuid);

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

// Clear favorites on page reload
window.addEventListener('load', () => {
  localStorage.removeItem('favorites');
});

// Event listener for saving/removing a deal as favorite
sectionDeals.addEventListener('click', (event) => {
  // Ensure only the star is clicked
  if (event.target.classList.contains('favorite-deal')) {
    const dealId = event.target.closest('.deal')?.id;
    const deal = currentDeals.find(deal => deal.uuid === dealId);

    if (deal) {
      toggleFavorite(deal, event.target);
    }
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