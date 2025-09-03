// Main application initialization
import { initializeToasts, showToast } from './modules/toast.js';
import { loadCategories, loadFeaturedListings } from './modules/cards.js';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeToasts();
  initializePage();
  setupGlobalEventListeners();
});

function initializePage() {
  const currentPage = getCurrentPage();
  
  switch(currentPage) {
    case 'home':
      initializeHomePage();
      break;
    case 'listings':
      initializeListingsPage();
      break;
    case 'listing-detail':
      initializeListingDetailPage();
      break;
    case 'event-services':
      initializeEventServicesPage();
      break;
    case 'checkout':
      initializeCheckoutPage();
      break;
    case 'vendor-dashboard':
      initializeVendorDashboard();
      break;
    case 'auth':
      initializeAuthPages();
      break;
  }
}

function getCurrentPage() {
  const path = window.location.pathname;
  
  if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
    return 'home';
  } else if (path.includes('listings.html')) {
    return 'listings';
  } else if (path.includes('listing.html')) {
    return 'listing-detail';
  } else if (path.includes('event-services.html')) {
    return 'event-services';
  } else if (path.includes('checkout.html')) {
    return 'checkout';
  } else if (path.includes('vendor/dashboard.html')) {
    return 'vendor-dashboard';
  } else if (path.includes('auth/')) {
    return 'auth';
  }
  
  return 'unknown';
}

async function initializeHomePage() {
  try {
    await loadCategories();
    await loadFeaturedListings();
  } catch (error) {
    console.error('Error initializing home page:', error);
    showToast('Error loading page content', 'error');
  }
}

function initializeListingsPage() {
  // Listings page initialization is handled by filters.js module
  console.log('Listings page initialized');
}

function initializeListingDetailPage() {
  loadListingDetail();
  setupGallery();
  setupBookingForm();
}

function initializeEventServicesPage() {
  // Event services initialization is handled by cart.js module
  console.log('Event services page initialized');
}

function initializeCheckoutPage() {
  // Checkout initialization is handled by checkout.js module
  console.log('Checkout page initialized');
}

function initializeVendorDashboard() {
  loadVendorDashboardData();
}

function initializeAuthPages() {
  setupAuthForms();
}

function setupGlobalEventListeners() {
  // Save/favorite functionality
  document.addEventListener('click', function(e) {
    if (e.target.matches('.save-btn') || e.target.closest('.save-btn')) {
      e.preventDefault();
      const btn = e.target.closest('.save-btn');
      const icon = btn.querySelector('i');
      
      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.classList.add('saved');
        showToast('Added to saved services', 'success');
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.classList.remove('saved');
        showToast('Removed from saved services', 'info');
      }
    }
  });

  // Password toggle functionality
  document.addEventListener('click', function(e) {
    if (e.target.matches('#toggle-password') || e.target.closest('#toggle-password')) {
      e.preventDefault();
      const button = e.target.closest('#toggle-password');
      const passwordInput = document.querySelector('#password');
      const icon = button.querySelector('i');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    }
  });

  // Account type toggle in registration
  document.addEventListener('change', function(e) {
    if (e.target.name === 'account-type') {
      const vendorFields = document.querySelector('#vendor-fields');
      if (vendorFields) {
        if (e.target.value === 'vendor') {
          vendorFields.classList.remove('d-none');
        } else {
          vendorFields.classList.add('d-none');
        }
      }
    }
  });
}

function loadListingDetail() {
  // Load listing detail data
  const listingData = {
    id: 1,
    title: "Professional Sound System for Events",
    category: "Sound System Rental",
    vendor: {
      name: "SoundWave Productions",
      avatar: "../assets/img/placeholders/avatar-01.jpg",
      responseTime: "2 hours"
    },
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviewsCount: 23,
    gallery: [
      "../assets/img/placeholders/listing-01.jpg",
      "../assets/img/placeholders/listing-02.jpg",
      "../assets/img/placeholders/listing-03.jpg"
    ],
    packages: [
      {
        id: 1,
        name: "Basic Package (4 hrs)",
        unit: "hourly",
        price: 150000,
        includes: ["Professional mixing console", "2 High-quality speakers", "2 Wireless microphones", "Setup and breakdown"]
      },
      {
        id: 2,
        name: "Premium Package (8 hrs)",
        unit: "daily",
        price: 250000,
        includes: ["Professional mixing console", "4 High-quality speakers", "4 Wireless microphones", "Lighting effects", "Setup and breakdown", "Technical support"]
      },
      {
        id: 3,
        name: "Full Event Package",
        unit: "event",
        price: 600000,
        includes: ["Complete sound system", "Professional DJ booth", "Wireless microphones", "Stage lighting", "Backup equipment", "Full technical crew"]
      }
    ]
  };

  // Render packages
  renderPackages(listingData.packages);
  
  // Load reviews
  loadReviews();
  
  // Load similar services
  loadSimilarServices();
}

