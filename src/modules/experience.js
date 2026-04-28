import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { experience } from '../data/content.js';

export function mountExperience() {
  const el = document.getElementById('experience');
  if (!el) return;

  const total = experience.items.length.toString().padStart(2, '0');

  el.innerHTML = `
    <div class="container">
      <header class="experience__head">
        <span class="eyebrow">${experience.eyebrow}</span>
        <h2 id="experience-title" class="experience__title">${experience.title}</h2>
      </header>
      <div class="experience__wrap">
        <aside class="experience__sticky">
          <span class="experience__sticky-label label">Currently active</span>
          <span class="experience__counter">
            <span class="experience__counter-n">01</span>
            <span class="experience__counter-total">/ ${total}</span>
          </span>
        </aside>
        <ol class="experience__list">
          ${experience.items
            .map(
              (e) => `
            <li class="exp">
              <span class="exp__period">${e.period}</span>
              <div class="exp__main">
                <h3 class="exp__role">${e.role}</h3>
                <div class="exp__company">
                  <strong>${e.company}</strong>
                  <span>${e.location}</span>
                  <span>${e.type}</span>
                </div>
                <p class="exp__blurb">${e.blurb}</p>
              </div>
            </li>`
            )
            .join('')}
        </ol>
      </div>
    </div>
  `;

  if (!motionOK) return;

  const counterEl = el.querySelector('.experience__counter-n');
  const items = el.querySelectorAll('.exp');

  items.forEach((item, idx) => {
    gsap.from(item.children, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.08,
      ease: 'expo.out',
      scrollTrigger: { trigger: item, start: 'top 85%' },
    });

    ScrollTrigger.create({
      trigger: item,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) counterEl.textContent = (idx + 1).toString().padStart(2, '0');
      },
    });
  });
}
