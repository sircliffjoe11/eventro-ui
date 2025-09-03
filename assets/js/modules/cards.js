// Card rendering and management
import { showToast } from './toast.js';

export async function loadCategories() {
  try {
    const response = await fetch('../assets/js/data/categories.json');
    const categories = await response.json();
    renderCategories(categories);
  } catch (error) {
    console.error('Error loading categories:', error);
    renderFallbackCategories();
  }
}

export async function loadFeaturedListings() {
  try {
    const response = await fetch('../assets/js/data/listings.json');
    const listings = await response.json();
    const featured = listings.filter(listing => listing.featured).slice(0, 6);
    renderFeaturedListings(featured);
  } catch (error) {
    console.error('Error loading featured listings:', error);
    renderFallbackListings();
  }
}

function renderCategories(categories) {
  const container = document.querySelector('#featured-categories');
  if (!container) return;

  container.innerHTML = categories.slice(0, 8).map(category => `
    <div class="col-sm-6 col-lg-3">
      <a href="../ehub/listings.html?category=${category.id}" class="text-decoration-none">
        <div class="card category-card h-100 hover-lift">
          <div class="card-body">
            <i class="${category.icon} fa-2x text-success mb-3"></i>
            <h6 class="card-title">${category.name}</h6>
            <p class="card-text text-muted small">${category.description || 'Professional services'}</p>
          </div>
        </div>
      </a>
    </div>
  `).join('');
}

function renderFeaturedListings(listings) {
  const container = document.querySelector('#featured-listings');
  if (!container) return;

  container.innerHTML = listings.map(listing => `
    <div class="col-sm-6 col-lg-4">
      <div class="card listing-card h-100">
        <div class="position-relative">
          <img src="${listing.photo}" class="card-img-top" alt="${listing.title}" style="height: 200px; object-fit: cover;">
          <button class="save-btn position-absolute" style="top: 0.75rem; right: 0.75rem;" aria-label="Save listing">
            <i class="far fa-heart"></i>
          </button>
          ${listing.instant_book ? '<span class="badge bg-primary position-absolute" style="top: 0.75rem; left: 0.75rem;">Instant Book</span>' : ''}
        </div>
        <div class="card-body">
          <span class="badge bg-success mb-2">${listing.category}</span>
          <h6 class="card-title">${listing.title}</h6>
          <div class="d-flex align-items-center mb-2">
            <div class="rating me-2">
              ${generateStars(listing.rating)}
            </div>
            <small class="text-muted">${listing.rating} (${listing.reviews_count} reviews)</small>
          </div>
          <p class="text-muted mb-2">
            <i class="fas fa-map-marker-alt me-1"></i>${listing.city}, ${listing.state}
          </p>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="price">From ${formatPrice(listing.base_price_cents)}</div>
              <small class="text-muted">per ${listing.pricing_unit || 'service'}</small>
            </div>
            <a href="../ehub/listing.html?id=${listing.id}" class="btn btn-outline-success btn-sm">View Details</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderFallbackCategories() {
  const fallbackCategories = [
    { id: 1, name: 'Catering', icon: 'fas fa-utensils' },
    { id: 2, name: 'Sound System', icon: 'fas fa-volume-up' },
    { id: 3, name: 'Photography', icon: 'fas fa-camera' },
    { id: 4, name: 'Decoration', icon: 'fas fa-palette' },
    { id: 5, name: 'Entertainment', icon: 'fas fa-music' },
    { id: 6, name: 'Transportation', icon: 'fas fa-car' },
    { id: 7, name: 'Security', icon: 'fas fa-shield-alt' },
    { id: 8, name: 'Cleaning', icon: 'fas fa-broom' }
  ];
  
  renderCategories(fallbackCategories);
}

function renderFallbackListings() {
  const fallbackListings = [
    {
      id: 1,
      title: "Professional Sound System",
      category: "Sound System Rental",
      city: "Lagos",
      state: "Lagos",
      rating: 4.9,
      reviews_count: 23,
      base_price_cents: 150000,
      photo: "../assets/img/placeholders/listing-01.jpg",
      instant_book: true
    },
    {
      id: 2,
      title: "Wedding Photography",
      category: "Photography",
      city: "Abuja",
      state: "FCT",
      rating: 4.7,
      reviews_count: 45,
      base_price_cents: 500000,
      photo: "../assets/img/placeholders/listing-02.jpg",
      instant_book: false
    },
    {
      id: 3,
      title: "Premium Catering Service",
      category: "Catering",
      city: "Port Harcourt",
      state: "Rivers",
      rating: 4.8,
      reviews_count: 67,
      base_price_cents: 2500000,
      photo: "../assets/img/placeholders/listing-03.jpg",
      instant_book: true
    }
  ];
  
  renderFeaturedListings(fallbackListings);
}

export function renderListingCard(listing) {
  return `
    <div class="col-sm-6 col-lg-4">
      <div class="card listing-card h-100">
        <div class="position-relative">
          <img src="${listing.photo}" class="card-img-top" alt="${listing.title}" style="height: 200px; object-fit: cover;">
          <button class="save-btn position-absolute" style="top: 0.75rem; right: 0.75rem;" aria-label="Save listing">
            <i class="far fa-heart"></i>
          </button>
          ${listing.instant_book ? '<span class="badge bg-primary position-absolute" style="top: 0.75rem; left: 0.75rem;">Instant Book</span>' : ''}
        </div>
        <div class="card-body">
          <span class="badge bg-success mb-2">${listing.category}</span>
          <h6 class="card-title">${listing.title}</h6>
          <div class="d-flex align-items-center mb-2">
            <div class="rating me-2">
              ${generateStars(listing.rating)}
            </div>
            <small class="text-muted">${listing.rating} (${listing.reviews_count} reviews)</small>
          </div>
          <p class="text-muted mb-2">
            <i class="fas fa-map-marker-alt me-1"></i>${listing.city}, ${listing.state}
          </p>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="price">From ${formatPrice(listing.base_price_cents)}</div>
              <small class="text-muted">per ${listing.pricing_unit || 'service'}</small>
            </div>
            <a href="../ehub/listing.html?id=${listing.id}" class="btn btn-outline-success btn-sm">View Details</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Utility functions
function formatPrice(priceInCents) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(priceInCents);
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHtml = '';
  
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star text-warning"></i>';
  }
  
  if (hasHalfStar) {
    starsHtml += '<i class="fas fa-star-half-alt text-warning"></i>';
  }
  
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star text-warning"></i>';
  }
  
  return starsHtml;
}