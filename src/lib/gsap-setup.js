import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
export const motionOK = !reduceMotionMQ.matches;

if (!motionOK) {
  gsap.globalTimeline.timeScale(0);
}

export { gsap, ScrollTrigger };