function renderPackages(packages) {
  const container = document.querySelector('#packages-list');
  if (!container) return;

  container.innerHTML = packages.map(pkg => `
    <div class="col-12">
      <div class="package-option" data-package-id="${pkg.id}">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="package" id="package-${pkg.id}" value="${pkg.id}">
          <label class="form-check-label w-100" for="package-${pkg.id}">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="mb-1">${pkg.name}</h6>
                <p class="text-muted mb-2">${formatPrice(pkg.price)} per ${pkg.unit.replace('ly', '').replace('event', 'event')}</p>
                <div class="d-flex flex-wrap gap-1">
                  ${pkg.includes.map(item => `<span class="tag">${item}</span>`).join('')}
                </div>
              </div>
              <div class="text-end">
                <div class="price">${formatPrice(pkg.price)}</div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  `).join('');

  // Setup package selection
  container.addEventListener('change', function(e) {
    if (e.target.type === 'radio') {
      // Remove selected class from all packages
      container.querySelectorAll('.package-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      
      // Add selected class to chosen package
      const selectedOption = e.target.closest('.package-option');
      selectedOption.classList.add('selected');
      
      // Update booking sidebar
      updateBookingSidebar(packages.find(p => p.id == e.target.value));
    }
  });
}

function updateBookingSidebar(selectedPackage) {
  const selectedPackageDiv = document.querySelector('#selected-package');
  const bookingForm = document.querySelector('#booking-form');
  
  if (!selectedPackage) return;

  selectedPackageDiv.innerHTML = `
    <div class="border rounded p-3 bg-light">
      <h6 class="mb-1">${selectedPackage.name}</h6>
      <p class="text-muted mb-0">${formatPrice(selectedPackage.price)} per ${selectedPackage.unit.replace('ly', '').replace('event', 'event')}</p>
    </div>
  `;
  
  bookingForm.classList.remove('d-none');
  updatePricing(selectedPackage);
}

function updatePricing(selectedPackage) {
  const quantity = parseInt(document.querySelector('#quantity').value) || 1;
  const subtotal = selectedPackage.price * quantity;
  const deposit = Math.round(subtotal * 0.3);
  
  document.querySelector('#subtotal').textContent = formatPrice(subtotal);
  document.querySelector('#deposit').textContent = formatPrice(deposit);
}

function setupGallery() {
  const mainImage = document.querySelector('#main-image');
  const thumbnails = document.querySelectorAll('.gallery-thumb');
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
      // Remove active class from all thumbnails
      thumbnails.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked thumbnail
      this.classList.add('active');
      
      // Update main image
      if (mainImage) {
        mainImage.src = this.src;
        mainImage.alt = this.alt;
      }
    });
  });
  
  // Set first thumbnail as active
  if (thumbnails.length > 0) {
    thumbnails[0].classList.add('active');
  }
}

function setupBookingForm() {
  const qtyMinus = document.querySelector('#qty-minus');
  const qtyPlus = document.querySelector('#qty-plus');
  const qtyInput = document.querySelector('#quantity');
  const addToEventBtn = document.querySelector('#add-to-event-btn');

  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener('click', function() {
      const currentValue = parseInt(qtyInput.value) || 1;
      if (currentValue > 1) {
        qtyInput.value = currentValue - 1;
        updatePricingFromForm();
      }
    });

    qtyPlus.addEventListener('click', function() {
      const currentValue = parseInt(qtyInput.value) || 1;
      qtyInput.value = currentValue + 1;
      updatePricingFromForm();
    });

    qtyInput.addEventListener('change', updatePricingFromForm);
  }

  if (addToEventBtn) {
    addToEventBtn.addEventListener('click', function() {
      const selectedPackageRadio = document.querySelector('input[name="package"]:checked');
      if (selectedPackageRadio) {
        // This would integrate with cart.js in a real app
        showToast('Service added to your event!', 'success');
        setTimeout(() => {
          window.location.href = '../organizer/event-services.html';
        }, 1500);
      }
    });
  }
}

function updatePricingFromForm() {
  const selectedPackageRadio = document.querySelector('input[name="package"]:checked');
  if (selectedPackageRadio) {
    // Find the package data (this would come from a data store in real app)
    const packages = [
      { id: 1, price: 150000 },
      { id: 2, price: 250000 },
      { id: 3, price: 600000 }
    ];
    
    const selectedPackage = packages.find(p => p.id == selectedPackageRadio.value);
    if (selectedPackage) {
      updatePricing(selectedPackage);
    }
  }
}

function loadReviews() {
  const reviewsContainer = document.querySelector('#reviews-list');
  if (!reviewsContainer) return;

  const reviews = [
    {
      id: 1,
      userName: "Adebayo Ogundimu",
      rating: 5,
      body: "Excellent service! The sound quality was crystal clear throughout our wedding reception. The team was professional and arrived early for setup.",
      createdAt: "2024-11-15"
    },
    {
      id: 2,
      userName: "Chioma Nwankwo",
      rating: 5,
      body: "SoundWave Productions made our corporate event a huge success. Great equipment and very responsive to our needs during the event.",
      createdAt: "2024-10-28"
    },
    {
      id: 3,
      userName: "Ibrahim Musa",
      rating: 4,
      body: "Good service overall. The sound system worked perfectly for our outdoor event. Would recommend for medium to large events.",
      createdAt: "2024-10-10"
    }
  ];

  reviewsContainer.innerHTML = reviews.map(review => `
    <div class="border-bottom pb-3 mb-3">
      <div class="d-flex align-items-center mb-2">
        <div class="rating me-3">
          ${generateStars(review.rating)}
        </div>
        <strong>${review.userName}</strong>
        <span class="text-muted ms-auto">${formatDate(review.createdAt)}</span>
      </div>
      <p class="mb-0">${review.body}</p>
    </div>
  `).join('');
}

