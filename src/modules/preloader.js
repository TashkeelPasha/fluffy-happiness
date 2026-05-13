import { gsap, motionOK } from '../lib/gsap-setup.js';

/**
 * Preloader tied to *real* page load progress.
 *
 * Progress weights:
 *   - fonts ready          → 30%
 *   - eager images loaded  → 40% (proportional)
 *   - window.load fired    → 30%
 *
 * Behaviour:
 *   - The "displayed" value smoothly chases the live "target" via RAF, so the
 *     counter feels animated even on cached loads (~700ms minimum visible time).
 *   - Once displayed >= 0.999, runs the dismiss animation.
 *   - Hard ceiling of 6s — if some asset hangs, we bail and reveal the page.
 *   - reduced-motion just hides the preloader instantly.
 */
export function mountPreloader(onDone) {
  const el = document.getElementById('preloader');
  if (!el) {
    onDone?.();
    return;
  }

  const counter = el.querySelector('.preloader__counter');
  const bar = el.querySelector('.preloader__bar-fill');
  const status = el.querySelector('.preloader__status');
  const inner = el.querySelector('.preloader__inner');
  const veil = el.querySelector('.preloader__veil');

  if (!motionOK) {
    el.style.display = 'none';
    onDone?.();
    return;
  }

  // ---- progress sources ----
  let fontsReady = false;
  let windowLoaded = false;
  let loadedImgs = 0;

  const eagerImgs = Array.from(document.images).filter(
    (img) => img.loading !== 'lazy'
  );
  // Count already-complete images
  eagerImgs.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) loadedImgs++;
  });
  const totalImgs = eagerImgs.length;

  // Fonts
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      fontsReady = true;
    });
  } else {
    fontsReady = true;
  }

  // Images
  eagerImgs.forEach((img) => {
    if (img.complete) return;
    const inc = () => {
      loadedImgs++;
    };
    img.addEventListener('load', inc, { once: true });
    img.addEventListener('error', inc, { once: true });
  });

  // Window load
  if (document.readyState === 'complete') {
    windowLoaded = true;
  } else {
    window.addEventListener(
      'load',
      () => {
        windowLoaded = true;
      },
      { once: true }
    );
  }

  const computeTarget = () => {
    const fontPart = fontsReady ? 0.3 : 0;
    const imgPart = totalImgs === 0 ? 0.4 : 0.4 * (loadedImgs / totalImgs);
    const winPart = windowLoaded ? 0.3 : 0;
    return Math.min(1, fontPart + imgPart + winPart);
  };

  // ---- displayed value & tick loop ----
  // setInterval (not RAF) so we still tick in throttled / background tabs.
  // ~33ms = 30fps; plenty smooth for a counter and a progress bar.
  const TICK_MS = 33;
  const start = performance.now();
  const MAX_SHOW = 6000;

  let displayed = 0;
  let finished = false;
  let lastStatus = '';
  let intervalId = null;

  const updateStatus = (pct) => {
    let s = 'Preparing the manifesto';
    if (pct >= 30) s = 'Loading the typography';
    if (pct >= 65) s = 'Composing the spread';
    if (pct >= 90) s = 'Almost there';
    if (pct >= 100) s = 'Ready';
    if (s !== lastStatus && status) {
      status.textContent = s;
      lastStatus = s;
    }
  };

  const tick = () => {
    if (finished) return;

    const elapsed = performance.now() - start;
    let target = computeTarget();
    // Safety bail
    if (elapsed >= MAX_SHOW) target = 1;

    // Eased chase — 14% of remaining distance per tick (~30Hz → ~700ms to settle)
    displayed += (target - displayed) * 0.14;

    // Snap when close enough
    if (target >= 0.999 && displayed > 0.992) displayed = 1;

    const pct = Math.round(displayed * 100);
    counter.textContent = pct.toString().padStart(2, '0');
    if (bar) bar.style.transform = `scaleX(${displayed})`;
    updateStatus(pct);

    if (displayed >= 1) {
      finished = true;
      clearInterval(intervalId);
      finish();
    }
  };

  const finish = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        el.style.display = 'none';
        onDone?.();
      },
    });
    tl.to(inner, { opacity: 0, y: -10, duration: 0.45, ease: 'power2.in' }, 0)
      .to(
        veil,
        {
          scaleY: 0,
          duration: 1.0,
          ease: 'expo.inOut',
          transformOrigin: 'top',
        },
        0.1
      );
  };

  intervalId = setInterval(tick, TICK_MS);
  tick(); // run once immediately so we don't wait 33ms for the first paint
}
