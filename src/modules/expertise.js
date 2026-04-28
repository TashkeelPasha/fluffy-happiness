import { gsap, motionOK } from '../lib/gsap-setup.js';
import { expertise } from '../data/content.js';

export function mountExpertise() {
  const el = document.getElementById('expertise');
  if (!el) return;

  // Two marquees in opposite directions for richer motion
  const half1 = expertise.marquee.slice(0, Math.ceil(expertise.marquee.length / 2));
  const half2 = expertise.marquee.slice(Math.ceil(expertise.marquee.length / 2));

  const buildTrack = (items) =>
    [...items, ...items, ...items].map((m) => `<span class="marquee__item">${m}</span>`).join('');

  el.innerHTML = `
    <div class="container">
      <header class="expertise__head">
        <h2 id="expertise-title" class="expertise__title">
          <span class="eyebrow" style="margin-bottom:1.25rem;display:inline-flex">${expertise.eyebrow}</span><br>
          ${expertise.title}
        </h2>
        <div class="expertise__top">
          <span class="label" style="color:rgba(244,241,234,0.5)">Top skills</span>
          <ul class="expertise__top-list">
            ${expertise.topSkills.map((s) => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      </header>
    </div>
    <div class="marquee">
      <div class="marquee__track">${buildTrack(half1)}</div>
    </div>
    <div class="marquee marquee--reverse">
      <div class="marquee__track">${buildTrack(half2)}</div>
    </div>
  `;

  if (!motionOK) return;

  const tracks = el.querySelectorAll('.marquee__track');
  tracks.forEach((track, i) => {
    const dir = i % 2 === 0 ? -1 : 1;
    const total = track.scrollWidth / 3;
    gsap.set(track, { x: dir === -1 ? 0 : -total });
    gsap.to(track, {
      x: dir === -1 ? -total : 0,
      duration: 28,
      ease: 'none',
      repeat: -1,
    });
  });
}
