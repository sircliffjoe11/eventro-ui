// Filter and search functionality for listings page
import { renderListingCard } from './cards.js';
import { initializePagination } from './pagination.js';

let allListings = [];
let filteredListings = [];
let currentFilters = {
  search: '',
  category: '',
  minPrice: 0,
  maxPrice: 10000000,
  country: '',
  state: '',
  city: '',
  rating: 0,
  instantBook: false
};

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('listings.html')) {
    initializeFilters();
    loadListings();
  }
});

async function loadListings() {
  try {
    const response = await fetch('../assets/js/data/listings.json');
    allListings = await response.json();
    applyFilters();
  } catch (error) {
    console.error('Error loading listings:', error);
    loadFallbackListings();
  }
}

function loadFallbackListings() {
  allListings = [
    {
      id: 1,
      title: "Professional Sound System for Events",
      service_category_id: 2,
      category: "Sound System Rental",
      vendor_id: 1,
      vendor_name: "SoundWave Productions",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
      base_price_cents: 150000,
      currency: "NGN",
      instant_book: true,
      rating: 4.9,
      reviews_count: 23,
      photo: "../assets/img/placeholders/listing-01.jpg",
      featured: true
    },
    {
      id: 2,
      title: "Wedding DJ & Entertainment Services",
      service_category_id: 5,
      category: "MC/Compere",
      vendor_id: 2,
      vendor_name: "DJ Master Mix",
      city: "Abuja",
      state: "FCT",
      country: "Nigeria",
      base_price_cents: 200000,
      currency: "NGN",
      instant_book: false,
      rating: 4.7,
      reviews_count: 45,
      photo: "../assets/img/placeholders/listing-02.jpg",
      featured: true
    },
    {
      id: 3,
      title: "Premium Catering Services",
      service_category_id: 1,
      category: "Catering",
      vendor_id: 3,
      vendor_name: "Elite Catering",
      city: "Port Harcourt",
      state: "Rivers",
      country: "Nigeria",
      base_price_cents: 2500000,
      currency: "NGN",
      instant_book: true,
      rating: 4.8,
      reviews_count: 67,
      photo: "../assets/img/placeholders/listing-03.jpg",
      featured: true
    },
    {
      id: 4,
      title: "Professional Photography Services",
      service_category_id: 8,
      category: "Photography",
      vendor_id: 4,
      vendor_name: "Capture Moments",
      city: "Ibadan",
      state: "Oyo",
      country: "Nigeria",
      base_price_cents: 500000,
      currency: "NGN",
      instant_book: false,
      rating: 4.6,
      reviews_count: 34,
      photo: "../assets/img/placeholders/listing-04.jpg",
      featured: false
    },
    {
      id: 5,
      title: "Interior Decoration & Styling",
      service_category_id: 3,
      category: "Interior Decor",
      vendor_id: 5,
      vendor_name: "Luxury Decor Co",
      city: "Enugu",
      state: "Enugu",
      country: "Nigeria",
      base_price_cents: 800000,
      currency: "NGN",
      instant_book: true,
      rating: 4.9,
      reviews_count: 56,
      photo: "../assets/img/placeholders/listing-05.jpg",
      featured: false
    },
    {
      id: 6,
      title: "Professional Security Services",
      service_category_id: 4,
      category: "Security",
      vendor_id: 6,
      vendor_name: "SecureGuard Pro",
      city: "Kano",
      state: "Kano",
      country: "Nigeria",
      base_price_cents: 100000,
      currency: "NGN",
      instant_book: false,
      rating: 4.5,
      reviews_count: 28,
      photo: "../assets/img/placeholders/listing-06.jpg",
      featured: false
    }
  ];
  
  applyFilters();
}

function initializeFilters() {
  renderFiltersUI();
  setupFilterEventListeners();
  setupSortEventListener();
  
  // Parse URL parameters for initial filters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('category')) {
    currentFilters.category = urlParams.get('category');
  }
}

