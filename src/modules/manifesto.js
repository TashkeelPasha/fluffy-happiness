import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { manifesto } from '../data/content.js';

export function mountManifesto() {
  const el = document.getElementById('manifesto');
  if (!el) return;

  const BASE = import.meta.env.BASE_URL;
  const total = manifesto.carousel.length;

  const words = manifesto.body
    .split(' ')
    .map(
      (word) =>
        `<span class="word">${word
          .split('')
          .map((c) => `<span class="char">${c}</span>`)
          .join('')}</span>`
    )
    .join(' ');

  el.innerHTML = `
    <div class="container manifesto">
      <header class="manifesto__head">
        <span class="eyebrow manifesto__eyebrow">${manifesto.eyebrow}</span>
        <span class="manifesto__count label">01 / ${String(total).padStart(2, '0')}</span>
      </header>

      <div class="manifesto__grid">
        <div class="manifesto__left">
          <h2 id="manifesto-title" class="manifesto__body">${words}</h2>
          <p class="manifesto__positioning">${manifesto.positioning}</p>
        </div>

        <aside class="manifesto__right">
          <div class="carousel carousel--photos" data-cursor>
            <div class="carousel__stage">
              ${manifesto.carousel
                .map(
                  (p, i) => `
                <figure class="carousel__slide${i === 0 ? ' is-active' : ''}" data-index="${i}" aria-hidden="${i === 0 ? 'false' : 'true'}">
                  <img
                    src="${BASE.replace(/\/+$/, '')}/${p.src}"
                    alt="${p.alt || ''}"
                    loading="${i === 0 ? 'eager' : 'lazy'}"
                    decoding="async"
                    onerror="this.classList.add('is-broken')"
                  />
                  ${p.caption ? `<figcaption class="carousel__caption">${p.caption}</figcaption>` : ''}
                </figure>`
                )
                .join('')}
            </div>
            <footer class="carousel__foot">
              <ul class="carousel__dots" role="tablist" aria-label="Photos">
                ${manifesto.carousel
                  .map(
                    (_, i) => `
                  <li><button class="carousel__dot${i === 0 ? ' is-active' : ''}" type="button" role="tab" aria-selected="${i === 0}" data-index="${i}">
                    <span class="sr-only">Photo ${i + 1}</span>
                  </button></li>`
                  )
                  .join('')}
              </ul>
              <div class="carousel__nav">
                <button class="carousel__btn" data-dir="-1" aria-label="Previous photo">&larr;</button>
                <button class="carousel__btn" data-dir="1" aria-label="Next photo">&rarr;</button>
              </div>
            </footer>
          </div>
        </aside>
      </div>
    </div>
  `;

  // --- char reveal on scroll ---
  if (!motionOK) {
    el.querySelectorAll('.manifesto__body .char').forEach((c) => c.classList.add('is-lit'));
  } else {
    const chars = el.querySelectorAll('.manifesto__body .char');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.6,
      onUpdate: (self) => {
        const lit = Math.floor(self.progress * chars.length);
        chars.forEach((c, i) => c.classList.toggle('is-lit', i <= lit));
      },
    });

    gsap.from(el.querySelector('.manifesto__eyebrow'), {
      opacity: 0, y: 20, duration: 0.8,
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
    gsap.from(el.querySelector('.manifesto__positioning'), {
      opacity: 0, y: 24, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: '.manifesto__positioning', start: 'top 90%' },
    });
    gsap.from(el.querySelector('.carousel--photos'), {
      opacity: 0, y: 30, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: '.carousel--photos', start: 'top 85%' },
    });
  }

  // --- carousel behaviour ---
  const slides = Array.from(el.querySelectorAll('.carousel__slide'));
  const dots = Array.from(el.querySelectorAll('.carousel__dot'));
  const btns = Array.from(el.querySelectorAll('.carousel__btn'));
  const countEl = el.querySelector('.manifesto__count');
  let active = 0;
  let auto;

  const goto = (idx) => {
    idx = ((idx % total) + total) % total;
    if (idx === active) return;
    slides[active].classList.remove('is-active');
    slides[active].setAttribute('aria-hidden', 'true');
    dots[active].classList.remove('is-active');
    dots[active].setAttribute('aria-selected', 'false');

    active = idx;

    slides[active].classList.add('is-active');
    slides[active].setAttribute('aria-hidden', 'false');
    dots[active].classList.add('is-active');
    dots[active].setAttribute('aria-selected', 'true');
    if (countEl) countEl.textContent = `${String(active + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  };

  const start = () => {
    stop();
    if (!motionOK) return;
    auto = setInterval(() => goto(active + 1), 3000);
  };
  const stop = () => {
    if (auto) {
      clearInterval(auto);
      auto = null;
    }
  };

  dots.forEach((d) =>
    d.addEventListener('click', () => {
      goto(Number(d.dataset.index));
      start();
    })
  );
  btns.forEach((b) =>
    b.addEventListener('click', () => {
      goto(active + Number(b.dataset.dir));
      start();
    })
  );

  const carouselEl = el.querySelector('.carousel--photos');
  carouselEl.addEventListener('mouseenter', stop);
  carouselEl.addEventListener('mouseleave', start);

  if (motionOK) {
    ScrollTrigger.create({
      trigger: carouselEl,
      start: 'top 80%',
      end: 'bottom 20%',
      onToggle: (self) => (self.isActive ? start() : stop()),
    });
  }
}
