let mapInstance = null;
const defaultMapView = { lat: 15, lng: -60, zoom: 2.5 }; // Store default view

function initMap() {
  // Wait for Leaflet to be available
  if (typeof L === 'undefined') {
    console.error('Leaflet library not loaded');
    return;
  }

  const mapElement = document.getElementById('map');
  if (!mapElement) {
    console.error('Map element not found');
    return;
  }

  // Create map centered on Latin America
  mapInstance = L.map('map').setView([defaultMapView.lat, defaultMapView.lng], defaultMapView.zoom);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
    opacity: 0.85
  }).addTo(mapInstance);

  // Load locations from JSON data file
  fetch('js/data/locations.json')
    .then(response => response.json())
    .then(data => {
      const locations = data.locations;
      
      locations.forEach((location, index) => {
        // Create custom icon using FontAwesome
        const markerIcon = L.divIcon({
          html: `<div class="leaflet-marker-icon-custom">
                   <i class="fa-solid fa-location-dot"></i>
                 </div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
          className: 'leaflet-div-icon-custom'
        });

        const marker = L.marker([location.lat, location.lng], {
          icon: markerIcon,
          title: location.country
        }).addTo(mapInstance);

        // Generate popup content with i18n support
        const popupContent = `
          <div class="popup-template">
            <h4 class="popup-title">${location.country}</h4>
            <p class="popup-institution">${location.institution}</p>
            <div class="popup-buttons">
              <a href="${location.website}" target="_blank" data-i18n="popup.visit" class="popup-link popup-visit">Visit</a>
            </div>
          </div>
        `;

        // Add popup with content
        marker.bindPopup(popupContent, {
          closeButton: true,
          maxWidth: 300,
          className: 'custom-popup'
        });

        // Translate button when popup is opened
        marker.on('popupopen', function() {
          if (typeof i18n !== 'undefined') {
            setTimeout(() => {
              i18n.reapply();
            }, 50);
          }
        });

        // Add animation on marker creation
        const iconElement = marker.getElement();
        if (iconElement) {
          iconElement.style.animation = `fadeInScale 0.5s ease-out ${index * 100}ms`;
        }
      });
    })
    .catch(error => console.error('Error loading locations:', error));
}

// Function to navigate to a location
function goToLocation(lat, lng, zoom = 6) {
  if (mapInstance) {
    mapInstance.setView([lat, lng], zoom, {
      animate: true,
      duration: 1
    });
  }
}

// Function to reset map to default view
function resetMap() {
  if (mapInstance) {
    mapInstance.setView([defaultMapView.lat, defaultMapView.lng], defaultMapView.zoom, {
      animate: true,
      duration: 1
    });
  }
}

// Function to populate accordion with locations from JSON
function populateAccordion() {
  fetch('js/data/locations.json')
    .then(response => response.json())
    .then(data => {
      const locations = data.locations;
      const accordionContainer = document.querySelector('.where-accordion');
      
      // Group locations by country
      const groupedByCountry = {};
      locations.forEach(location => {
        if (!groupedByCountry[location.country]) {
          groupedByCountry[location.country] = [];
        }
        groupedByCountry[location.country].push(location);
      });

      // Clear existing accordion items
      accordionContainer.innerHTML = '';

      // Create accordion items for each country
      Object.entries(groupedByCountry).forEach(([country, countryLocations]) => {
        const detailsElement = document.createElement('details');
        detailsElement.className = 'accordion-item';
        detailsElement.setAttribute('data-location', country);

        let summaryHTML = `
          <summary class="accordion-header">
            <span class="accordion-icon">+</span>
            <span class="accordion-label">${country}</span>
          </summary>
        `;

        let contentHTML = '<div class="accordion-content">';
        
        countryLocations.forEach(location => {
          contentHTML += `
            <div class="institution-row">
              <span>${location.institution}</span>
              <button class="go-to-location-btn" data-lat="${location.lat}" data-lng="${location.lng}">
                <i class="fa-solid fa-magnifying-glass-location"></i>
              </button>
            </div>
          `;
        });

        contentHTML += '</div>';

        detailsElement.innerHTML = summaryHTML + contentHTML;
        accordionContainer.appendChild(detailsElement);
      });

      // Re-attach event listeners to the newly created buttons
      attachLocationButtonListeners();
      reattachAccordionListeners();
    })
    .catch(error => console.error('Error populating accordion:', error));
}

// Function to attach event listeners to location buttons
function attachLocationButtonListeners() {
  document.querySelectorAll('.go-to-location-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lat = parseFloat(btn.dataset.lat);
      const lng = parseFloat(btn.dataset.lng);
      goToLocation(lat, lng, 13);
    });
  });
}

// Function to re-attach accordion listeners
function reattachAccordionListeners() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach((item, index) => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      accordionItems.forEach((otherItem, otherIndex) => {
        if (otherIndex !== index && otherItem.open) {
          const content = otherItem.querySelector('.accordion-content');
          content.style.maxHeight = content.scrollHeight + 'px';
          
          otherItem.offsetHeight;
          
          content.style.maxHeight = '0';
          
          setTimeout(() => {
            otherItem.open = false;
          }, 300);
        }
      });
      
      if (!this.open) {
        this.open = true;
        
        setTimeout(() => {
          const content = this.querySelector('.accordion-content');
          content.style.maxHeight = content.scrollHeight + 'px';
          
          this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
      } else {
        const content = this.querySelector('.accordion-content');
        content.style.maxHeight = content.scrollHeight + 'px';
        
        this.offsetHeight;
        
        content.style.maxHeight = '0';
        
        setTimeout(() => {
          this.open = false;
        }, 300);
      }
    }, true);
  });
}

document.addEventListener('DOMContentLoaded', function () {

  // Cargar acordeón desde JSON
  populateAccordion();

  // Inicializar mapa
  if (typeof L !== 'undefined') {
    initMap();
  } else {
    const checkLeaflet = setInterval(() => {
      if (typeof L !== 'undefined') {
        clearInterval(checkLeaflet);
        initMap();
      }
    }, 100);
    setTimeout(() => clearInterval(checkLeaflet), 5000);
  }

  // Botón Reset Map
  const resetBtn = document.getElementById('resetMapBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetMap);
  }

});
