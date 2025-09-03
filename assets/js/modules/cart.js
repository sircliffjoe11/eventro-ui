// Shopping cart functionality for event services
import { showToast } from './toast.js';

let cart = [];
const DEPOSIT_PERCENTAGE = 0.3; // 30% deposit

document.addEventListener('DOMContentLoaded', function() {
  loadCartFromStorage();
  
  if (window.location.pathname.includes('event-services.html')) {
    initializeEventServicesPage();
  }
  
  if (window.location.pathname.includes('listing.html')) {
    setupAddToCartButton();
  }
});

function loadCartFromStorage() {
  const savedCart = localStorage.getItem('eventro-cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (error) {
      console.error('Error parsing cart data:', error);
      cart = [];
    }
  }
}

function saveCartToStorage() {
  localStorage.setItem('eventro-cart', JSON.stringify(cart));
}

function addToCart(item) {
  // Check if item already exists in cart
  const existingIndex = cart.findIndex(cartItem => 
    cartItem.listingId === item.listingId && cartItem.packageId === item.packageId
  );

  if (existingIndex >= 0) {
    // Update quantity
    cart[existingIndex].quantity += item.quantity;
  } else {
    // Add new item
    cart.push({
      id: Date.now(), // Simple ID generation
      listingId: item.listingId,
      packageId: item.packageId,
      title: item.title,
      packageName: item.packageName,
      vendorName: item.vendorName,
      vendorAvatar: item.vendorAvatar,
      pricePerUnit: item.pricePerUnit,
      unit: item.unit,
      quantity: item.quantity,
      addedAt: new Date().toISOString()
    });
  }

  saveCartToStorage();
  showToast(`${item.title} added to your event!`, 'success');
  updateCartBadge();
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCartToStorage();
  updateCartBadge();
  
  if (window.location.pathname.includes('event-services.html')) {
    renderCartItems();
    updateOrderSummary();
  }
}

function updateCartQuantity(itemId, newQuantity) {
  const item = cart.find(item => item.id === itemId);
  if (item && newQuantity > 0) {
    item.quantity = newQuantity;
    saveCartToStorage();
    
    if (window.location.pathname.includes('event-services.html')) {
      renderCartItems();
      updateOrderSummary();
    }
  }
}

function initializeEventServicesPage() {
  renderCartItems();
  updateOrderSummary();
  setupEventServicesEventListeners();
}

function renderCartItems() {
  const cartContainer = document.querySelector('#cart-items');
  const emptyCart = document.querySelector('#empty-cart');
  
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.classList.add('d-none');
    if (emptyCart) emptyCart.classList.remove('d-none');
    return;
  }

  if (emptyCart) emptyCart.classList.add('d-none');
  cartContainer.classList.remove('d-none');

  cartContainer.innerHTML = `
    <div class="table-responsive">
      <table class="table">
        <thead class="table-light">
          <tr>
            <th>Service</th>
            <th>Package</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${cart.map(item => renderCartItem(item)).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderCartItem(item) {
  const subtotal = item.pricePerUnit * item.quantity;
  
  return `
    <tr data-item-id="${item.id}">
      <td>
        <div class="d-flex align-items-center">
          <img src="${item.vendorAvatar}" alt="${item.vendorName}" class="rounded-circle me-3" style="width: 40px; height: 40px; object-fit: cover;">
          <div>
            <div class="fw-bold">${item.title}</div>
            <small class="text-muted">by ${item.vendorName}</small>
          </div>
        </div>
      </td>
      <td>
        <div>
          <div class="fw-bold">${item.packageName}</div>
          <small class="text-muted">${formatPrice(item.pricePerUnit)} per ${item.unit}</small>
        </div>
      </td>
      <td>
        <div class="d-flex align-items-center" style="width: 120px;">
          <button class="btn btn-sm btn-outline-secondary qty-btn" data-action="decrease" data-item-id="${item.id}">
            <i class="fas fa-minus"></i>
          </button>
          <input type="number" class="form-control form-control-sm text-center mx-2" value="${item.quantity}" min="1" style="width: 60px;" data-item-id="${item.id}">
          <button class="btn btn-sm btn-outline-secondary qty-btn" data-action="increase" data-item-id="${item.id}">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </td>
      <td class="fw-bold">${formatPrice(item.pricePerUnit)}</td>
      <td class="fw-bold text-success">${formatPrice(subtotal)}</td>
      <td>
        <span class="badge bg-warning">Pending</span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-danger remove-item-btn" data-item-id="${item.id}" title="Remove from cart">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `;
}

