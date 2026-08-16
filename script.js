const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  {
    threshold: 0.25,
  }
);

cards.forEach((card) => observer.observe(card));

// --- Auto-przesuwajace sie zdjecia w sekcjach z galeria (Historia, Sezonowe) ---
document.querySelectorAll('.history-media').forEach((media) => {
  const photos = media.querySelectorAll('.history-photo');
  if (photos.length < 2) return;
  let index = 0;
  setInterval(() => {
    photos[index].classList.remove('is-active');
    index = (index + 1) % photos.length;
    photos[index].classList.add('is-active');
  }, 3500);
});

// --- Karuzela produktow (przykladowe dane) ---
const products = [
  { emoji: '🍯', name: 'Miod lipowy', desc: 'Delikatny, kwiatowy aromat z lipowych lasow.', color: '#d9932b' },
  { emoji: '🌾', name: 'Miod gryczany', desc: 'Intensywny, cieply smak na jesienne dni.', color: '#8a5a2b' },
  { emoji: '🌼', name: 'Miod wielokwiatowy', desc: 'Bogactwo lakowych kwiatow w jednym sloiku.', color: '#c77d1e' },
  { emoji: '🐝', name: 'Pierzga pszczela', desc: 'Naturalne wsparcie odpornosci prosto z ula.', color: '#b8860b' },
  { emoji: '✨', name: 'Propolis', desc: 'Cenny produkt pszczeli o silnych wlasciwosciach.', color: '#6f4e1e' },
];

const track = document.getElementById('carouselTrack');
const dotsWrap = document.getElementById('carouselDots');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');

let activeIndex = 0;
let autoTimer;

function renderCarousel() {
  if (!track) return;

  track.innerHTML = '';
  products.forEach((product, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.style.background = `linear-gradient(150deg, ${product.color}, #2b2015)`;
    if (index === activeIndex) slide.classList.add('is-active');
    slide.innerHTML = `
      <span class="emoji">${product.emoji}</span>
      <h3>${product.name}</h3>
      <p>${product.desc}</p>
    `;
    track.appendChild(slide);
  });

  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    products.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Przejdz do produktu ${index + 1}`);
      if (index === activeIndex) dot.classList.add('is-active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsWrap.appendChild(dot);
    });
  }
}

function goToSlide(index) {
  activeIndex = (index + products.length) % products.length;
  renderCarousel();
  resetAutoplay();
}

function nextSlide() {
  goToSlide(activeIndex + 1);
}

function prevSlide() {
  goToSlide(activeIndex - 1);
}

function resetAutoplay() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextSlide, 4000);
}

if (track) {
  renderCarousel();
  resetAutoplay();
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
}

