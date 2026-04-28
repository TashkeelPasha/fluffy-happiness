import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { manifesto } from '../data/content.js';

export function mountManifesto() {
  const el = document.getElementById('manifesto');
  if (!el) return;

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
      <span class="eyebrow manifesto__eyebrow">${manifesto.eyebrow}</span>
      <h2 id="manifesto-title" class="manifesto__body">${words}</h2>
      <p class="manifesto__closing">${manifesto.closing}</p>
    </div>
  `;

  if (!motionOK) {
    el.querySelectorAll('.manifesto__body .char').forEach((c) => c.classList.add('is-lit'));
    return;
  }

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
    opacity: 0,
    y: 20,
    duration: 0.8,
    scrollTrigger: { trigger: el, start: 'top 80%' },
  });
  gsap.from(el.querySelector('.manifesto__closing'), {
    opacity: 0,
    y: 30,
    duration: 0.9,
    scrollTrigger: { trigger: el.querySelector('.manifesto__closing'), start: 'top 88%' },
  });
}
