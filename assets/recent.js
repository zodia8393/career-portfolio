'use strict';
// This selector compares recorded scenarios. It does not run the routing engine.
const overlapData = document.getElementById('overlap-data');
if (overlapData) {
  const data = JSON.parse(overlapData.textContent);
  const vehicle = document.getElementById('overlap-vehicle');
  const count = document.getElementById('overlap-count');
  const update = () => {
    const series = data[vehicle.value];
    const index = data.vehicles.indexOf(Number(count.value));
    const before = series.before[index];
    const after = series.after[index];
    const summary = document.getElementById('overlap-summary');
    summary.querySelector('strong').textContent = `${series.label} ${count.value}대 · 공유 도로 ${((1-after/before)*100).toFixed(1)}% 감소`;
    summary.querySelector('p').textContent = `${before.toFixed(3)}km → ${after.toFixed(3)}km`;
    document.getElementById('overlap-before').textContent = `${before.toFixed(3)}km`;
    document.getElementById('overlap-after').textContent = `${after.toFixed(3)}km`;
    document.getElementById('overlap-before-bar').style.width = `${before/9*100}%`;
    document.getElementById('overlap-after-bar').style.width = `${after/9*100}%`;
  };
  vehicle.addEventListener('change', update);
  count.addEventListener('change', update);
  update();
}
