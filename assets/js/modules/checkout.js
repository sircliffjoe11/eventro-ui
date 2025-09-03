// Checkout functionality
import { showToast } from './toast.js';
import { clearCart } from './cart.js';

let checkoutCart = [];
const PROCESSING_FEE = 5000; // ₦5,000 processing fee

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('checkout.html')) {
    initializeCheckout();
  }
  
  if (window.location.pathname.includes('order-confirmation.html')) {
    initializeConfirmation();
  }
});

function initializeCheckout() {
  loadCheckoutCart();
  renderCheckoutItems();
  updateCheckoutTotals();
  setupCheckoutEventListeners();
}

function loadCheckoutCart() {
  const savedCart = localStorage.getItem('eventro-checkout-cart');
  if (savedCart) {
    try {
      checkoutCart = JSON.parse(savedCart);
    } catch (error) {
      console.error('Error loading checkout cart:', error);
      checkoutCart = [];
    }
  }

  // Redirect if cart is empty
  if (checkoutCart.length === 0) {
    showToast('Your cart is empty', 'warning');
    setTimeout(() => {
      window.location.href = 'ehub/listings.html';
    }, 2000);
  }
}

function renderCheckoutItems() {
  const container = document.querySelector('#checkout-items');
  if (!container || checkoutCart.length === 0) return;

  container.innerHTML = checkoutCart.map(item => {
    const subtotal = item.pricePerUnit * item.quantity;
    const deposit = Math.round(subtotal * 0.3);
    
    return `
      <div class="border-bottom pb-3 mb-3">
        <div class="d-flex align-items-center">
          <img src="${item.vendorAvatar}" alt="${item.vendorName}" class="rounded-circle me-3" style="width: 40px; height: 40px; object-fit: cover;">
          <div class="flex-grow-1">
            <h6 class="mb-1">${item.title}</h6>
            <p class="text-muted mb-1">${item.packageName}</p>
            <small class="text-muted">by ${item.vendorName}</small>
          </div>
          <div class="text-end">
            <div class="fw-bold">${formatPrice(subtotal)}</div>
            <small class="text-muted">Qty: ${item.quantity}</small>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function updateCheckoutTotals() {
  const subtotal = checkoutCart.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);
  const deposit = Math.round(subtotal * 0.3);
  const total = deposit + PROCESSING_FEE;

  const subtotalElement = document.querySelector('#checkout-subtotal');
  const processingFeeElement = document.querySelector('#processing-fee');
  const totalElement = document.querySelector('#checkout-total');

  if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
  if (processingFeeElement) processingFeeElement.textContent = formatPrice(PROCESSING_FEE);
  if (totalElement) totalElement.textContent = formatPrice(total);
}

function setupCheckoutEventListeners() {
  const paymentForm = document.querySelector('#payment-form');
  const payNowBtn = document.querySelector('#pay-now-btn');

  if (paymentForm && payNowBtn) {
    payNowBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (validatePaymentForm(paymentForm)) {
        processPayment();
      }
    });
  }

  // Format card number input
  const cardNumberInput = document.querySelector('#card-number');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }

  // Format expiry input
  const expiryInput = document.querySelector('#expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }

  // Format CVC input
  const cvcInput = document.querySelector('#cvc');
  if (cvcInput) {
    cvcInput.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
  }
}

function validatePaymentForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll('input[required], select[required]');

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('is-invalid');
      isValid = false;
    } else {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
    }
  });

  // Validate card number (basic check)
  const cardNumber = form.querySelector('#card-number');
  if (cardNumber && cardNumber.value.replace(/\s/g, '').length < 16) {
    cardNumber.classList.add('is-invalid');
    isValid = false;
  }

  // Validate expiry date
  const expiry = form.querySelector('#expiry');
  if (expiry && !/^\d{2}\/\d{2}$/.test(expiry.value)) {
    expiry.classList.add('is-invalid');
    isValid = false;
  }

  // Validate CVC
  const cvc = form.querySelector('#cvc');
  if (cvc && cvc.value.length < 3) {
    cvc.classList.add('is-invalid');
    isValid = false;
  }

  // Check terms agreement
  const termsCheck = form.querySelector('#terms-agree');
  if (termsCheck && !termsCheck.checked) {
    termsCheck.classList.add('is-invalid');
    isValid = false;
  }

  form.classList.add('was-validated');
  return isValid;
}

function processPayment() {
  const payNowBtn = document.querySelector('#pay-now-btn');
  
  if (payNowBtn) {
    // Show loading state
    payNowBtn.disabled = true;
    payNowBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    
    // Simulate payment processing
    setTimeout(() => {
      // Generate order reference
      const orderRef = 'EH-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6);
      
      // Store order data for confirmation page
      const orderData = {
        reference: orderRef,
        items: checkoutCart,
        subtotal: checkoutCart.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0),
        processingFee: PROCESSING_FEE,
        deposit: Math.round(checkoutCart.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0) * 0.3) + PROCESSING_FEE,
        processedAt: new Date().toISOString()
      };
      
      localStorage.setItem('eventro-last-order', JSON.stringify(orderData));
      
      // Clear checkout cart
      localStorage.removeItem('eventro-checkout-cart');
      
      // Clear main cart
      clearCart();
      
      // Redirect to confirmation
      window.location.href = 'order-confirmation.html';
      
    }, 2000); // 2 second delay to simulate processing
  }
}

function initializeConfirmation() {
  const orderData = localStorage.getItem('eventro-last-order');
  
  if (orderData) {
    try {
      const order = JSON.parse(orderData);
      renderOrderConfirmation(order);
    } catch (error) {
      console.error('Error loading order data:', error);
    }
  }
}

function renderOrderConfirmation(order) {
  const orderReference = document.querySelector('#order-reference');
  const paidAmount = document.querySelector('#paid-amount');
  const confirmedServices = document.querySelector('#confirmed-services');

  if (orderReference) {
    orderReference.textContent = order.reference;
  }

  if (paidAmount) {
    paidAmount.textContent = formatPrice(order.deposit);
  }

  if (confirmedServices && order.items) {
    confirmedServices.innerHTML = order.items.map(item => `
      <div class="d-flex align-items-center border-bottom pb-3 mb-3">
        <img src="${item.vendorAvatar}" alt="${item.vendorName}" class="rounded-circle me-3" style="width: 50px; height: 50px; object-fit: cover;">
        <div class="flex-grow-1">
          <h6 class="mb-1">${item.title}</h6>
          <p class="text-muted mb-1">${item.packageName}</p>
          <small class="text-muted">by ${item.vendorName} • Qty: ${item.quantity}</small>
        </div>
        <div class="text-end">
          <div class="fw-bold">${formatPrice(item.pricePerUnit * item.quantity)}</div>
          <span class="badge bg-success">Confirmed</span>
        </div>
      </div>
    `).join('');
  }
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

// Export functions
export { processPayment, PROCESSING_FEE };