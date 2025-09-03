// Toast notification system
let toastContainer;

export function initializeToasts() {
  // Create toast container if it doesn't exist
  if (!document.querySelector('.toast-container')) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  } else {
    toastContainer = document.querySelector('.toast-container');
  }
}

export function showToast(message, type = 'info', duration = 3000) {
  if (!toastContainer) {
    initializeToasts();
  }

  const toastId = 'toast-' + Date.now();
  const iconMap = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };

  const colorMap = {
    success: 'text-success',
    error: 'text-danger',
    warning: 'text-warning',
    info: 'text-primary'
  };

  const toast = document.createElement('div');
  toast.className = 'toast show';
  toast.id = toastId;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  toast.innerHTML = `
    <div class="toast-header">
      <i class="${iconMap[type]} ${colorMap[type]} me-2"></i>
      <strong class="me-auto">Eventro e-Hub</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  `;

  toastContainer.appendChild(toast);

  // Auto-remove toast after duration
  setTimeout(() => {
    removeToast(toastId);
  }, duration);

  // Handle manual close
  const closeBtn = toast.querySelector('.btn-close');
  closeBtn.addEventListener('click', () => {
    removeToast(toastId);
  });
}

function removeToast(toastId) {
  const toast = document.getElementById(toastId);
  if (toast) {
    toast.classList.add('fade');
    setTimeout(() => {
      toast.remove();
    }, 150);
  }
}

// CSS for toast (add to styles.css if not already present)
const toastStyles = `
.toast {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  margin-bottom: 0.5rem;
  min-width: 300px;
  opacity: 1;
  transition: opacity 0.15s ease-in-out;
}

.toast.fade {
  opacity: 0;
}

.toast-header {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  color: #6c757d;
  background-color: rgba(255, 255, 255, 0.85);
  background-clip: padding-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  border-top-left-radius: calc(0.5rem - 1px);
  border-top-right-radius: calc(0.5rem - 1px);
}

.toast-body {
  padding: 0.75rem;
  word-wrap: break-word;
}

.btn-close {
  box-sizing: content-box;
  width: 1em;
  height: 1em;
  padding: 0.25em 0.25em;
  color: #000;
  background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='m2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z'/%3e%3c/svg%3e") center/1em auto no-repeat;
  border: 0;
  border-radius: 0.375rem;
  opacity: 0.5;
  cursor: pointer;
}

.btn-close:hover {
  opacity: 0.75;
}
`;

// Inject toast styles if not already present
if (!document.querySelector('#toast-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'toast-styles';
  styleSheet.textContent = toastStyles;
  document.head.appendChild(styleSheet);
}