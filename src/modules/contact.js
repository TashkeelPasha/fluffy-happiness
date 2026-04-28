import { gsap, motionOK } from '../lib/gsap-setup.js';
import { contact } from '../data/content.js';

export function mountContact() {
  const el = document.getElementById('contact');
  if (!el) return;

  el.innerHTML = `
    <div class="container--narrow contact">
      <span class="eyebrow">${contact.eyebrow}</span>
      <span class="contact__pre">${contact.pre}</span>
      <span class="contact__window">${contact.windowLine}</span>
      <h2 id="contact-title" class="contact__title">${contact.title}</h2>
      <div class="contact__cta">
        ${contact.cta
          .map(
            (b) => `
          <a class="btn btn--${b.kind}" href="${b.href}" data-magnetic="0.22">${b.label}</a>`
          )
          .join('')}
      </div>
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.container--narrow > *'), {
    opacity: 0,
    y: 40,
    duration: 0.9,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 75%' },
  });
}
