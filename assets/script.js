const sequences = [
  'Secuenciador cuántico · Lanzamiento autoajustable',
  'Matriz ritual · 12 guardianes conectados',
  'Núcleo háptico · Feedback multisensorial',
  'Oráculo de métricas · Scorecards vivos',
  'Consejo sintético · Respuestas en 47 minutos',
  'Estación VR · Experiencias envolventes sin latencia'
];

const flowDescriptions = {
  orbit: {
    badge: 'Órbita privilegiada',
    title: 'Mapea tu lanzamiento en un lienzo sensorial',
    text: 'Activa nodos, asigna guardianes y deja que la app trace dependencias iluminadas en tiempo real.'
  },
  immersive: {
    badge: 'Inmersión total',
    title: 'Diseña rituales con luz, sonido y vibración',
    text: 'Combina recursos audiovisuales, interfaces hápticas y narrativa viva para convertir audiencias en devotos.'
  },
  concierge: {
    badge: 'Consejo perpetuo',
    title: 'Coordina guardianes y recibe alertas anticipadas',
    text: 'El concierge sintético monitorea métricas, agenda círculos y envía recomendaciones oraculares a cada rol.'
  }
};

const CONCIERGE_EMAIL = 'blessthewinnerofgod@gmail.com';
const CONCIERGE_STORAGE_KEY = 'aurvo-concierge-queue';

let marqueeAnimationId;
let timelineIndex = 0;
let toastTimeoutId;

function initNavigation() {
  const buttons = document.querySelectorAll('[data-screen-target]');
  const screens = document.querySelectorAll('.app-screen');
  const shell = document.querySelector('.app-shell');
  const gradient = document.querySelector('[data-dynamic-gradient]');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.screenTarget;
      const target = document.getElementById(targetId);
      if (!target) return;

      screens.forEach((screen) => {
        screen.classList.toggle('is-active', screen === target);
      });

      buttons.forEach((other) => {
        const isActive = other === button;
        other.classList.toggle('is-active', isActive);
        other.setAttribute('aria-pressed', String(isActive));
      });

      const theme = button.dataset.theme;
      if (theme) {
        shell.dataset.theme = theme;
        if (gradient) {
          gradient.dataset.theme = theme;
        }
      }
    });
  });
}

function initSequences() {
  const track = document.querySelector('[data-sequence-track]');
  if (!track) return;

  const fragment = document.createDocumentFragment();
  sequences.forEach((item) => {
    const span = document.createElement('span');
    span.textContent = item;
    fragment.appendChild(span);
  });
  sequences.forEach((item) => {
    const span = document.createElement('span');
    span.textContent = item;
    fragment.appendChild(span);
  });
  track.appendChild(fragment);

  let offset = 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const animate = () => {
    offset -= 0.5;
    if (Math.abs(offset) >= track.scrollWidth / 2) {
      offset = 0;
    }
    track.style.transform = `translateX(${offset}px)`;
    marqueeAnimationId = requestAnimationFrame(animate);
  };

  if (!prefersReducedMotion.matches) {
    marqueeAnimationId = requestAnimationFrame(animate);
  }

  const handlePreferenceChange = (event) => {
    if (event.matches) {
      cancelAnimationFrame(marqueeAnimationId);
      track.style.transform = '';
    } else {
      offset = 0;
      marqueeAnimationId = requestAnimationFrame(animate);
    }
  };

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', handlePreferenceChange);
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener(handlePreferenceChange);
  }
}

function initFlowOutput() {
  const buttons = document.querySelectorAll('[data-flow-button]');
  const output = document.querySelector('[data-flow-output]');
  if (!buttons.length || !output) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.flowButton;
      const data = flowDescriptions[key];
      if (!data) return;

      output.querySelector('.flow-output__badge').textContent = data.badge;
      output.querySelector('h3').textContent = data.title;
      output.querySelector('p').textContent = data.text;

      buttons.forEach((other) => {
        other.classList.toggle('is-active', other === button);
        other.setAttribute('aria-pressed', String(other === button));
      });
    });
  });
}

