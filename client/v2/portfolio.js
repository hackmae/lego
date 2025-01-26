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
 * @param {Number} setId - The Lego set ID to fetch sales for
 * @return {Object} - Sales data
 */
const fetchVintedSales = async (setId) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/sales?id=${setId}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(`No sales data for ID ${setId}:`, body);
      return [];
    }

    return body.data;
  } catch (error) {
    console.error(`Error fetching Vinted sales for ID ${setId}:`, error);
    return [];
  }
};

/**
 * Fetch and render Vinted sales for all Lego set IDs
 * @param {Array} deals - Current deals to extract IDs from
 */
const fetchAndRenderAllVintedSales = async (deals) => {
  const salesSection = document.querySelector('#vinted-sales');
  salesSection.innerHTML = '<h2>Vinted Sales</h2>';

  if (!deals || deals.length === 0) {
    salesSection.innerHTML += '<p>No deals available to fetch sales data.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  await Promise.all(
    deals.map(async (deal) => {
      const sales = await fetchVintedSales(deal.id); // Fetch sales for each deal ID

      const div = document.createElement('div');
      div.innerHTML = `<h3>Sales for Lego Set ID: ${deal.id}</h3>`;

      if (!sales || sales.length === 0) {
        div.innerHTML += '<p>No sales found for this Lego set.</p>';
      } else {
        const salesTemplate = sales
          .map(
            (sale) => `
            <div class="sale">
              <a href="${sale.link}" target="_blank">${sale.title}</a>
              <p>Price: ${sale.price}</p>
              <p>Condition: ${sale.condition}</p>
              <p>Location: ${sale.location}</p>
            </div>
          `
          )
          .join('');
        div.innerHTML += salesTemplate;
      }

      fragment.appendChild(div);
    })
  );

  salesSection.appendChild(fragment);
};

/**
 * Render Vinted sales for a given Lego set ID
 * @param {Number} setId - The Lego set ID to render sales for
 */
const renderVintedSalesForSetId = async (setId) => {
  const salesSection = document.querySelector('#vinted-sales');
  salesSection.innerHTML = '<h2>Vinted Sales</h2>';

  const sales = await fetchVintedSales(setId);

  if (!sales || sales.length === 0) {
    salesSection.innerHTML += `<p>No sales found for Lego set ID: ${setId}.</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const salesTemplate = sales
    .map(
      (sale) => `
      <div class="sale">
        <a href="${sale.link}" target="_blank">${sale.title}</a>
        <p>Price: ${sale.price}</p>
        <p>Condition: ${sale.condition}</p>
        <p>Location: ${sale.location}</p>
      </div>
    `
    )
    .join('');

  div.innerHTML = salesTemplate;
  fragment.appendChild(div);
  salesSection.appendChild(fragment);
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

  // Initialize allDeals properly at the start
  allDeals = [...deals.result];

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

/*
//F7old - display vinted sales for a given lego set id
const selectLegoSetId = document.querySelector('#lego-set-id-select');

selectLegoSetId.addEventListener('change', async (event) => {
  const setId = event.target.value;  // Get the selected Lego set ID

  if (setId) {
    const vintedSales = await fetchVintedSales(setId);  // Fetch sales for the selected set ID
    renderVintedSales(vintedSales);  // Render the sales
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});


selectLegoSetIds.addEventListener('change', async (event) => {
  const setId = event.target.value; // Get selected Lego set ID

  if (setId) {
    // Render Vinted sales for the selected ID
    renderVintedSalesForSetId(setId);
  }
});


// F7 - Display Vinted sales for a given Lego set ID
selectLegoSetId.addEventListener('change', async (event) => {
  const setId = event.target.value; // Get the selected Lego set ID

  if (setId) {
    const vintedSales = await fetchVintedSales(setId); // Fetch sales for the selected set ID
    renderVintedSales(vintedSales); // Render the sales
    updateIndicators(vintedSales); // Update indicators based on sales
  }
});

// F8 - Display total number of sales
const updateTotalSales = (sales) => {
  const spanNbSales = document.querySelector('#nbSales');
  spanNbSales.textContent = sales.length;
};*/

// F9 - Display average p5, p25 and p50 price value
/*const getAveragePrice = (sales) => {
  const prices = sales.map(sale => sale.price);
  const p5 = prices[Math.floor(prices.length * 0.05)];
  const p25 = prices[Math.floor(prices.length * 0.25)];
  const p50 = prices[Math.floor(prices.length * 0.5)];

  return { p5, p25, p50 };
};

const updateAveragePrice = (sales) => {
  const { p5, p25, p50 } = getAveragePrice(sales);
  const spanP5 = document.querySelector('#p5');
  const spanP25 = document.querySelector('#p25');
  const spanP50 = document.querySelector('#p50');

  spanP5.textContent = p5;
  spanP25.textContent = p25;
  spanP50.textContent = p50;
};

// F10 - Display lifetime value -> how long it exists on Vinted
const getLifetimeValue = (sales) => {
  const dates = sales.map(sale => new Date(sale.published));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const lifetime = maxDate - minDate;

  return lifetime;
};

const updateLifetimeValue = (sales) => {
  const lifetime = getLifetimeValue(sales);
  const spanLifetime = document.querySelector('#lifetime');

  spanLifetime.textContent = lifetime;
};

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