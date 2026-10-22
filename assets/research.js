'use strict';
// The page remains readable without JavaScript; only the index location is enhanced.
const partLinks = [...document.querySelectorAll('.book-contents-nav nav a')];
const cityResults = document.getElementById('work-summary');
if (cityResults) {
  const labelTable = () => {
    const table = cityResults.querySelector('table');
    if (table && !table.caption) {
      const caption = table.createCaption();
      caption.textContent = '보충표 S1. 선택한 시군의 유입·유출 · 일평균과 기간 합계';
    }
  };
  new MutationObserver(labelTable).observe(cityResults, {childList:true});
  labelTable();
}
if (partLinks.length) {
  const updatePart = () => {
    let current = partLinks[0];
    for (const link of partLinks) {
      const part = document.getElementById(link.hash.slice(1));
      if (part && part.getBoundingClientRect().top <= 150) current = link;
    }
    partLinks.forEach(link => {
      if (link === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', updatePart, {passive:true});
  updatePart();
}
