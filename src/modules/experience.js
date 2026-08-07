import { gsap, ScrollTrigger, motionOK } from '../lib/gsap-setup.js';
import { experience } from '../data/content.js';

const WEBSITE_ICON = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></svg>`;

// Strip protocol + trailing slash for a clean display label ("wrackler.com").
function prettyDomain(url) {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
}

function renderWebsite(e) {
  if (!e.website) return '';
  return `<a class="exp__website" href="${e.website}" target="_blank" rel="noopener" aria-label="${e.company} website">
      ${WEBSITE_ICON}
      <span>${prettyDomain(e.website)}</span>
    </a>`;
}

export function mountExperience() {
  const el = document.getElementById('experience');
  if (!el) return;

  const total = experience.items.length.toString().padStart(2, '0');

  el.innerHTML = `
    <div class="container">
      <header class="experience__head">
        <span class="eyebrow">${experience.eyebrow}</span>
        <h2 id="experience-title" class="experience__title">${experience.title}</h2>
        ${experience.intro ? `<p class="experience__intro">${experience.intro}</p>` : ''}
      </header>
      <div class="experience__wrap">
        <aside class="experience__sticky">
          <span class="experience__sticky-label label">Currently viewing</span>
          <span class="experience__counter">
            <span class="experience__counter-n">01</span>
            <span class="experience__counter-total">/ ${total}</span>
          </span>
          <span class="experience__sticky-hint label">Scroll for full career</span>
        </aside>
        <ol class="experience__list">
          ${experience.items
            .map(
              (e, i) => `
            <li class="exp">
              <div class="exp__side">
                <span class="exp__n">${(i + 1).toString().padStart(2, '0')}</span>
                <span class="exp__period">${e.period}</span>
                ${e.duration ? `<span class="exp__duration">${e.duration}</span>` : ''}
              </div>
              <div class="exp__main">
                <h3 class="exp__role">${e.role}</h3>
                <div class="exp__company">
                  <strong>${e.company}</strong>
                  <span>${e.location}</span>
                  <span>${e.type}</span>
                  ${renderWebsite(e)}
                </div>
                <p class="exp__blurb">${e.blurb}</p>
                ${
                  e.outcome
                    ? `<p class="exp__outcome"><span class="exp__outcome-label">Outcome</span>${e.outcome}</p>`
                    : ''
                }
                ${
                  e.skills?.length
                    ? `<ul class="exp__skills">
                        ${e.skills.map((s) => `<li class="exp__skill">${s}</li>`).join('')}
                        ${e.moreSkills > 0 ? `<li class="exp__skill exp__skill--more">+${e.moreSkills} more</li>` : ''}
                      </ul>`
                    : ''
                }
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
      stagger: 0.06,
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
