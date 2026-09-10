'use strict';
const steps = [
  '외부 API의 취소여부가 빈 문자열로 반환돼 기존 요청의 상태가 검토 필요로 남았습니다.',
  '결과가 불명확한 동안 후속 요청을 차단했습니다. 동일 작업을 새 요청으로 재전송하지 않았습니다.',
  '이전 요청번호로 실제 처리 결과를 다시 확인했습니다. 기록을 삭제하거나 새 요청을 보내지 않았습니다.',
  '응답 항목이 존재하고 올바른 형식인지 검사하면서 취소 여부가 빈 값인 경우의 처리를 보완했습니다. 처리 결과와 확인 기록이 중복 저장되지 않는지 검사했습니다.',
  '같은 응답 오류와 기존 기능을 다시 검사하고 수정한 버전과 되돌릴 이전 버전의 기록을 보관했습니다. 별도 배포의 전체 테스트 481개 통과는 이 사건 한 건의 검사 개수와 구분합니다.'
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
      ['수집·저장 행수', `${data.latest_run.input_rows} / ${data.latest_run.accepted_rows}`, 'PASS'],
      ['데이터 품질 검사(dbt)', data.latest_run.dbt_status, data.latest_run.dbt_status],
      ['분석에 쓸 자료의 확인 조건', `${data.latest_run.gate_passed} / ${data.latest_run.gate_total}`, 'PASS'],
      ['사용 가능 여부', data.latest_run.delivery_status === 'READY' ? '사용 가능 (READY)' : data.latest_run.delivery_status, 'PASS']
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
