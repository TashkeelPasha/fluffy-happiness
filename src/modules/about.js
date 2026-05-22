import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { about } from '../data/content.js';

export function mountAbout() {
  const el = document.getElementById('about');
  if (!el) return;

  el.innerHTML = `
    <div class="container about">
      <header class="about__head">
        <span class="eyebrow about__eyebrow">${about.eyebrow}</span>
        <h2 id="about-title" class="about__title">${about.title}</h2>
      </header>

      <figure class="about__motto">
        <blockquote class="about__motto-text">
          <span aria-hidden="true">&ldquo;</span>${about.motto}<span aria-hidden="true">&rdquo;</span>
        </blockquote>
        <figcaption class="about__motto-attr">— ${about.mottoAttribution}</figcaption>
      </figure>

      <div class="about__body">
        ${about.paragraphs.map((p) => `<p class="about__p">${p}</p>`).join('')}
      </div>

      <section class="about__passion">
        <header class="about__passion-head">
          <span class="eyebrow">${about.passionLabel}</span>
        </header>
        <ol class="about__passion-list" role="list">
          ${about.passions
            .map(
              (p) => `
            <li class="about__passion-item">
              <span class="about__passion-n">${p.n}</span>
              <h3 class="about__passion-title">${p.title}</h3>
              <p class="about__passion-body">${p.body}</p>
            </li>`
            )
            .join('')}
        </ol>
      </section>

      <p class="about__closing">${about.closing}</p>

      ${
        about.ctas?.length
          ? `<div class="about__ctas">
              ${about.ctas
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

  gsap.from(el.querySelectorAll('.about__head > *'), {
    opacity: 0,
    y: 24,
    duration: 0.9,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 78%' },
  });

  gsap.from(el.querySelector('.about__motto'), {
    opacity: 0,
    y: 30,
    duration: 1.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.about__motto', start: 'top 80%' },
  });

  gsap.from(el.querySelectorAll('.about__p'), {
    opacity: 0,
    y: 24,
    duration: 0.9,
    stagger: 0.12,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.about__body', start: 'top 80%' },
  });

  ScrollTrigger.batch('.about__passion-item', {
    start: 'top 88%',
    onEnter: (batch) =>
      gsap.from(batch, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.1,
        ease: 'expo.out',
        overwrite: true,
      }),
    once: true,
  });

  gsap.from(el.querySelector('.about__closing'), {
    opacity: 0,
    y: 16,
    duration: 0.7,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.about__closing', start: 'top 95%' },
  });
}
