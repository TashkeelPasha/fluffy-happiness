import { gsap, motionOK } from '../lib/gsap-setup.js';
import { education } from '../data/content.js';

export function mountEducation() {
  const el = document.getElementById('education');
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <header class="education__head">
        <span class="eyebrow">${education.eyebrow}</span>
        <span class="label">${education.items.length} institutions</span>
      </header>
      <div class="education__list">
        ${education.items
          .map(
            (e) => `
          <div class="edu">
            <h3 class="edu__school">${e.school}</h3>
            <span class="edu__detail">${e.detail}</span>
          </div>`
          )
          .join('')}
      </div>
    </div>
  `;
  el.id = 'education';
  el.setAttribute('aria-labelledby', 'education-title');

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.edu'), {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
  });
}
