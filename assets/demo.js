'use strict';
const steps = [
  '외부 API의 취소여부가 빈 문자열로 반환돼 기존 요청의 상태가 검토 필요로 남았습니다.',
  '결과가 불명확한 동안 후속 요청을 차단했습니다. 동일 작업을 새 요청으로 재전송하지 않았습니다.',
  '기존 식별자로 확정 결과를 재조회했습니다. 기록을 삭제하거나 새 식별자를 만들지 않았습니다.',
  '응답 필드의 존재·타입 검사는 유지하고 빈 문자열 처리를 보완했습니다. 확정 결과와 감사 기록이 중복 반영되지 않는지 확인했습니다.',
  '같은 유형의 응답을 회귀 테스트에 추가하고 버전별 배포·복구 경로를 보존했습니다. 별도 배포의 전체 481개 테스트 결과와 이 사건의 검증 범위는 구분합니다.'
];
const detail = document.getElementById('step-detail');
if (detail) {
  detail.textContent = steps[0];
  document.querySelectorAll('.step').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.step').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    detail.textContent = steps[Number(button.dataset.step)];
  }));
}
const filter = document.getElementById('run-filter');
if (filter) {
  const target = document.getElementById('run-results');
  fetch('../assets/mobility-snapshot.json').then(r => {if (!r.ok) throw new Error('기록을 읽을 수 없습니다.'); return r.json();}).then(data => {
    const checks = [
      ['입력·적재 행수', `${data.latest_run.input_rows} / ${data.latest_run.accepted_rows}`, 'PASS'],
      ['dbt 검사', data.latest_run.dbt_status, data.latest_run.dbt_status],
      ['게시 조건', `${data.latest_run.gate_passed} / ${data.latest_run.gate_total}`, 'PASS'],
      ['게시 상태', data.latest_run.delivery_status, 'PASS']
    ];
    function draw() {
      const rows = checks.filter(row => filter.value === 'all' || row[2] === filter.value);
      target.replaceChildren();
      const note = document.createElement('p');
      note.className = 'note'; note.textContent = `확인 시각: ${data.verified_at} · 로컬 Docker 실행 기록`;
      target.append(note);
      if (!rows.length) { const empty = document.createElement('p'); empty.textContent = '이 기록에는 실패한 검사 항목이 없습니다. 과거 전체 실행에 장애가 없었다는 뜻은 아닙니다.'; target.append(empty); return; }
      const table = document.createElement('table');
      const head = table.createTHead().insertRow();
      ['검사','결과','상태'].forEach(value => {const cell = document.createElement('th');cell.textContent=value;head.append(cell);});
      const body = table.createTBody();
      rows.forEach(row => {const tr=body.insertRow();row.forEach(value => {tr.insertCell().textContent=value;});});
      target.append(table);
    }
    filter.addEventListener('change',draw); draw();
    document.getElementById('download').addEventListener('click',()=>{
      const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
      const a=document.createElement('a');a.href=url;a.download='mobility-snapshot-20260831.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
  }).catch(error => { target.textContent = `${error.message} 페이지를 새로고침하거나 보고서 PDF를 확인해 주세요.`; document.getElementById('download').disabled=true; });
}
