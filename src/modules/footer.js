import { gsap, motionOK } from '../lib/gsap-setup.js';
import { footer } from '../data/content.js';

export function mountFooter() {
  const el = document.getElementById('footer');
  if (!el) return;

  const items = Array(8).fill(footer.marquee);

  el.innerHTML = `
    <div class="footer__marquee">
      <div class="footer__track">
        ${items.map((m) => `<span class="footer__item">${m} <span style="color:var(--accent);font-style:normal;font-size:0.55em;vertical-align:0.5em">✶</span></span>`).join('')}
      </div>
    </div>
    <div class="container">
      <div class="footer__discretion">
        <p class="footer__discretion-line">${footer.discretion}</p>
        <p class="footer__jurisdiction-line">${footer.jurisdiction}</p>
      </div>
      <div class="footer__bottom">
        <span class="footer__copy">${footer.copy}</span>
        <span class="footer__mark serif-italic">${footer.mark}</span>
      </div>
      ${
        footer.maker
          ? `<div class="footer__maker">
              <span class="footer__maker-text">
                ${footer.maker.intro}
                <span class="footer__heart" aria-hidden="true">${footer.maker.heart}</span>
                ${footer.maker.by}
                <a class="footer__maker-link" href="${footer.maker.linkedin}" target="_blank" rel="noopener">${footer.maker.name}</a>
              </span>
              <span class="footer__maker-contact">
                <a class="footer__maker-link" href="${footer.maker.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
                <span aria-hidden="true">·</span>
                <a class="footer__maker-link" href="mailto:${footer.maker.email}">${footer.maker.email}</a>
              </span>
            </div>`
          : ''
      }
    </div>
  `;

  if (!motionOK) return;

  const track = el.querySelector('.footer__track');
  const total = track.scrollWidth / 2;
  gsap.to(track, {
    x: -total,
    duration: 38,
    ease: 'none',
    repeat: -1,
    modifiers: { x: gsap.utils.unitize((x) => parseFloat(x) % -total) },
  });
}
