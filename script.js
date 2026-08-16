const cards = document.querySelectorAll('.card, .split-content');

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

// --- Stopka widoczna (przypieta) tylko w sekcji Kontakt ---
const kontaktSection = document.getElementById('kontakt');
const siteFooter = document.querySelector('.site-footer');
if (kontaktSection && siteFooter) {
  const footerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        siteFooter.classList.toggle('is-pinned', entry.isIntersecting);
      });
    },
    {
      threshold: 0.4,
    }
  );

  footerObserver.observe(kontaktSection);
}

// --- Formularz kontaktowy (przykladowa obsluga bez backendu) ---
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    contactForm.reset();
    window.alert('Dziekujemy! Wiadomosc zostala wyslana (przykladowa obsluga formularza).');
  });
}

// --- Auto-przesuwajace sie zdjecia w sekcjach z galeria (Historia, Sezonowe) ---
document.querySelectorAll('.history-media').forEach((media) => {
  const photos = media.querySelectorAll('.history-photo');
  if (photos.length < 2) return;

  const dotsId = media.getAttribute('data-dots');
  const dotsWrap = dotsId ? document.getElementById(dotsId) : null;
  let index = 0;

  function renderDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    photos.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Pokaz zdjecie ${i + 1}`);
      if (i === index) dot.classList.add('is-active');
      dot.addEventListener('click', () => setIndex(i));
      dotsWrap.appendChild(dot);
    });
  }

  function setIndex(newIndex) {
    photos[index].classList.remove('is-active');
    index = newIndex;
    photos[index].classList.add('is-active');
    renderDots();
  }

  renderDots();
  setInterval(() => setIndex((index + 1) % photos.length), 3500);
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

// --- Rojowisko pszczol: krolowa i robotnice, ktore czasem ja odwiedzaja ---
const scene = document.querySelector('.scene');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (scene && !reduceMotion) {
  const WORKER_COUNT = 18;

  function randomPoint() {
    return {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight * (0.15 + Math.random() * 0.55),
    };
  }

  function spawnBee(isQueen) {
    const el = document.createElement('div');
    el.className = isQueen ? 'scene-bee scene-queen' : 'scene-bee';
    el.textContent = isQueen ? '👑' : '🐝';
    scene.appendChild(el);
    const start = randomPoint();
    return {
      el,
      x: start.x,
      y: start.y,
      targetX: start.x,
      targetY: start.y,
      speed: isQueen ? 0.012 : 0.028 + Math.random() * 0.02,
      wanderUntil: 0,
      visitQueenUntil: 0,
    };
  }

  const queen = spawnBee(true);
  const workers = Array.from({ length: WORKER_COUNT }, () => spawnBee(false));

  function pickWanderTarget(bee) {
    const point = randomPoint();
    bee.targetX = point.x;
    bee.targetY = point.y;
    bee.wanderUntil = performance.now() + 3000 + Math.random() * 4000;
  }

  pickWanderTarget(queen);
  workers.forEach(pickWanderTarget);

  function moveTowards(bee, factor) {
    const prevX = bee.x;
    bee.x += (bee.targetX - bee.x) * factor;
    bee.y += (bee.targetY - bee.y) * factor;
    const flip = bee.targetX < prevX ? -1 : 1;
    bee.el.style.transform = `translate3d(${bee.x}px, ${bee.y}px, 0) scaleX(${flip})`;
  }

  function tick() {
    const now = performance.now();

    if (now > queen.wanderUntil) pickWanderTarget(queen);
    moveTowards(queen, queen.speed);

    workers.forEach((bee) => {
      if (now < bee.visitQueenUntil) {
        bee.targetX = queen.x + (Math.random() - 0.5) * 60;
        bee.targetY = queen.y + (Math.random() - 0.5) * 60;
      } else if (now > bee.wanderUntil) {
        if (Math.random() < 0.15) {
          bee.visitQueenUntil = now + 1800 + Math.random() * 1800;
        } else {
          pickWanderTarget(bee);
        }
      }

      moveTowards(bee, bee.speed);
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

