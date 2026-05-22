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

// ── Cloudflare Turnstile loader ──
// Loads challenges.cloudflare.com/turnstile/v0/api.js once.
// Resolves when window.turnstile is available.
let turnstilePromise = null;
function loadTurnstile() {
  if (turnstilePromise) return turnstilePromise;
  turnstilePromise = new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(window.turnstile);
    s.onerror = () => reject(new Error('Turnstile failed to load'));
    document.head.appendChild(s);
  });
  return turnstilePromise;
}

export function mountContact() {
  const el = document.getElementById('contact');
  if (!el) return;

  const form = contact.form;
  const turnstileEnabled =
    form.turnstileSiteKey && form.turnstileSiteKey !== 'YOUR_TURNSTILE_SITE_KEY';

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

      <form class="contact__form form" novalidate>
        <input type="hidden" name="access_key" value="${form.accessKey}" />
        <input type="hidden" name="subject" value="${form.subject}" />
        <input type="hidden" name="from_name" value="AAK Advisory — Confidential Introduction" />
        <input type="hidden" name="redirect" value="false" />
        <input type="checkbox" name="botcheck" class="form__honeypot" tabindex="-1" autocomplete="off" />

        <div class="form__grid">
          ${form.fields.map(renderField).join('')}
        </div>

        ${turnstileEnabled
          ? `<div class="form__captcha">
              <div class="form__captcha-widget" id="cf-turnstile-host"></div>
              <p class="form__captcha-hint mono">Protected by Cloudflare</p>
            </div>`
          : ''}

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
  // transformed/overflow-hidden ancestor (GSAP transforms on the section
  // would otherwise re-parent fixed positioning to that section). ──
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
  const modalClose = modal.querySelector('.thanks-modal__close');
  const modalBackdrop = modal.querySelector('.thanks-modal__backdrop');
  let modalTimer = null;
  let turnstileWidgetId = null;
  let turnstileToken = '';

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

  // ── Mount Turnstile widget ──
  if (turnstileEnabled) {
    loadTurnstile()
      .then((turnstile) => {
        const host = el.querySelector('#cf-turnstile-host');
        if (!host) return;
        turnstileWidgetId = turnstile.render(host, {
          sitekey: form.turnstileSiteKey,
          theme: 'light',
          appearance: 'always',
          callback: (token) => { turnstileToken = token; },
          'expired-callback': () => { turnstileToken = ''; },
          'error-callback': () => { turnstileToken = ''; },
        });
      })
      .catch(() => {
        feedback.className = 'form__feedback is-error';
        feedback.textContent = 'Captcha failed to load. Please refresh the page.';
      });
  }

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const accessKey = formEl.querySelector('input[name="access_key"]').value;
    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      feedback.className = 'form__feedback is-error';
      feedback.innerHTML = `Form is not yet configured. Please write directly to <a href="mailto:${form.replyEmail}">${form.replyEmail}</a>.`;
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      feedback.className = 'form__feedback is-error';
      feedback.textContent = 'Please complete the captcha before sending.';
      return;
    }

    submit.classList.add('is-loading');
    submit.disabled = true;
    feedback.className = 'form__feedback';
    feedback.textContent = '';

    const data = new FormData(formEl);
    if (turnstileEnabled && turnstileToken) {
      // Web3Forms accepts the Turnstile response under this field name.
      data.set('cf-turnstile-response', turnstileToken);
    }

    try {
      const res = await fetch(form.endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        formEl.reset();
        // Reset the captcha so a new token is required for the next submit.
        if (turnstileEnabled && window.turnstile && turnstileWidgetId !== null) {
          try { window.turnstile.reset(turnstileWidgetId); } catch (_) {}
          turnstileToken = '';
        }
        openModal();
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      feedback.className = 'form__feedback is-error';
      feedback.innerHTML = `${form.errorMessage}`;
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