function renderFiltersUI() {
  const filtersContent = `
    <div class="filter-section">
      <h6>Search</h6>
      <input type="search" class="form-control" id="search-filter" placeholder="Search services..." value="${currentFilters.search}">
    </div>

    <div class="filter-section">
      <h6>Category</h6>
      <select class="form-select" id="category-filter">
        <option value="">All Categories</option>
        <option value="1">Catering</option>
        <option value="2">Sound System Rental</option>
        <option value="3">Interior Decor</option>
        <option value="4">Security</option>
        <option value="5">MC/Compere</option>
        <option value="6">Comedian</option>
        <option value="7">Chair Rental</option>
        <option value="8">Photography</option>
        <option value="9">Videography</option>
        <option value="10">Lighting</option>
        <option value="11">Stage</option>
        <option value="12">Transportation</option>
        <option value="13">Cleaning</option>
      </select>
    </div>

    <div class="filter-section">
      <h6>Price Range (₦)</h6>
      <div class="row g-2">
        <div class="col-6">
          <input type="number" class="form-control form-control-sm" id="min-price" placeholder="Min" value="${currentFilters.minPrice || ''}">
        </div>
        <div class="col-6">
          <input type="number" class="form-control form-control-sm" id="max-price" placeholder="Max" value="${currentFilters.maxPrice === 10000000 ? '' : currentFilters.maxPrice}">
        </div>
      </div>
    </div>

    <div class="filter-section">
      <h6>Location</h6>
      <select class="form-select mb-2" id="country-filter">
        <option value="">All Countries</option>
        <option value="Nigeria" selected>Nigeria</option>
      </select>
      <select class="form-select mb-2" id="state-filter">
        <option value="">All States</option>
        <option value="Lagos">Lagos</option>
        <option value="FCT">FCT (Abuja)</option>
        <option value="Rivers">Rivers</option>
        <option value="Oyo">Oyo</option>
        <option value="Enugu">Enugu</option>
        <option value="Kano">Kano</option>
      </select>
      <select class="form-select" id="city-filter">
        <option value="">All Cities</option>
      </select>
    </div>

    <div class="filter-section">
      <h6>Rating</h6>
      <select class="form-select" id="rating-filter">
        <option value="0">All Ratings</option>
        <option value="4">4+ Stars</option>
        <option value="4.5">4.5+ Stars</option>
        <option value="4.8">4.8+ Stars</option>
      </select>
    </div>

    <div class="filter-section">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="instant-book-filter" ${currentFilters.instantBook ? 'checked' : ''}>
        <label class="form-check-label" for="instant-book-filter">
          Instant Book Only
        </label>
      </div>
    </div>

    <div class="d-grid gap-2">
      <button class="btn btn-success" id="apply-filters">Apply Filters</button>
      <button class="btn btn-outline-secondary" id="clear-filters">Clear All</button>
    </div>
  `;

  // Render to both desktop and mobile filter containers
  const desktopContainer = document.querySelector('#filters-content');
  const mobileContainer = document.querySelector('#mobile-filters-content');
  
  if (desktopContainer) desktopContainer.innerHTML = filtersContent;
  if (mobileContainer) mobileContainer.innerHTML = filtersContent;
}

function setupFilterEventListeners() {
  // Search input
  document.addEventListener('input', function(e) {
    if (e.target.id === 'search-filter') {
      currentFilters.search = e.target.value;
      debounce(applyFilters, 300)();
    }
  });

  // Filter form changes
  document.addEventListener('change', function(e) {
    switch(e.target.id) {
      case 'category-filter':
        currentFilters.category = e.target.value;
        applyFilters();
        break;
      case 'min-price':
        currentFilters.minPrice = parseInt(e.target.value) || 0;
        applyFilters();
        break;
      case 'max-price':
        currentFilters.maxPrice = parseInt(e.target.value) || 10000000;
        applyFilters();
        break;
      case 'state-filter':
        currentFilters.state = e.target.value;
        updateCityOptions(e.target.value);
        applyFilters();
        break;
      case 'city-filter':
        currentFilters.city = e.target.value;
        applyFilters();
        break;
      case 'rating-filter':
        currentFilters.rating = parseFloat(e.target.value);
        applyFilters();
        break;
      case 'instant-book-filter':
        currentFilters.instantBook = e.target.checked;
        applyFilters();
        break;
    }
  });

  // Apply filters button
  document.addEventListener('click', function(e) {
    if (e.target.id === 'apply-filters') {
      applyFilters();
      // Close mobile offcanvas
      const offcanvas = document.querySelector('#filtersOffcanvas');
      if (offcanvas && offcanvas.classList.contains('show')) {
        offcanvas.classList.remove('show');
        document.body.style.overflow = '';
      }
    }
    
    if (e.target.id === 'clear-filters') {
      clearFilters();
    }
  });
}

function setupSortEventListener() {
  const sortSelect = document.querySelector('#sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      sortListings(this.value);
      renderListings();
    });
  }
}

