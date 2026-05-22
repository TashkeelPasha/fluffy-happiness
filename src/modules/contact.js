import { gsap, motionOK } from '../lib/gsap-setup.js';
import { contact } from '../data/content.js';

export function mountContact() {
  const el = document.getElementById('contact');
  if (!el) return;

  el.innerHTML = `
    <div class="container--narrow contact">
      <header class="contact__head">
        <span class="eyebrow">${contact.eyebrow}</span>
        ${contact.windowLine ? `<span class="contact__window mono">${contact.windowLine}</span>` : ''}
      </header>

      <h2 id="contact-title" class="contact__title">${contact.title}</h2>

      <p class="contact__body">${contact.body}</p>

      <ul class="contact__prompts" aria-label="Introduction prompts">
        ${contact.prompts
          .map(
            (p) => `
          <li class="contact__prompt">
            <span class="contact__prompt-k">${p.k}</span>
            <span class="contact__prompt-v">${p.v}</span>
          </li>`
          )
          .join('')}
      </ul>

      <div class="contact__cta">
        ${contact.cta
          .map(
            (b) => `
          <a class="btn btn--${b.kind}" href="${b.href}" data-magnetic="0.22">${b.label}</a>`
          )
          .join('')}
      </div>

      <p class="contact__foot">${contact.foot}</p>
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.container--narrow > *'), {
    opacity: 0,
    y: 32,
    duration: 0.9,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 78%' },
  });

  gsap.from(el.querySelectorAll('.contact__prompt'), {
    opacity: 0,
    y: 18,
    duration: 0.7,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.contact__prompts', start: 'top 88%' },
  });
}
