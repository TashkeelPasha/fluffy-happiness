import { gsap, motionOK } from '../lib/gsap-setup.js';
import { announcement } from '../data/content.js';

export function mountAnnouncement() {
  const el = document.getElementById('announcement');
  if (!el || !announcement) return;

  el.innerHTML = `
    <div class="container announcement">
      <div class="announcement__card">
        <span class="announcement__tag">${announcement.tag}</span>
        <div class="announcement__body">
          <h2 class="announcement__headline">${announcement.headline}</h2>
          <p class="announcement__text">${announcement.body}</p>
        </div>
        ${
          announcement.cta
            ? `<a class="announcement__cta" href="${announcement.cta.href}" data-magnetic="0.18">${announcement.cta.label}</a>`
            : ''
        }
      </div>
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelector('.announcement__card'), {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
  });
}
