/**
 * Events Module - Dynamically renders events from JSON data
 * Modular solution for easy event management
 */

async function loadAndRenderEvents() {
  try {
    // Load events data
    const response = await fetch('js/data/events.json');
    const data = await response.json();
    
    // Render events
    renderEvents(data.eventSeries);
  } catch (error) {
    console.error('Error loading events:', error);
  }
}

function renderEvents(eventSeriesArray) {
  const eventsContainer = document.querySelector('.events-content');
  
  if (!eventsContainer) {
    console.warn('Events container not found');
    return;
  }
  
  // Clear existing content
  eventsContainer.innerHTML = '';
  
  // Render each event series
  eventSeriesArray.forEach(event => {
    const eventHTML = createEventHTML(event);
    eventsContainer.innerHTML += eventHTML;
  });
}

function createEventHTML(event) {
  const sessionsHTML = event.sessions
    .map(session => `<li>${session.date}: ${session.topic}</li>`)
    .join('');
  
  return `
    <div class="event-item" data-event-id="${event.id}">
      <h3 class="events-event-title">${event.title}</h3>
      <p class="events-text">${event.description}</p>

      <h4 class="events-subtitle">About the Event:</h4>
      <p class="events-text">${event.about}</p>

      <h4 class="events-subtitle">Zoom Event Series:</h4>
      <p class="events-text">${event.schedule}</p>
      <ul class="events-list">
        ${sessionsHTML}
      </ul>

      <h4 class="events-subtitle">The Importance of these Discussions:</h4>
      <p class="events-text">${event.importance}</p>

      <a href="#" class="events-btn">REGISTER NOW</a>
    </div>
  `;
}

// Load events when DOM is ready
document.addEventListener('DOMContentLoaded', loadAndRenderEvents);
