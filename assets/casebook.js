'use strict';
document.querySelectorAll('.print-document').forEach(button => button.addEventListener('click', () => window.print()));
document.querySelectorAll('[data-project-switch]').forEach(select => {
  select.addEventListener('change', () => window.location.assign(select.value));
});

// A deep link must reveal its evidence, even when an optional section is closed.
function revealEvidence(hash, focus = false) {
  let id;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (!target) return;
  for (let parent = target; parent; parent = parent.parentElement) {
    if (parent.tagName === 'DETAILS') parent.open = true;
  }
  requestAnimationFrame(() => {
    target.scrollIntoView({block: 'start'});
    if (focus) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({preventScroll: true});
    }
  });
}
window.addEventListener('hashchange', () => revealEvidence(window.location.hash, true));
window.addEventListener('load', () => revealEvidence(window.location.hash));
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => revealEvidence(link.hash, true));
});
let openDetails = [];
window.addEventListener('beforeprint', () => {
  openDetails = [...document.querySelectorAll('details')].filter(el => !el.open);
  openDetails.forEach(el => { el.open = true; });
});
window.addEventListener('afterprint', () => {
  openDetails.forEach(el => { el.open = false; });
});
const links = [...document.querySelectorAll('.document-nav a[href^="#"]')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const current = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top-b.boundingClientRect.top)[0];
    if (!current) return;
    links.forEach(link => {
      if (link.hash === '#'+current.target.id) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  }, {rootMargin:'-10% 0px -65% 0px'});
  links.forEach(link => { const el=document.getElementById(link.hash.slice(1)); if(el) observer.observe(el); });
}