function initTimeline() {
  const steps = document.querySelectorAll('[data-timeline] li');
  const advanceButton = document.querySelector('[data-timeline-advance]');
  if (!steps.length || !advanceButton) return;

  advanceButton.addEventListener('click', () => {
    timelineIndex = (timelineIndex + 1) % steps.length;
    steps.forEach((step, index) => {
      step.classList.toggle('is-active', index === timelineIndex);
    });
  });
}

function initPanel() {
  const panel = document.querySelector('[data-panel]');
  const openButtons = document.querySelectorAll('[data-panel-open]');
  const closeButton = document.querySelector('[data-panel-close]');

  if (!panel) return;

  const openPanel = () => {
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
  };

  const closePanel = () => {
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
  };

  openButtons.forEach((button) => {
    button.addEventListener('click', openPanel);
  });

  if (closeButton) {
    closeButton.addEventListener('click', closePanel);
  }

  panel.addEventListener('click', (event) => {
    if (event.target === panel) {
      closePanel();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      closePanel();
    }
  });
}

function initToast() {
  const toast = document.querySelector('[data-toast]');
  const message = document.querySelector('[data-toast-message]');
  const triggers = document.querySelectorAll('[data-toast-trigger]');
  if (!toast || !message || !triggers.length) return;

  const showToast = (text) => {
    message.textContent = text;
    toast.hidden = false;
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    clearTimeout(toastTimeoutId);
    toastTimeoutId = window.setTimeout(() => {
      toast.classList.remove('is-visible');
      toastTimeoutId = window.setTimeout(() => {
        toast.hidden = true;
      }, 300);
    }, 2600);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const custom = trigger.dataset.toastMessage;
      const text = custom || 'El consejo ha recibido tu invocación.';
      showToast(text);
    });
  });
}

function formatConciergePayload(formData, actLabel) {
  const clean = (value) => (typeof value === 'string' ? value.trim() : '');
  const timestamp = new Date();
  return {
    name: clean(formData.get('nombre')),
    email: clean(formData.get('email')),
    act: clean(formData.get('acto')),
    actLabel: clean(actLabel),
    message: clean(formData.get('mensaje')),
    createdAt: timestamp.toISOString()
  };
}

function persistConciergeRequest(payload) {
  try {
    const stored = localStorage.getItem(CONCIERGE_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    const queue = Array.isArray(parsed) ? parsed : [];
    queue.unshift(payload);
    localStorage.setItem(CONCIERGE_STORAGE_KEY, JSON.stringify(queue.slice(0, 10)));
  } catch (error) {
    // Storage might be unavailable; fail silently to keep the flow unblocked.
  }
}

function buildConciergeEmail(payload) {
  const date = payload.createdAt ? new Date(payload.createdAt) : new Date();
  let formattedDate;

  if (!Number.isNaN(date.getTime())) {
    try {
      const formatter = new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short'
      });
      formattedDate = formatter.format(date);
    } catch (error) {
      formattedDate = date.toLocaleString('es-ES');
    }
  }

  if (!formattedDate) {
    formattedDate = new Date().toLocaleString('es-ES');
  }

  const lines = [
    'Solicitud registrada desde la Aurvo HyperApp.',
    `Nombre o círculo: ${payload.name || 'No indicado'}`,
    `Correo de contacto: ${payload.email || 'No indicado'}`,
    `Acto prioritario: ${payload.actLabel || payload.act || 'No especificado'}`,
    '',
    'Mensaje para el consejo:',
    payload.message || '—',
    '',
    `Fecha y hora de envío: ${formattedDate}`
  ];

  return {
    subject: `Aurvo HyperApp · ${payload.name || 'Nueva solicitud'}`,
    body: lines.join('\n')
  };
}

