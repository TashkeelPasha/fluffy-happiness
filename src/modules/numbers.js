import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { numbers } from '../data/content.js';

export function mountNumbers() {
  const el = document.getElementById('numbers');
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <header class="numbers__head">
        <span class="eyebrow numbers__eyebrow">${numbers.eyebrow}</span>
        <h2 id="numbers-title" class="numbers__title">${numbers.title}</h2>
      </header>

      <ul class="numbers__grid" role="list">
        ${numbers.items
          .map(
            (it, i) => `
          <li class="num">
            <span class="num__n">${(i + 1).toString().padStart(2, '0')}</span>
            <span class="num__figure">${it.n}</span>
            <span class="num__caption">${it.caption}</span>
          </li>`
          )
          .join('')}
      </ul>

      <p class="numbers__foot">${numbers.foot}</p>

      ${
        numbers.ctas?.length
          ? `<div class="numbers__ctas">
              ${numbers.ctas
                .map(
                  (c) => `
                <a class="btn btn--${c.kind}" href="${c.href}"${c.external ? ' target="_blank" rel="noopener"' : ''} data-magnetic="0.18">${c.label}</a>`
                )
                .join('')}
            </div>`
          : ''
      }
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.numbers__head > *'), {
    opacity: 0,
    y: 24,
    duration: 0.8,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 80%' },
  });

  ScrollTrigger.batch('.num', {
    start: 'top 88%',
    onEnter: (batch) =>
      gsap.from(batch, {
        opacity: 0,
        y: 50,
        duration: 1.1,
        stagger: 0.12,
        ease: 'expo.out',
        overwrite: true,
      }),
    once: true,
  });

  gsap.from(el.querySelector('.numbers__foot'), {
    opacity: 0,
    y: 18,
    duration: 0.7,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.numbers__foot', start: 'top 95%' },
  });
}
