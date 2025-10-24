const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const yearEl = document.getElementById('year');
const faqButtons = document.querySelectorAll('.faq__question');

if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

document.addEventListener('click', (event) => {
    if (!menu || !menuToggle) return;

    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
        menu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!isExpanded));

        const answer = button.nextElementSibling;
        if (answer) {
            if (isExpanded) {
                answer.hidden = true;
            } else {
                answer.hidden = false;
            }
        }
    });
});