function loadSimilarServices() {
  const container = document.querySelector('#similar-services');
  if (!container) return;

  // This would load from the same data source as the main listings
  const similarServices = [
    {
      id: 2,
      title: "Wedding DJ & Entertainment",
      category: "MC/Compere",
      price: 200000,
      rating: 4.7,
      photo: "../assets/img/placeholders/listing-02.jpg",
      vendor: "DJ Master Mix"
    },
    {
      id: 3,
      title: "Professional Stage Lighting",
      category: "Lighting",
      price: 300000,
      rating: 4.8,
      photo: "../assets/img/placeholders/listing-03.jpg",
      vendor: "Light Pro Services"
    }
  ];

  container.innerHTML = similarServices.map(service => `
    <div class="col-md-6">
      <div class="card listing-card h-100">
        <div class="position-relative">
          <img src="${service.photo}" class="card-img-top" alt="${service.title}">
          <button class="save-btn" aria-label="Save listing">
            <i class="far fa-heart"></i>
          </button>
        </div>
        <div class="card-body">
          <span class="badge bg-success mb-2">${service.category}</span>
          <h6 class="card-title">${service.title}</h6>
          <div class="d-flex align-items-center mb-2">
            <div class="rating me-2">
              ${generateStars(service.rating)}
            </div>
            <small class="text-muted">${service.rating}</small>
          </div>
          <p class="text-muted mb-2">by ${service.vendor}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="price">From ${formatPrice(service.price)}</div>
            <a href="listing.html" class="btn btn-outline-success btn-sm">View</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function loadVendorDashboardData() {
  const recentOrdersContainer = document.querySelector('#recent-orders');
  if (!recentOrdersContainer) return;

  const recentOrders = [
    {
      id: "EH-001234",
      event: "Sarah's Wedding",
      eventDate: "Dec 15, 2025",
      amount: 150000,
      deposit: 45000,
      status: "pending"
    },
    {
      id: "EH-001235",
      event: "Corporate Launch",
      eventDate: "Jan 20, 2025",
      amount: 600000,
      deposit: 180000,
      status: "confirmed"
    },
    {
      id: "EH-001236",
      event: "Birthday Party",
      eventDate: "Nov 28, 2024",
      amount: 250000,
      deposit: 75000,
      status: "completed"
    }
  ];

  recentOrdersContainer.innerHTML = recentOrders.map(order => `
    <tr>
      <td><a href="order.html" class="text-decoration-none">#${order.id}</a></td>
      <td>${order.event}</td>
      <td>${order.eventDate}</td>
      <td class="fw-bold">${formatPrice(order.amount)}</td>
      <td>
        <span class="badge status-${order.status}">
          ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </td>
      <td>
        <a href="order.html" class="btn btn-sm btn-outline-primary">
          <i class="fas fa-eye"></i>
        </a>
      </td>
    </tr>
  `).join('');
}

function setupAuthForms() {
  // Enhanced form validation for auth pages
  const forms = document.querySelectorAll('form[novalidate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm(form)) {
        // Simulate successful authentication
        showToast('Authentication successful!', 'success');
        
        // Redirect based on form type
        setTimeout(() => {
          if (form.id === 'login-form') {
            window.location.href = '../vendor/dashboard.html';
          } else if (form.id === 'register-form') {
            const accountType = form.querySelector('input[name="account-type"]:checked').value;
            if (accountType === 'vendor') {
              window.location.href = '../vendor/dashboard.html';
            } else {
              window.location.href = '../index.html';
            }
          }
        }, 1500);
      }
    });
  });
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('is-invalid');
      isValid = false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }
  });

  // Email validation
  const emailInputs = form.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (input.value && !emailRegex.test(input.value)) {
      input.classList.add('is-invalid');
      isValid = false;
    }
  });

  // Password confirmation
  const password = form.querySelector('#password');
  const confirmPassword = form.querySelector('#confirm-password');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.classList.add('is-invalid');
    isValid = false;
  }

  form.classList.add('was-validated');
  return isValid;
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

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHtml = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star text-warning"></i>';
  }
  
  // Half star
  if (hasHalfStar) {
    starsHtml += '<i class="fas fa-star-half-alt text-warning"></i>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star text-warning"></i>';
  }
  
  return starsHtml;
}

// Export utilities for use in other modules
window.EventroUtils = {
  formatPrice,
  formatDate,
  generateStars,
  showToast
};