async function dispatchConciergeEmail(payload) {
  const { subject, body } = buildConciergeEmail(payload);
  const mailtoLink = `mailto:${CONCIERGE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  let launched = false;

  try {
    const newWindow = window.open(mailtoLink, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      launched = true;
      newWindow.focus();
    }
  } catch (error) {
    launched = false;
  }

  if (!launched) {
    try {
      window.location.href = mailtoLink;
      launched = true;
    } catch (error) {
      launched = false;
    }
  }

  if (!launched && navigator.share) {
    try {
      await navigator.share({
        title: subject,
        text: body
      });
      launched = true;
    } catch (error) {
      launched = false;
    }
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
    } catch (error) {
      // Clipboard may require permissions; ignore failure.
    }
  }

  persistConciergeRequest({ ...payload, subject, body });

  return { launched, subject, body };
}

function setConciergeStatus(element, text, state) {
  if (!element) return;
  element.textContent = text;
  if (state) {
    element.dataset.status = state;
  } else {
    delete element.dataset.status;
  }
}

function initConciergeForm() {
  const form = document.querySelector('[data-concierge]');
  if (!form) return;

  const statusElement = form.querySelector('[data-concierge-status]');
  const submitButton = form.querySelector('button[type="submit"]');
  const toast = document.querySelector('[data-toast]');
  const toastMessage = document.querySelector('[data-toast-message]');

  const setLoadingState = (isLoading) => {
    if (!submitButton) return;
    const defaultLabel = submitButton.dataset.submitLabel || submitButton.textContent;
    const loadingLabel = submitButton.dataset.loadingLabel || 'Enviando…';
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? loadingLabel : defaultLabel;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
      setConciergeStatus(statusElement, 'Revisa los campos marcados y vuelve a intentarlo.', 'error');
      return;
    }

    const formData = new FormData(form);
    const actField = form.querySelector('select[name="acto"]');
    const actLabel = actField && actField.options[actField.selectedIndex]
      ? actField.options[actField.selectedIndex].textContent
      : '';

    const payload = formatConciergePayload(formData, actLabel);

    setLoadingState(true);
    setConciergeStatus(statusElement, 'Invocando al consejo iluminatti…', 'pending');

    dispatchConciergeEmail(payload)
      .then(({ launched }) => {
        const successMessage = `Solicitud enviada para ${payload.name || 'tu círculo visionario'}.`;
        const followUp = launched
          ? 'Revisa tu bandeja de correo para finalizar la coordinación.'
          : 'Hemos copiado los detalles para que puedas reenviarlos manualmente.';
        setConciergeStatus(statusElement, `${successMessage} ${followUp}`, 'success');

        if (toast && toastMessage) {
          toastMessage.textContent = `${payload.name || 'Círculo visionario'} · Activo ${payload.actLabel || payload.act || 'personalizado'}`;
          toast.hidden = false;
          requestAnimationFrame(() => {
            toast.classList.add('is-visible');
          });
          clearTimeout(toastTimeoutId);
          toastTimeoutId = window.setTimeout(() => {
            toast.classList.remove('is-visible');
            toastTimeoutId = window.setTimeout(() => {
              toast.hidden = true;
            }, 300);
          }, 3200);
        }

        form.reset();
      })
      .catch(() => {
        setConciergeStatus(statusElement, 'No pudimos abrir tu cliente de correo. Copia el mensaje y envíalo manualmente.', 'error');
      })
      .finally(() => {
        setLoadingState(false);
      });
  });
}

function initDynamicCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  counters.forEach((counter) => {
    const target = Number(counter.dataset.counter);
    if (Number.isNaN(target)) return;

    if (prefersReducedMotion.matches) {
      counter.textContent = target.toString();
      return;
    }

    let start = 0;
    const duration = 1400;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value.toString();
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toString();
      }
    };

    requestAnimationFrame(update);
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('assets/sw.js')
        .catch(() => {
          // Silent failure; offline support is optional.
        });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSequences();
  initFlowOutput();
  initTimeline();
  initPanel();
  initToast();
  initConciergeForm();
  initDynamicCounters();
  registerServiceWorker();
});