function setupEventServicesEventListeners() {
  const cartContainer = document.querySelector('#cart-items');
  const payDepositBtn = document.querySelector('#pay-deposit-btn');

  if (cartContainer) {
    cartContainer.addEventListener('click', function(e) {
      const itemId = parseInt(e.target.getAttribute('data-item-id'));
      
      if (e.target.matches('.remove-item-btn') || e.target.closest('.remove-item-btn')) {
        e.preventDefault();
        removeFromCart(itemId);
        showToast('Service removed from your event', 'info');
      }
      
      if (e.target.matches('.qty-btn') || e.target.closest('.qty-btn')) {
        e.preventDefault();
        const action = e.target.closest('.qty-btn').getAttribute('data-action');
        const item = cart.find(item => item.id === itemId);
        
        if (item) {
          if (action === 'increase') {
            updateCartQuantity(itemId, item.quantity + 1);
          } else if (action === 'decrease' && item.quantity > 1) {
            updateCartQuantity(itemId, item.quantity - 1);
          }
        }
      }
    });

    cartContainer.addEventListener('change', function(e) {
      if (e.target.matches('input[type="number"]')) {
        const itemId = parseInt(e.target.getAttribute('data-item-id'));
        const newQuantity = parseInt(e.target.value);
        
        if (newQuantity > 0) {
          updateCartQuantity(itemId, newQuantity);
        }
      }
    });
  }

  if (payDepositBtn) {
    payDepositBtn.addEventListener('click', function() {
      if (cart.length > 0) {
        // Transfer cart to checkout
        localStorage.setItem('eventro-checkout-cart', JSON.stringify(cart));
        window.location.href = '../checkout.html';
      }
    });
  }
}

function setupAddToCartButton() {
  const addToEventBtn = document.querySelector('#add-to-event-btn');
  
  if (addToEventBtn) {
    addToEventBtn.addEventListener('click', function() {
      const selectedPackageRadio = document.querySelector('input[name="package"]:checked');
      const quantityInput = document.querySelector('#quantity');
      
      if (!selectedPackageRadio) {
        showToast('Please select a package first', 'warning');
        return;
      }

      const quantity = parseInt(quantityInput.value) || 1;
      
      // Get package data (this would come from the page data in a real app)
      const packageData = getSelectedPackageData(selectedPackageRadio.value);
      
      if (packageData) {
        const cartItem = {
          listingId: 1, // This would be dynamic
          packageId: parseInt(selectedPackageRadio.value),
          title: "Professional Sound System for Events",
          packageName: packageData.name,
          vendorName: "SoundWave Productions",
          vendorAvatar: "../assets/img/placeholders/avatar-01.jpg",
          pricePerUnit: packageData.price,
          unit: packageData.unit,
          quantity: quantity
        };

        addToCart(cartItem);
        
        // Redirect to event services page after a short delay
        setTimeout(() => {
          window.location.href = '../organizer/event-services.html';
        }, 1500);
      }
    });
  }
}

function getSelectedPackageData(packageId) {
  const packages = {
    1: { name: "Basic Package (4 hrs)", price: 150000, unit: "hourly" },
    2: { name: "Premium Package (8 hrs)", price: 250000, unit: "daily" },
    3: { name: "Full Event Package", price: 600000, unit: "event" }
  };
  
  return packages[packageId];
}

function updateOrderSummary() {
  const servicesCount = document.querySelector('#services-count');
  const cartSubtotal = document.querySelector('#cart-subtotal');
  const cartDeposit = document.querySelector('#cart-deposit');
  const payDepositBtn = document.querySelector('#pay-deposit-btn');

  if (!servicesCount || !cartSubtotal || !cartDeposit) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);
  const deposit = Math.round(subtotal * DEPOSIT_PERCENTAGE);

  servicesCount.textContent = totalItems;
  cartSubtotal.textContent = formatPrice(subtotal);
  cartDeposit.textContent = formatPrice(deposit);

  if (payDepositBtn) {
    payDepositBtn.disabled = cart.length === 0;
  }
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  badges.forEach(badge => {
    badge.textContent = itemCount;
    badge.style.display = itemCount > 0 ? 'inline' : 'none';
  });
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);
}

function getCartDeposit() {
  return Math.round(getCartTotal() * DEPOSIT_PERCENTAGE);
}

function clearCart() {
  cart = [];
  saveCartToStorage();
  updateCartBadge();
}

// Utility function
function formatPrice(priceInCents) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(priceInCents);
}

// Export functions for use in other modules
export { 
  addToCart, 
  removeFromCart, 
  updateCartQuantity, 
  getCartTotal, 
  getCartDeposit, 
  clearCart,
  cart
};