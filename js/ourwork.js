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

  mapInstance = L.map('map').setView([defaultMapView.lat, defaultMapView.lng], defaultMapView.zoom);

  L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenTopoMap contributors',
    maxZoom: 17,
    opacity: 0.85
  }).addTo(mapInstance);

  fetch('js/data/locations.json')
    .then(response => response.json())
    .then(data => {
      const locations = data.locations;
      
      locations.forEach((location, index) => {
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

        // Generate popup content
        const popupContent = `
          <div class="popup-template">
            <h4 class="popup-title">${location.country}</h4>
            <p class="popup-institution">${location.institution}</p>
            <div class="popup-buttons">
              <a href="${location.website}" target="_blank" class="popup-link popup-visit">Google Map</a>
            </div>
          </div>
        `;

        // Add popup with content
        marker.bindPopup(popupContent, {
          closeButton: true,
          maxWidth: 300,
          className: 'custom-popup'
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
    
    // Scroll to map
    const mapElement = document.getElementById('map');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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

  // Publications tabs functionality
  const publicationTabs = document.querySelectorAll('.publication-tab');
  publicationTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const year = this.getAttribute('data-year');
      
      // Remove active class from all tabs
      publicationTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Hide all publication years
      const allYears = document.querySelectorAll('.publication-year');
      allYears.forEach(yearDiv => yearDiv.classList.remove('active'));
      
      // Show selected year
      const selectedYear = document.getElementById(`year-${year}`);
      if (selectedYear) {
        selectedYear.classList.add('active');
      }
    });
  });

  // Commitment Cards Carousel functionality - Carousel 1
    let currentSlide = 0;
    const totalSlides = 3;
    const track = document.getElementById('commitmentTrack');
    const dots = document.querySelectorAll('#commitmentDots .dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    // Dot click handlers - Carousel 1
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // Arrow button handlers - Carousel 1
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide((currentSlide + 1) % totalSlides);
        });
    }

    // Commitment Cards Carousel functionality - Carousel 2
    let currentSlide2 = 0;
    const track2 = document.getElementById('commitmentTrack2');
    const dots2 = document.querySelectorAll('#commitmentDots2 .dot');
    const prevBtn2 = document.getElementById('prevBtn2');
    const nextBtn2 = document.getElementById('nextBtn2');

    function goToSlide2(index) {
        currentSlide2 = index;
        track2.style.transform = `translateX(-${currentSlide2 * 100}%)`;
        dots2.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide2);
        });
    }

    // Dot click handlers - Carousel 2
    dots2.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide2(index);
        });
    });

    // Arrow button handlers - Carousel 2
    if (prevBtn2) {
        prevBtn2.addEventListener('click', () => {
            goToSlide2((currentSlide2 - 1 + totalSlides) % totalSlides);
        });
    }

    if (nextBtn2) {
        nextBtn2.addEventListener('click', () => {
            goToSlide2((currentSlide2 + 1) % totalSlides);
        });
    }

});
