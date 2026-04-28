import './styles/main.css';

import { initLenis } from './lib/lenis.js';
import { initCursor } from './lib/cursor.js';
import { ScrollTrigger } from './lib/gsap-setup.js';

import { mountPreloader } from './modules/preloader.js';
import { mountNav } from './modules/nav.js';
import { mountHero } from './modules/hero.js';
import { mountManifesto } from './modules/manifesto.js';
import { mountPillars } from './modules/pillars.js';
import { mountRecognition } from './modules/recognition.js';
import { mountExpertise } from './modules/expertise.js';
import { mountExperience } from './modules/experience.js';
import { mountVoice } from './modules/voice.js';
import { mountServices } from './modules/services.js';
import { mountEducation } from './modules/education.js';
import { mountContact } from './modules/contact.js';
import { mountFooter } from './modules/footer.js';

function boot() {
  // Render all sections (data → DOM)
  mountNav();
  mountHero();
  mountManifesto();
  mountPillars();
  mountRecognition();
  mountExpertise();
  mountExperience();
  mountVoice();
  mountServices();
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
