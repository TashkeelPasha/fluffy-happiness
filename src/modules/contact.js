import { gsap, motionOK } from '../lib/gsap-setup.js';
import { contact } from '../data/content.js';

function renderField(f) {
  const required = f.required ? ' required' : '';
  if (f.type === 'textarea') {
    return `
      <div class="form__row form__row--full">
        <label class="form__label" for="cf-${f.name}">${f.label}${f.required ? ' *' : ''}</label>
        <textarea id="cf-${f.name}" name="${f.name}" rows="5" placeholder="${f.placeholder || ''}"${required}></textarea>
      </div>`;
  }
  if (f.type === 'select') {
    return `
      <div class="form__row">
        <label class="form__label" for="cf-${f.name}">${f.label}${f.required ? ' *' : ''}</label>
        <select id="cf-${f.name}" name="${f.name}"${required}>
          ${f.options.map((o, i) => `<option value="${i === 0 ? '' : o}"${i === 0 ? ' disabled selected' : ''}>${o}</option>`).join('')}
        </select>
      </div>`;
  }
  return `
    <div class="form__row">
      <label class="form__label" for="cf-${f.name}">${f.label}${f.required ? ' *' : ''}</label>
      <input id="cf-${f.name}" name="${f.name}" type="${f.type}" placeholder="${f.placeholder || ''}"${required} />
    </div>`;
}

// ── Lightweight in-house captcha: simple arithmetic challenge ──
// Pairs with the existing honeypot + a "submitted too fast" time-trap.
// No third-party service, no Pro plan, no external network calls.
function newChallenge() {
  const a = Math.floor(Math.random() * 8) + 2; // 2..9
  const b = Math.floor(Math.random() * 8) + 2; // 2..9
  return { a, b, answer: a + b };
}

