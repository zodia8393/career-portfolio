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
let navigationFrame = false;
function updateCurrentSection() {
  navigationFrame = false;
  const sections = links.map(link => ({link, node:document.getElementById(link.hash.slice(1))}))
    .filter(item => item.node).map(item => ({...item, top:item.node.getBoundingClientRect().top}));
  const passed = sections.filter(item => item.top <= 150).sort((a,b) => b.top-a.top);
  const current = passed[0] || sections[0];
  links.forEach(link => {
    if (current && link === current.link) link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', () => {
  if (!navigationFrame) { navigationFrame = true; requestAnimationFrame(updateCurrentSection); }
}, {passive:true});
window.addEventListener('load', updateCurrentSection);
window.addEventListener('resize', updateCurrentSection);
