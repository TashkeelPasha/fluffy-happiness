import { gsap, motionOK } from '../lib/gsap-setup.js';
import { about } from '../data/content.js';

export function mountAbout() {
  const el = document.getElementById('about');
  if (!el) return;

  el.innerHTML = `
    <div class="container about">
      <div class="about__left">
        <span class="eyebrow">${about.eyebrow}</span>
        <span class="about__stat">${about.stat}</span>
        <span class="about__stat-label">${about.statLabel}</span>
      </div>
      <div class="about__right">
        <h2 id="about-title" class="about__title">${about.title}</h2>
        <div class="about__paragraphs">
          ${about.paragraphs.map((p) => `<p>${p}</p>`).join('')}
        </div>
        <div class="about__impact">
          <span class="about__impact-label">${about.impactLabel}</span>
          <p class="about__impact-body">${about.impact}</p>
        </div>
        <div class="about__boards">
          <span class="about__boards-label label">${about.boardsLabel}</span>
          <ul class="about__boards-list">
            ${about.boards.map((b) => `<li class="about__boards-item">${b}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.about__left > *'), {
    opacity: 0,
    y: 40,
    duration: 0.9,
    stagger: 0.12,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 75%' },
  });
  gsap.from(el.querySelectorAll('.about__right > *'), {
    opacity: 0,
    y: 40,
    duration: 0.9,
    stagger: 0.12,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 75%' },
  });
}
