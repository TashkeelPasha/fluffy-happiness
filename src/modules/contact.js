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

export function mountContact() {
  const el = document.getElementById('contact');
  if (!el) return;

  const form = contact.form;

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

  // ---- Form submission via Web3Forms (works on any static host) ----
  const formEl = el.querySelector('.contact__form');
  const feedback = el.querySelector('.form__feedback');
  const submit = el.querySelector('.form__submit');

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const accessKey = formEl.querySelector('input[name="access_key"]').value;
    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      feedback.className = 'form__feedback is-error';
      feedback.innerHTML = `Form is not yet configured. Please write directly to <a href="mailto:${form.replyEmail}">${form.replyEmail}</a>.`;
      return;
    }

    submit.classList.add('is-loading');
    submit.disabled = true;
    feedback.className = 'form__feedback';
    feedback.textContent = '';

    const data = new FormData(formEl);
    try {
      const res = await fetch(form.endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        feedback.className = 'form__feedback is-success';
        feedback.textContent = form.successMessage;
        formEl.reset();
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
  });

  gsap.from(el.querySelectorAll('.form__row'), {
    opacity: 0,
    y: 18,
    duration: 0.6,
    stagger: 0.06,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.contact__form', start: 'top 85%' },
  });
}
