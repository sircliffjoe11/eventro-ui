// City cascading functionality for location selectors
let locationData = {
  countries: [],
  states: [],
  cities: []
};

document.addEventListener('DOMContentLoaded', function() {
  if (shouldInitializeCascade()) {
    initializeCityCascade();
  }
});

function shouldInitializeCascade() {
  return document.querySelector('#country') || 
         document.querySelector('#country-filter') ||
         window.location.pathname.includes('listing-form.html');
}

async function initializeCityCascade() {
  try {
    await loadLocationData();
    setupCascadeEventListeners();
    populateCountries();
  } catch (error) {
    console.error('Error initializing city cascade:', error);
    loadFallbackLocationData();
  }
}

async function loadLocationData() {
  try {
    const [countriesResponse, statesResponse, citiesResponse] = await Promise.all([
      fetch('../assets/js/data/locations/countries.json'),
      fetch('../assets/js/data/locations/states.json'),
      fetch('../assets/js/data/locations/cities.json')
    ]);

    locationData.countries = await countriesResponse.json();
    locationData.states = await statesResponse.json();
    locationData.cities = await citiesResponse.json();
  } catch (error) {
    throw new Error('Failed to load location data');
  }
}

function loadFallbackLocationData() {
  locationData = {
    countries: [
      { id: 1, name: "Nigeria", code: "NG" }
    ],
    states: [
      { id: 1, name: "Lagos", country_id: 1, code: "LA" },
      { id: 2, name: "FCT", country_id: 1, code: "FC" },
      { id: 3, name: "Rivers", country_id: 1, code: "RI" },
      { id: 4, name: "Oyo", country_id: 1, code: "OY" },
      { id: 5, name: "Enugu", country_id: 1, code: "EN" },
      { id: 6, name: "Kano", country_id: 1, code: "KN" },
      { id: 7, name: "Kaduna", country_id: 1, code: "KD" },
      { id: 8, name: "Plateau", country_id: 1, code: "PL" },
      { id: 9, name: "Delta", country_id: 1, code: "DE" },
      { id: 10, name: "Anambra", country_id: 1, code: "AN" }
    ],
    cities: [
      // Lagos State
      { id: 1, name: "Lagos Island", state_id: 1 },
      { id: 2, name: "Victoria Island", state_id: 1 },
      { id: 3, name: "Ikeja", state_id: 1 },
      { id: 4, name: "Lekki", state_id: 1 },
      { id: 5, name: "Surulere", state_id: 1 },
      { id: 6, name: "Yaba", state_id: 1 },
      
      // FCT
      { id: 7, name: "Abuja", state_id: 2 },
      { id: 8, name: "Gwagwalada", state_id: 2 },
      { id: 9, name: "Kuje", state_id: 2 },
      { id: 10, name: "Bwari", state_id: 2 },
      
      // Rivers State
      { id: 11, name: "Port Harcourt", state_id: 3 },
      { id: 12, name: "Obio-Akpor", state_id: 3 },
      { id: 13, name: "Eleme", state_id: 3 },
      
      // Oyo State
      { id: 14, name: "Ibadan", state_id: 4 },
      { id: 15, name: "Ogbomoso", state_id: 4 },
      { id: 16, name: "Oyo", state_id: 4 },
      
      // Enugu State
      { id: 17, name: "Enugu", state_id: 5 },
      { id: 18, name: "Nsukka", state_id: 5 },
      { id: 19, name: "Oji River", state_id: 5 },
      
      // Kano State
      { id: 20, name: "Kano", state_id: 6 },
      { id: 21, name: "Wudil", state_id: 6 },
      { id: 22, name: "Gwarzo", state_id: 6 }
    ]
  };
  
  populateCountries();
  setupCascadeEventListeners();
}

function populateCountries() {
  const countrySelects = document.querySelectorAll('#country, #country-filter');
  
  countrySelects.forEach(select => {
    if (select) {
      // Clear existing options except the first one
      const firstOption = select.querySelector('option');
      select.innerHTML = '';
      if (firstOption) {
        select.appendChild(firstOption);
      }

      locationData.countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.id;
        option.textContent = country.name;
        if (country.name === 'Nigeria') {
          option.selected = true;
        }
        select.appendChild(option);
      });

      // Auto-populate states for Nigeria
      if (select.value) {
        populateStates(parseInt(select.value), select);
      }
    }
  });
}

function populateStates(countryId, triggerSelect) {
  const stateSelects = getRelatedSelects(triggerSelect, 'state');
  
  stateSelects.forEach(select => {
    if (select) {
      const firstOption = select.querySelector('option');
      select.innerHTML = '';
      if (firstOption) {
        select.appendChild(firstOption);
      }

      const states = locationData.states.filter(state => state.country_id === countryId);
      states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.id;
        option.textContent = state.name;
        select.appendChild(option);
      });

      select.disabled = states.length === 0;
      
      // Clear cities when states change
      clearCities(triggerSelect);
    }
  });
}

function populateCities(stateId, triggerSelect) {
  const citySelects = getRelatedSelects(triggerSelect, 'city');
  
  citySelects.forEach(select => {
    if (select) {
      const firstOption = select.querySelector('option');
      select.innerHTML = '';
      if (firstOption) {
        select.appendChild(firstOption);
      }

      const cities = locationData.cities.filter(city => city.state_id === stateId);
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.id;
        option.textContent = city.name;
        select.appendChild(option);
      });

      select.disabled = cities.length === 0;
    }
  });
}

function clearCities(triggerSelect) {
  const citySelects = getRelatedSelects(triggerSelect, 'city');
  
  citySelects.forEach(select => {
    if (select) {
      const firstOption = select.querySelector('option');
      select.innerHTML = '';
      if (firstOption) {
        select.appendChild(firstOption);
      }
      select.disabled = true;
    }
  });
}

function getRelatedSelects(triggerSelect, type) {
  // Determine if we're in a form context or filter context
  const container = triggerSelect.closest('form') || triggerSelect.closest('.card-body') || document;
  
  const selectors = {
    state: ['#state', '#state-filter'],
    city: ['#city', '#city-filter']
  };
  
  return selectors[type].map(selector => container.querySelector(selector)).filter(Boolean);
}

function setupCascadeEventListeners() {
  // Country change
  document.addEventListener('change', function(e) {
    if (e.target.matches('#country, #country-filter')) {
      const countryId = parseInt(e.target.value);
      if (countryId) {
        populateStates(countryId, e.target);
      } else {
        clearStatesAndCities(e.target);
      }
    }
  });

  // State change
  document.addEventListener('change', function(e) {
    if (e.target.matches('#state, #state-filter')) {
      const stateId = parseInt(e.target.value);
      if (stateId) {
        populateCities(stateId, e.target);
      } else {
        clearCities(e.target);
      }
    }
  });
}

function clearStatesAndCities(triggerSelect) {
  const stateSelects = getRelatedSelects(triggerSelect, 'state');
  const citySelects = getRelatedSelects(triggerSelect, 'city');
  
  [...stateSelects, ...citySelects].forEach(select => {
    if (select) {
      const firstOption = select.querySelector('option');
      select.innerHTML = '';
      if (firstOption) {
        select.appendChild(firstOption);
      }
      select.disabled = true;
    }
  });
}

// Export functions for external use
export { populateStates, populateCities, locationData };