import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { cases } from '../data/content.js';

export function mountCases() {
  const el = document.getElementById('cases');
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <header class="cases__head">
        <div class="cases__head-left">
          <span class="eyebrow cases__eyebrow">${cases.eyebrow}</span>
          <h2 id="cases-title" class="cases__title">${cases.title}</h2>
        </div>
        <p class="cases__intro">${cases.intro}</p>
      </header>

      <ol class="cases__list" role="list">
        ${cases.items
          .map(
            (c, i) => `
          <li class="case${i === 0 ? ' case--lead' : ''}" data-cursor>
            <header class="case__top">
              <span class="case__n">${c.n}</span>
              <span class="case__tag">${c.tag}</span>
            </header>
            <h3 class="case__title">${c.title}</h3>

            <div class="case__body">
              <div class="case__row">
                <span class="case__label">Situation</span>
                <p class="case__text">${c.situation}</p>
              </div>
              <div class="case__row">
                <span class="case__label">Mandate</span>
                <p class="case__text">${c.mandate}</p>
              </div>
              <div class="case__row case__row--outcome">
                <span class="case__label">Outcome</span>
                <p class="case__text case__outcome">${c.outcome}</p>
              </div>
            </div>

            <ul class="case__tags" aria-label="Engagement context">
              ${c.tags.map((t) => `<li>${t}</li>`).join('')}
            </ul>
          </li>`
          )
          .join('')}
      </ol>

      <p class="cases__foot">${cases.foot}</p>
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.cases__head > *'), {
    opacity: 0,
    y: 24,
    duration: 0.9,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 78%' },
  });

  ScrollTrigger.batch('.case', {
    start: 'top 88%',
    onEnter: (batch) =>
      gsap.from(batch, {
        opacity: 0,
        y: 60,
        duration: 1.1,
        stagger: 0.14,
        ease: 'expo.out',
        overwrite: true,
      }),
    once: true,
  });

  gsap.from(el.querySelector('.cases__foot'), {
    opacity: 0,
    y: 16,
    duration: 0.7,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.cases__foot', start: 'top 95%' },
  });
}
