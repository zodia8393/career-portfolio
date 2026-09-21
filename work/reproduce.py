"""Recalculate the published aggregates. Standard library only; no company raw data."""
import csv
import json
from decimal import Decimal
from pathlib import Path

DATA=Path(__file__).resolve().parents[1]/'assets/work-evidence'


def main():
    with (DATA/'gangwon-od.csv').open(encoding='utf-8') as f: rows=list(csv.DictReader(f))
    assert len(rows)==1728
    assert len({(r['period'],r['origin'],r['destination']) for r in rows})==len(rows)
    assert all(Decimal(r['daily_trips'])*int(r['observed_days'])==int(r['period_trips']) for r in rows)
    summaries=json.loads((DATA/'gangwon-summary.json').read_text())
    for s in summaries:
        inbound=s['direction']=='유입'
        selected=[r for r in rows if r['period']==s['period'] and r['origin']!=r['destination']
                  and r['destination' if inbound else 'origin']==s['city']
                  and (r['origin_gangwon' if inbound else 'destination_gangwon']=='True')==(s['region']=='도내')]
        total=sum(int(r['period_trips']) for r in selected)
        assert total==s['period_trips']
        assert Decimal(str(s['daily_trips']))*(5 if s['period']=='평일' else 2)==total
    evidence=json.loads((DATA/'evidence.json').read_text())
    assert len(evidence['regression'])==14
    assert all(r['equal'] and r['r_rows']==r['python_rows'] for r in evidence['regression'])
    assert evidence['workplace_ab']['status']=='not_started'
    assert evidence['workplace_ab']['observations']==0
    print(f'PASS: {len(rows)} OD rows; {len(summaries)} summary cells; 14 stored-file checks')
    print('This checks public aggregate arithmetic, not source-file equality or A/B effects.')


if __name__=='__main__': main()
