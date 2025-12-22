const slides = [
  {
    url: "https://images.unsplash.com/photo-1601643157091-ce5c665179ab",
    title: "Street Art",
    description: "L'art urbain dans toute sa splendeur"
  },
  {
    url: "https://images.unsplash.com/photo-1520262494112-9fe481d36ec3",
    title: "Musique Live",
    description: "Ambiance électrique en concert"
  },
  {
    url: "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d",
    title: "Urban Style",
    description: "La mode urbaine dans les rues"
  },
  {
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    title: "Hip-Hop Culture",
    description: "L'essence de la culture urbaine"
  }
];

class AccordionSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeIndex = 0;
    this.isAutoPlaying = true;
    this.autoPlayInterval = null;
    this.isMobile = window.innerWidth < 640;
    this.init();
  }

  init() {
    this.createSlides();
    this.startAutoPlay();
    this.addEventListeners();
    this.updateProgressBar();
    this.handleResize();
  }

  createSlides() {
    slides.forEach((slide, index) => {
      const slideElement = document.createElement('div');
      slideElement.className = `slide ${index === 0 ? 'active' : ''}`;
      
      slideElement.innerHTML = `
        <div class="slide-bg" style="background-image: url(${slide.url})"></div>
        <div class="slide-overlay"></div>
        <div class="slide-content">
          <h2 class="slide-title">${slide.title}</h2>
          <p class="slide-description">${slide.description}</p>
        </div>
        <div class="vertical-title">
          <h3>${slide.title}</h3>
        </div>
      `;

      slideElement.addEventListener('click', () => this.setActiveSlide(index));
      this.container.appendChild(slideElement);
    });
  }

  setActiveSlide(index) {
    const slides = this.container.querySelectorAll('.slide');
    slides[this.activeIndex].classList.remove('active');
    slides[index].classList.add('active');
    this.activeIndex = index;
    this.updateProgressBar();
  }

  startAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    this.autoPlayInterval = setInterval(() => {
      this.setActiveSlide((this.activeIndex + 1) % slides.length);
    }, 3000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const progress = ((this.activeIndex + 1) * 100) / slides.length;
    progressFill.style.width = `${progress}%`;
  }

  handleResize() {
    const checkMobile = () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < 640;
      
      if (wasMobile !== this.isMobile) {
        this.container.innerHTML = '';
        this.createSlides();
        this.setActiveSlide(this.activeIndex);
      }
    };

    window.addEventListener('resize', () => {
      checkMobile();
    });
  }

  addEventListeners() {
    // Touch events pour mobile
    let touchStartX = 0;
    let touchStartY = 0;

    this.container.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      this.stopAutoPlay();
    });

    this.container.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 50) {
          this.setActiveSlide(Math.max(0, this.activeIndex - 1));
        } else if (deltaX < -50) {
          this.setActiveSlide(Math.min(slides.length - 1, this.activeIndex + 1));
        }
      }
      
      this.startAutoPlay();
    });

    // Mouse events pour desktop
    this.container.addEventListener('mouseenter', () => {
      this.stopAutoPlay();
    });

    this.container.addEventListener('mouseleave', () => {
      this.startAutoPlay();
    });
  }
}

// Initialize the slider when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AccordionSlider('accordion-slider');
});