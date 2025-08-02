let eventsData = [];
let currentSlide = 0;

fetch('events.json?v=' + Date.now()) 
  .then(res => res.json())
  .then(data => {
    eventsData = data;
    buildSlides();
    
    currentSlide = document.querySelectorAll('.year-slide').length - 1;
    updateCarousel();
  });

document.getElementById('cyberFilter').addEventListener('change', buildSlides);
document.getElementById('othersFilter').addEventListener('change', buildSlides);

function buildSlides() {
  const carousel = document.querySelector('.carousel');
  carousel.innerHTML = '';

  const years = [...new Set(eventsData.map(e => e.year))].sort();
  const cyberChecked = document.getElementById('cyberFilter').checked;
  const othersChecked = document.getElementById('othersFilter').checked;

  years.forEach(year => {
    const slide = document.createElement('div');
    slide.className = 'year-slide';

    const title = document.createElement('h2');
    title.textContent = year;
    slide.appendChild(title);

    const timeline = document.createElement('div');
    timeline.className = 'timeline';
    timeline.dataset.year = year;

    let pos = 0;
    const events = eventsData.filter(e =>
      e.year === year &&
      ((cyberChecked && e.category === 'cyber') || (othersChecked && e.category === 'others'))
    );

    events.forEach((event, index) => {
      const div = document.createElement('div');
      div.className = `event ${pos++ % 2 === 0 ? 'left' : 'right'} category-${event.category}`;
      div.innerHTML = `<h4>${event.title}</h4><p>${event.description}</p>`;

      if (index >= 3) {
        div.classList.add('hidden');
        div.style.maxHeight = '0';
      }

      timeline.appendChild(div);
    });

    slide.appendChild(timeline);

    if (events.length > 3) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'show-more-btn';
      toggleBtn.textContent = 'Show More';
      toggleBtn.addEventListener('click', () => toggleEvents(timeline, toggleBtn));
      slide.appendChild(toggleBtn);
    }

    carousel.appendChild(slide);
  });

  observeEvents();
  updateCarousel();
}

function toggleEvents(timeline, button) {
  const events = timeline.querySelectorAll('.event');
  const isCollapsed = Array.from(events).slice(3).some(e => e.classList.contains('hidden'));

  events.forEach((event, index) => {
    if (index >= 3) {
      if (isCollapsed) {
        event.classList.remove('hidden');
        event.style.maxHeight = event.scrollHeight + 'px';
      } else {
        event.style.maxHeight = '0';
        event.classList.add('hidden');
      }
    }
  });

  button.textContent = isCollapsed ? 'Show Less' : 'Show More';
}

function observeEvents() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.event').forEach(el => observer.observe(el));
}

function changeSlide(direction) {
  const slides = document.querySelectorAll('.year-slide');
  currentSlide = Math.max(0, Math.min(currentSlide + direction, slides.length - 1));
  updateCarousel();
}

function updateCarousel() {
  const carousel = document.querySelector('.carousel');
  const slideWidth = carousel.offsetWidth;
  carousel.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

  const slides = document.querySelectorAll('.year-slide');
  const leftBtn = document.querySelector('.nav-btn.left');
  const rightBtn = document.querySelector('.nav-btn.right');

  leftBtn.style.display = currentSlide === 0 ? 'none' : 'block';
  rightBtn.style.display = currentSlide === slides.length - 1 ? 'none' : 'block';
}
if (events.length > 3) {
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'show-more-btn';
  toggleBtn.textContent = 'Show More';
  toggleBtn.addEventListener('click', () => toggleEvents(timeline, toggleBtn));
  slide.appendChild(toggleBtn);
}