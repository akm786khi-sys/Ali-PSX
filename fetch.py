import json, time, sys, urllib.request, datetime

SYMS = """HBL UBL MCB MEBL BAFL BAHL NBP AKBL FABL HMB OGDC PPL POL MARI PSO APL ATRL NRL SNGP SSGC
ENGRO EFERT FFC FATIMA FFBL LUCK DGKC MLCF FCCL CHCC KOHC PIOC HUBC KAPCO NCPL NPL KEL
SYS TRG NETSOL AVN INDU HCAR MTL ATLH NML ILP GATM KTML SEARL AGP GLAXO ABOT NESTLE UNITY
EPCL LOTCHEM ICI ISL MUGHAL PAEL PTC""".split()

def get(sym):
    req = urllib.request.Request(
        "https://dps.psx.com.pk/timeseries/eod/" + sym,
        headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.loads(r.read().decode("utf-8"))

out, bad = {}, []
for s in SYMS:
    rows = None
    for attempt in range(2):
        try:
            j = get(s)
            rows = j.get("data") or []
            break
        except Exception as e:
            err = str(e)
            time.sleep(1)
    if rows:
        out[s] = rows[:800] if len(rows) > 800 and rows[0][0] > rows[-1][0] else rows[-800:]
        print("ok", s, len(out[s]))
    else:
        bad.append(s)
        print("FAIL", s, err if not rows else "")
    time.sleep(0.3)

print("fetched", len(out), "failed", len(bad), bad)
if len(out) < 5:
    sys.exit("Too few symbols fetched, not updating data.json")
with open("data.json", "w") as f:
    json.dump({"t": datetime.datetime.utcnow().isoformat() + "Z", "d": out}, f, separators=(",", ":"))
