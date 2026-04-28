import { gsap, motionOK } from '../lib/gsap-setup.js';

export function mountPreloader(onDone) {
  const el = document.getElementById('preloader');
  if (!el) {
    onDone?.();
    return;
  }

  const counter = el.querySelector('.preloader__counter');
  const veil = el.querySelector('.preloader__veil');
  const inner = el.querySelector('.preloader__inner');

  if (!motionOK) {
    el.style.display = 'none';
    onDone?.();
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      el.style.display = 'none';
      onDone?.();
    },
  });

  const obj = { v: 0 };
  tl.to(obj, {
    v: 100,
    duration: 1.6,
    ease: 'power2.out',
    onUpdate: () => {
      counter.textContent = Math.round(obj.v).toString().padStart(2, '0');
    },
  });
  tl.to(inner, { opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=0.2');
  tl.to(veil, { scaleY: 0, duration: 1.0, ease: 'expo.inOut', transformOrigin: 'top' }, '-=0.1');
}
