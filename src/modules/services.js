import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { services } from '../data/content.js';

export function mountServices() {
  const el = document.getElementById('services');
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <header class="services__head">
        <div class="flex-col" style="gap:1.25rem">
          <span class="eyebrow">${services.eyebrow}</span>
          <h2 id="services-title" class="services__title">${services.title}</h2>
        </div>
        <p class="services__intro">${services.intro}</p>
      </header>

      <section class="services__tier">
        <div class="services__tier-head">
          <span class="label">${services.standardLabel}</span>
          <span class="label" style="opacity:0.5">${String(services.standard.length).padStart(2, '0')} disciplines</span>
        </div>
        <div class="services__list">
          ${services.standard
            .map(
              (s, i) => `
            <div class="service" data-cursor>
              <span class="service__n">${(i + 1).toString().padStart(2, '0')}</span>
              <span class="service__name">${s}</span>
            </div>`
            )
            .join('')}
        </div>
      </section>

      <section class="services__featured">
        <div class="services__featured-head">
          <span class="services__featured-tag">${services.specialised.label}</span>
          <h3 class="services__featured-title">${services.specialised.title}</h3>
          <p class="services__featured-intro">${services.specialised.intro}</p>
        </div>
        <ul class="services__featured-list">
          ${services.specialised.items
            .map(
              (it, i) => `
            <li class="services__featured-item">
              <span class="services__featured-n">${(i + 1).toString().padStart(2, '0')}</span>
              <span class="services__featured-name">${it}</span>
              <span class="services__featured-arrow" aria-hidden="true">↗</span>
            </li>`
            )
            .join('')}
        </ul>
      </section>
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.services__head > *'), {
    opacity: 0,
    y: 30,
    duration: 0.9,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 75%' },
  });

  ScrollTrigger.batch('.service', {
    start: 'top 90%',
    onEnter: (batch) =>
      gsap.from(batch, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.06,
        ease: 'expo.out',
        overwrite: true,
      }),
    once: true,
  });

  gsap.from(el.querySelectorAll('.services__featured-head > *'), {
    opacity: 0,
    y: 30,
    duration: 0.9,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.services__featured', start: 'top 80%' },
  });

  gsap.from(el.querySelectorAll('.services__featured-item'), {
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.services__featured-list', start: 'top 88%' },
  });
}
