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

function initConciergeForm() {
  const form = document.querySelector('[data-concierge]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('nombre') || 'visionaria';
    const act = formData.get('acto') || 'acto iluminado';
    const toastTrigger = document.querySelector('[data-toast]');
    if (toastTrigger) {
      const message = `Solicitud registrada para ${name} · ${act}. El consejo responderá en 47 minutos.`;
      const toastMessage = document.querySelector('[data-toast-message]');
      if (toastMessage) {
        toastMessage.textContent = message;
      }
      toastTrigger.hidden = false;
      toastTrigger.classList.add('is-visible');
      clearTimeout(toastTimeoutId);
      toastTimeoutId = window.setTimeout(() => {
        toastTrigger.classList.remove('is-visible');
        toastTimeoutId = window.setTimeout(() => {
          toastTrigger.hidden = true;
        }, 320);
      }, 2800);
    }

    form.reset();
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
