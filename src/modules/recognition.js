import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { recognition } from '../data/content.js';

export function mountRecognition() {
  const el = document.getElementById('recognition');
  if (!el) return;

  el.innerHTML = `
    <div class="container--narrow recognition">
      <span class="eyebrow">${recognition.eyebrow}</span>
      <span class="recognition__badge">${recognition.badge}</span>
      <h2 id="recognition-title" class="recognition__title">
        ${recognition.title.replace('Corruption', '<em>Corruption</em>')}
      </h2>
      <p class="recognition__body">${recognition.body}</p>
      <div class="recognition__org">
        <span class="recognition__org-name">${recognition.org}</span>
        <span class="recognition__org-year">${recognition.year}</span>
      </div>
    </div>
  `;

  if (!motionOK) return;

  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top 70%' },
    defaults: { ease: 'expo.out' },
  });

  tl.from(el.querySelector('.eyebrow'), { opacity: 0, y: 20, duration: 0.7 })
    .from(el.querySelector('.recognition__badge'), { opacity: 0, y: 20, scale: 0.9, duration: 0.7 }, '-=0.4')
    .from(el.querySelector('.recognition__title'), { opacity: 0, y: 40, duration: 1.1 }, '-=0.4')
    .from(el.querySelector('.recognition__body'), { opacity: 0, y: 30, duration: 0.8 }, '-=0.6')
    .from(el.querySelector('.recognition__org'), { opacity: 0, y: 20, duration: 0.7 }, '-=0.5');
}
