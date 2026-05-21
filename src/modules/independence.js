import { gsap, motionOK } from '../lib/gsap-setup.js';
import { independence } from '../data/content.js';

export function mountIndependence() {
  const el = document.getElementById('independence');
  if (!el) return;

  el.innerHTML = `
    <div class="container--narrow independence">
      <div class="independence__card">
        <header class="independence__head">
          <span class="eyebrow">${independence.eyebrow}</span>
          <h2 id="independence-title" class="independence__title">${independence.title}</h2>
        </header>
        <p class="independence__body">${independence.body}</p>
      </div>
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelector('.independence__card'), {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 82%' },
  });
}
