import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { africa } from '../data/content.js';

export function mountAnnouncement() {
  const el = document.getElementById('announcement');
  if (!el || !africa) return;

  const marqueeItems = [...africa.marquee, ...africa.marquee, ...africa.marquee];

  el.innerHTML = `
    <!-- Full-width scrolling marquee -->
    <div class="africa-marquee" aria-label="Africa focus">
      <div class="africa-marquee__track">
        ${marqueeItems
          .map(
            (m) => `<span class="africa-marquee__item">${m}<span class="africa-marquee__star" aria-hidden="true">✶</span></span>`
          )
          .join('')}
      </div>
    </div>

    <!-- Focus mini-section -->
    <div class="container africa">
      <header class="africa__head">
        <div class="africa__head-left">
          <span class="eyebrow africa__eyebrow">${africa.eyebrow}</span>
          <h2 class="africa__title">${africa.title}</h2>
        </div>
        <p class="africa__lead">${africa.lead}</p>
      </header>

      <ul class="africa__meta" role="list">
        ${africa.meta
          .map(
            (m) => `
          <li class="africa__meta-item">
            <span class="africa__meta-k">${m.k}</span>
            <span class="africa__meta-v">${m.v}</span>
          </li>`
          )
          .join('')}
      </ul>

      <ol class="africa__focus" role="list">
        ${africa.focus
          .map(
            (f) => `
          <li class="africa__focus-item">
            <span class="africa__focus-n">${f.n}</span>
            <h3 class="africa__focus-title">${f.title}</h3>
            <p class="africa__focus-body">${f.body}</p>
          </li>`
          )
          .join('')}
      </ol>

      ${
        africa.cta
          ? `<a class="africa__cta" href="${africa.cta.href}" data-magnetic="0.18">${africa.cta.label}</a>`
          : ''
      }
    </div>
  `;

  if (!motionOK) return;

  // Marquee animation — slow continuous scroll left
  const track = el.querySelector('.africa-marquee__track');
  if (track) {
    const total = track.scrollWidth / 3;
    gsap.set(track, { x: 0 });
    gsap.to(track, {
      x: -total,
      duration: 32,
      ease: 'none',
      repeat: -1,
    });
  }

  // Focus section reveals
  gsap.from(el.querySelectorAll('.africa__head > *'), {
    opacity: 0,
    y: 24,
    duration: 0.9,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.africa', start: 'top 78%' },
  });

  gsap.from(el.querySelectorAll('.africa__meta-item'), {
    opacity: 0,
    y: 18,
    duration: 0.7,
    stagger: 0.07,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.africa__meta', start: 'top 88%' },
  });

  ScrollTrigger.batch('.africa__focus-item', {
    start: 'top 90%',
    onEnter: (batch) =>
      gsap.from(batch, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.1,
        ease: 'expo.out',
        overwrite: true,
      }),
    once: true,
  });

  gsap.from(el.querySelector('.africa__cta'), {
    opacity: 0,
    y: 18,
    duration: 0.7,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.africa__cta', start: 'top 95%' },
  });
}
