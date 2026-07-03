import './styles/main.css';

import { initLenis } from './lib/lenis.js';
import { initCursor } from './lib/cursor.js';
import { ScrollTrigger } from './lib/gsap-setup.js';

import { mountPreloader } from './modules/preloader.js';
import { mountNav } from './modules/nav.js';
import { mountHero } from './modules/hero.js';
import { mountNumbers } from './modules/numbers.js';
import { mountAnnouncement } from './modules/announcement.js';
import { mountCases } from './modules/cases.js';
import { mountHeroes } from './modules/heroes.js';
import { mountAbout } from './modules/about.js';
import { mountManifesto } from './modules/manifesto.js';
import { mountRecognition } from './modules/recognition.js';
import { mountExperience } from './modules/experience.js';
import { mountServices } from './modules/services.js';
import { mountNetworks } from './modules/networks.js';
import { mountIndependence } from './modules/independence.js';
import { mountEducation } from './modules/education.js';
import { mountContact } from './modules/contact.js';
import { mountFooter } from './modules/footer.js';
// Voice section retired — publication link moved to the Forensic Audit mandate card.

function boot() {
  // Render all sections (data → DOM)
  mountNav();
  mountHero();
  mountNumbers();
  mountAnnouncement();
  mountCases();
  mountHeroes();
  mountAbout();
  mountManifesto();
  mountRecognition();
  mountExperience();
  mountServices();
  mountNetworks();
  mountIndependence();
  mountEducation();
  mountContact();
  mountFooter();

  // Initialize global behaviour
  initLenis();
  initCursor();

  // Preloader runs the intro and triggers entrance animations after
  mountPreloader(() => {
    document.body.classList.add('is-ready');
    ScrollTrigger.refresh();
  });

  // Refresh ScrollTrigger when fonts load (avoids mis-measured pinned heights)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
