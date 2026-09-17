'use strict';
document.querySelectorAll('.print-document').forEach(button => button.addEventListener('click', () => window.print()));
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
