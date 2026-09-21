(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('work-data').textContent);
  const city = document.getElementById('work-city');
  const fmt = n => n.toLocaleString('ko-KR', {maximumFractionDigits: 1});
  function render() {
    const rows = data.filter(r => r.city === city.value);
    const value = (p, d) => rows.filter(r => r.period === p && r.direction === d).reduce((sum, r) => sum + r.daily_trips, 0);
    const measures = ['평일','주말'].flatMap(p => ['유입','유출'].map(d => ({p,d,n:value(p,d)})));
    const max = Math.max(...measures.map(r => r.n), 1);
    const bars = measures.map(r => `<div class="work-bar"><span>${r.p} ${r.d}</span><div class="work-track"><div class="work-fill ${r.p==='주말'?'weekend':''}" style="width:${100*r.n/max}%"></div></div><strong>${fmt(r.n)}</strong></div>`).join('');
    const cells = rows.map(r => `<tr><td>${r.period}</td><td>${r.direction}</td><td>${r.region}</td><td>${fmt(r.daily_trips)}</td><td>${fmt(r.period_trips)}</td></tr>`).join('');
    document.getElementById('work-summary').innerHTML = `<h3>${city.value} · 유입·유출 일평균</h3><p class="work-legend"><span class="work-swatch"></span>평일 <span class="work-swatch weekend"></span>주말 · 단위 대/일</p><div class="work-bars" role="img" aria-label="${city.value} 평일·주말 유입·유출 일평균, 상세 값은 다음 표 참고">${bars}</div><div class="work-scroll"><table><thead><tr><th>구분</th><th>방향</th><th>상대 지역</th><th>일평균 대/일</th><th>기간 합계 대</th></tr></thead><tbody>${cells}</tbody></table></div>`;
    const weekday = value('평일','유입');
    const weekend = value('주말','유입');
    const delta = weekend - weekday;
    const rate = weekday > 0 ? ` (${fmt(Math.abs(delta / weekday * 100))}%)` : '';
    document.getElementById('work-interpretation').textContent = `${city.value}의 주말 유입은 평일보다 하루 평균 ${fmt(Math.abs(delta))}대${rate} ${delta>0?'많습니다':delta<0?'적습니다':'차이가 없습니다'}. 이는 기간 길이를 맞춘 표본의 차이이며, 주말 자체의 인과효과나 관광 수요의 증가율을 뜻하지 않습니다.`;
  }
  city.addEventListener('change', render);
  render();
})();
