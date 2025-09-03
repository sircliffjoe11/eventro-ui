// Pagination functionality
let currentPage = 1;
let itemsPerPage = 12;
let totalItems = 0;

export function initializePagination(total, perPage = 12) {
  totalItems = total;
  itemsPerPage = perPage;
  currentPage = 1;
  renderPagination();
}

export function renderPagination() {
  const paginationContainer = document.querySelector('#pagination');
  if (!paginationContainer) return;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  let paginationHTML = '';

  // Previous button
  if (currentPage > 1) {
    paginationHTML += `
      <li class="page-item">
        <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
    `;
  } else {
    paginationHTML += `
      <li class="page-item disabled">
        <span class="page-link" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </span>
      </li>
    `;
  }

  // Page numbers
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    paginationHTML += `
      <li class="page-item">
        <a class="page-link" href="#" data-page="1">1</a>
      </li>
    `;
    if (startPage > 2) {
      paginationHTML += `
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
      `;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      paginationHTML += `
        <li class="page-item active" aria-current="page">
          <span class="page-link">${i}</span>
        </li>
      `;
    } else {
      paginationHTML += `
        <li class="page-item">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    }
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
      `;
    }
    paginationHTML += `
      <li class="page-item">
        <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
      </li>
    `;
  }

  // Next button
  if (currentPage < totalPages) {
    paginationHTML += `
      <li class="page-item">
        <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    `;
  } else {
    paginationHTML += `
      <li class="page-item disabled">
        <span class="page-link" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </span>
      </li>
    `;
  }

  paginationContainer.innerHTML = paginationHTML;

  // Add event listeners
  paginationContainer.addEventListener('click', function(e) {
    if (e.target.matches('a.page-link[data-page]')) {
      e.preventDefault();
      const page = parseInt(e.target.getAttribute('data-page'));
      goToPage(page);
    }
  });
}

export function goToPage(page) {
  currentPage = page;
  renderPagination();
  
  // Scroll to top of results
  const listingsGrid = document.querySelector('#listings-grid');
  if (listingsGrid) {
    listingsGrid.scrollIntoView({ behavior: 'smooth' });
  }
  
  // In a real app, this would trigger a re-render of the listings
  // For this demo, we'll just update the pagination UI
}

export function getCurrentPage() {
  return currentPage;
}

export function getItemsPerPage() {
  return itemsPerPage;
}