export function mountContact() {
  const el = document.getElementById('contact');
  if (!el) return;

  const form = contact.form;
  let challenge = newChallenge();
  const mountedAt = Date.now();

  el.innerHTML = `
    <div class="container--narrow contact">
      <header class="contact__head">
        <span class="eyebrow">${contact.eyebrow}</span>
        <span class="contact__reply mono">
          <span class="contact__reply-dot" aria-hidden="true"></span>
          ${contact.reply.label} · ${contact.reply.text}
        </span>
      </header>

      <h2 id="contact-title" class="contact__title">${contact.title}</h2>
      <p class="contact__body">${contact.body}</p>

      <form class="contact__form form">
        <input type="hidden" name="access_key" value="${form.accessKey}" />
        <input type="hidden" name="subject" value="${form.subject}" />
        <input type="hidden" name="from_name" value="AAK Advisory — Confidential Introduction" />
        <input type="hidden" name="redirect" value="false" />
        <input type="checkbox" name="botcheck" class="form__honeypot" tabindex="-1" autocomplete="off" />

        <div class="form__grid">
          ${form.fields.map(renderField).join('')}
        </div>

        <div class="form__captcha">
          <label class="form__captcha-label" for="cf-captcha">
            <span class="form__captcha-eyebrow mono">Verify you are human</span>
            <span class="form__captcha-question">
              What is <strong class="form__captcha-a">${challenge.a}</strong>
              <span aria-hidden="true">+</span><span class="sr-only"> plus </span>
              <strong class="form__captcha-b">${challenge.b}</strong>?
            </span>
          </label>
          <input
            id="cf-captcha"
            class="form__captcha-input"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            autocomplete="off"
            required
            placeholder="Answer"
          />
        </div>

        <div class="form__actions">
          <button type="submit" class="btn btn--primary form__submit" data-magnetic="0.18">
            <span class="form__submit-label">Send confidential introduction</span>
            <span class="form__submit-spinner" aria-hidden="true"></span>
          </button>
          <span class="form__hint mono">Replies within 24 hours · Confidential</span>
        </div>

        <p class="form__feedback" role="status" aria-live="polite"></p>
      </form>

      <div class="contact__cta">
        ${contact.cta
          .map(
            (b) => `
          <a class="btn btn--${b.kind}" href="${b.href}"${b.external ? ' target="_blank" rel="noopener"' : ''} data-magnetic="0.22">${b.label}</a>`
          )
          .join('')}
      </div>

      <p class="contact__foot">${contact.foot}</p>
    </div>
  `;

  // ── Thank-you modal — appended to <body> so it escapes any
  // transformed/overflow-hidden ancestor. ──
  const modal = document.createElement('div');
  modal.className = 'thanks-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'thanks-title');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="thanks-modal__backdrop"></div>
    <div class="thanks-modal__card" role="document">
      <button type="button" class="thanks-modal__close" aria-label="Close">&times;</button>
      <div class="thanks-modal__check" aria-hidden="true">
        <svg viewBox="0 0 52 52" width="48" height="48">
          <circle class="thanks-modal__check-ring" cx="26" cy="26" r="24" fill="none" stroke="currentColor" stroke-width="2"/>
          <path class="thanks-modal__check-tick" d="M14 27 l8 8 l16 -18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 id="thanks-title" class="thanks-modal__title">Thank you.</h3>
      <p class="thanks-modal__body">Your message has been received. Expect a confidential reply within 24 hours.</p>
      <p class="thanks-modal__hint mono">This window closes automatically</p>
    </div>
  `;
  document.body.appendChild(modal);

  const formEl = el.querySelector('.contact__form');
  const feedback = el.querySelector('.form__feedback');
  const submit = el.querySelector('.form__submit');
  const captchaInput = el.querySelector('.form__captcha-input');
  const captchaA = el.querySelector('.form__captcha-a');
  const captchaB = el.querySelector('.form__captcha-b');
  const modalClose = modal.querySelector('.thanks-modal__close');
  const modalBackdrop = modal.querySelector('.thanks-modal__backdrop');
  let modalTimer = null;

  const rerollChallenge = () => {
    challenge = newChallenge();
    captchaA.textContent = challenge.a;
    captchaB.textContent = challenge.b;
    captchaInput.value = '';
  };

  const closeModal = () => {
    if (modalTimer) { clearTimeout(modalTimer); modalTimer = null; }
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const openModal = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalTimer = setTimeout(closeModal, 5000);
  };

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Mark the form as "submission-attempted" so :invalid styling can
    // light up only after the user clicks submit — not on initial render.
    formEl.classList.add('is-submitted');

    // Belt-and-braces: enforce required fields in JS in case anything
    // bypasses native HTML5 validation. Browsers will normally have
    // surfaced their own tooltip before we even get here.
    if (!formEl.checkValidity()) {
      const firstInvalid = formEl.querySelector(':invalid');
      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: false });
        firstInvalid.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      feedback.className = 'form__feedback is-error';
      feedback.textContent = 'Please fill in all required fields before sending.';
      return;
    }

    const accessKey = formEl.querySelector('input[name="access_key"]').value;
    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      feedback.className = 'form__feedback is-error';
      feedback.innerHTML = `Form is not yet configured. Please write directly to <a href="mailto:${form.replyEmail}">${form.replyEmail}</a>.`;
      return;
    }

    // Captcha check
    const guess = parseInt(captchaInput.value, 10);
    if (Number.isNaN(guess) || guess !== challenge.answer) {
      feedback.className = 'form__feedback is-error';
      feedback.textContent = 'That sum is not right. Please try again.';
      rerollChallenge();
      captchaInput.focus();
      return;
    }

    // Time-trap — humans don't fill and submit in under 2 seconds.
    if (Date.now() - mountedAt < 2000) {
      feedback.className = 'form__feedback is-error';
      feedback.textContent = 'Please take a moment to review your message.';
      return;
    }

    submit.classList.add('is-loading');
    submit.disabled = true;
    feedback.className = 'form__feedback';
    feedback.textContent = '';

    const data = new FormData(formEl);
    // Don't ship the captcha answer to Web3Forms — it's not useful in the email.
    data.delete('captcha-answer');

    try {
      const res = await fetch(form.endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        formEl.reset();
        formEl.classList.remove('is-submitted');
        rerollChallenge();
        openModal();
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      feedback.className = 'form__feedback is-error';
      feedback.innerHTML = `${form.errorMessage}`;
      rerollChallenge();
    } finally {
      submit.classList.remove('is-loading');
      submit.disabled = false;
    }
  });

  if (!motionOK) return;

  gsap.from(el.querySelectorAll('.container--narrow > *'), {
    opacity: 0,
    y: 32,
    duration: 0.9,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 78%' },
    clearProps: 'transform,will-change',
  });

  gsap.from(el.querySelectorAll('.form__row'), {
    opacity: 0,
    y: 18,
    duration: 0.6,
    stagger: 0.06,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.contact__form', start: 'top 85%' },
    clearProps: 'transform,will-change',
  });
}