function updateCityOptions(stateValue) {
  const citySelect = document.querySelector('#city-filter');
  if (!citySelect) return;

  const cityOptions = {
    'Lagos': ['Lagos Island', 'Victoria Island', 'Ikeja', 'Lekki', 'Surulere'],
    'FCT': ['Abuja', 'Gwagwalada', 'Kuje', 'Bwari'],
    'Rivers': ['Port Harcourt', 'Obio-Akpor', 'Eleme'],
    'Oyo': ['Ibadan', 'Ogbomoso', 'Oyo'],
    'Enugu': ['Enugu', 'Nsukka', 'Oji River'],
    'Kano': ['Kano', 'Wudil', 'Gwarzo']
  };

  citySelect.innerHTML = '<option value="">All Cities</option>';
  
  if (stateValue && cityOptions[stateValue]) {
    cityOptions[stateValue].forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }
}

function applyFilters() {
  filteredListings = allListings.filter(listing => {
    // Search filter
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      const matchesSearch = 
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.category.toLowerCase().includes(searchTerm) ||
        listing.vendor_name.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (currentFilters.category && listing.service_category_id != currentFilters.category) {
      return false;
    }

    // Price filter
    if (listing.base_price_cents < currentFilters.minPrice || 
        listing.base_price_cents > currentFilters.maxPrice) {
      return false;
    }

    // Location filters
    if (currentFilters.state && listing.state !== currentFilters.state) {
      return false;
    }
    
    if (currentFilters.city && listing.city !== currentFilters.city) {
      return false;
    }

    // Rating filter
    if (currentFilters.rating > 0 && listing.rating < currentFilters.rating) {
      return false;
    }

    // Instant book filter
    if (currentFilters.instantBook && !listing.instant_book) {
      return false;
    }

    return true;
  });

  renderListings();
  updateResultsCount();
}

function sortListings(sortBy) {
  switch(sortBy) {
    case 'price-low':
      filteredListings.sort((a, b) => a.base_price_cents - b.base_price_cents);
      break;
    case 'price-high':
      filteredListings.sort((a, b) => b.base_price_cents - a.base_price_cents);
      break;
    case 'rating':
      filteredListings.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
    default:
      filteredListings.sort((a, b) => b.id - a.id);
      break;
  }
}

function renderListings() {
  const container = document.querySelector('#listings-grid');
  if (!container) return;

  if (filteredListings.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="text-center py-5">
          <i class="fas fa-search fa-3x text-muted mb-3"></i>
          <h5>No services found</h5>
          <p class="text-muted">Try adjusting your filters or search terms</p>
          <button class="btn btn-outline-success" id="clear-filters">Clear Filters</button>
        </div>
      </div>
    `;
    return;
  }

  // For demo purposes, show all results on one page
  // In production, this would be paginated
  container.innerHTML = filteredListings.map(listing => renderListingCard(listing)).join('');
  
  // Initialize pagination
  initializePagination(filteredListings.length, 12); // 12 items per page
}

function updateResultsCount() {
  const resultsCount = document.querySelector('#results-count');
  if (resultsCount) {
    const count = filteredListings.length;
    const total = allListings.length;
    resultsCount.textContent = `Showing ${count} of ${total} services`;
  }
}

function clearFilters() {
  currentFilters = {
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000000,
    country: '',
    state: '',
    city: '',
    rating: 0,
    instantBook: false
  };

  // Reset form inputs
  const searchInput = document.querySelector('#search-filter');
  const categorySelect = document.querySelector('#category-filter');
  const minPriceInput = document.querySelector('#min-price');
  const maxPriceInput = document.querySelector('#max-price');
  const stateSelect = document.querySelector('#state-filter');
  const citySelect = document.querySelector('#city-filter');
  const ratingSelect = document.querySelector('#rating-filter');
  const instantBookCheck = document.querySelector('#instant-book-filter');

  if (searchInput) searchInput.value = '';
  if (categorySelect) categorySelect.value = '';
  if (minPriceInput) minPriceInput.value = '';
  if (maxPriceInput) maxPriceInput.value = '';
  if (stateSelect) stateSelect.value = '';
  if (citySelect) citySelect.innerHTML = '<option value="">All Cities</option>';
  if (ratingSelect) ratingSelect.value = '0';
  if (instantBookCheck) instantBookCheck.checked = false;

  applyFilters();
}

// Debounce function for search input
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export for use in other modules
export { applyFilters, currentFilters, filteredListings };