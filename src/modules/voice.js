import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { voice } from '../data/content.js';

export function mountVoice() {
  const el = document.getElementById('voice');
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <header class="voice__head">
        <div class="flex-col" style="gap:1.25rem">
          <span class="eyebrow">${voice.eyebrow}</span>
          <h2 id="voice-title" class="voice__title">${voice.title}</h2>
        </div>
        <p class="voice__intro">${voice.intro}</p>
      </header>
      <div class="voice__list">
        ${voice.items
          .map(
            (v) => `
          <article class="voice-card" data-cursor>
            <div class="voice-card__top">
              <span class="voice-card__n">${v.n}</span>
              <span class="voice-card__tag">${v.tag}</span>
            </div>
            <h3 class="voice-card__title">${v.title}</h3>
            <p class="voice-card__excerpt">${v.excerpt}</p>
            <span class="voice-card__more">Read more</span>
          </article>`
          )
          .join('')}
      </div>
    </div>
  `;

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.voice__head > *'), {
    opacity: 0,
    y: 30,
    duration: 0.9,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 75%' },
  });

  ScrollTrigger.batch('.voice-card', {
    start: 'top 88%',
    onEnter: (batch) =>
      gsap.from(batch, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.12,
        ease: 'expo.out',
        overwrite: true,
      }),
    once: true,
  });
}
