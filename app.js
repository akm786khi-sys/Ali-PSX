const $=id=>document.getElementById(id);
async function sha(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('smc|'+s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
let stored=null;try{stored=localStorage.getItem('smc_pw')}catch(e){}
if(!stored){$('lockLbl').textContent='Create a password (min 6 characters)';$('lockBtn').textContent='Set password'}
$('lockBtn').onclick=async()=>{const p=$('pw').value;
  if(!stored){if(p.length<6){$('lockErr').textContent='At least 6 characters.';return}try{localStorage.setItem('smc_pw',await sha(p))}catch(e){}unlock()}
  else if(await sha(p)===stored)unlock();else $('lockErr').textContent='Wrong password.'};
$('pw').addEventListener('keydown',e=>{if(e.key==='Enter')$('lockBtn').click()});
function unlock(){$('lock').style.display='none';$('app').style.display='block';loadEngine()}
/*Q*/
const SES=d=>d>=1&&d<=4?[[572,930]]:d==5?[[572,720],[870,990]]:[];
function ms(now){const k=new Date(now.getTime()+18e6),d0=k.getUTCDay(),m=k.getUTCHours()*60+k.getUTCMinutes();
  for(let a=0;a<8;a++){const d=(d0+a)%7;for(const[s,e]of SES(d)){if(a==0&&m>=s&&m<e)return{open:1,left:e-m};if(a*1440+s>m)return{open:0,wait:a*1440+s-m,day:d,at:s}}}}
const DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],hm=m=>String(m/60|0).padStart(2,'0')+':'+String(m%60).padStart(2,'0'),dur=m=>(m>=1440?(m/1440|0)+'d ':'')+((m%1440)/60|0)+'h '+m%60+'m';
function mtxt(now){const r=ms(now);return r.open?{o:1,t:'● OPEN · closes in '+dur(r.left)}:{o:0,t:'● CLOSED · opens '+DN[r.day]+' '+hm(r.at)+' PKT (in '+dur(r.wait)+')'}}
const SECH={Banks:205,'Oil & Gas':28,Fertilizer:95,Cement:260,Power:48,Technology:285,Auto:340,Textile:175,Others:140};
const STK={};`HBL|Habib Bank|Banks
UBL|United Bank|Banks
MCB|MCB Bank|Banks
MEBL|Meezan Bank|Banks
BAFL|Bank Alfalah|Banks
BAHL|Bank AL Habib|Banks
NBP|National Bank|Banks
AKBL|Askari Bank|Banks
FABL|Faysal Bank|Banks
HMB|Habib Metropolitan|Banks
OGDC|Oil & Gas Development|Oil & Gas
PPL|Pakistan Petroleum|Oil & Gas
POL|Pakistan Oilfields|Oil & Gas
MARI|Mari Energies|Oil & Gas
PSO|Pakistan State Oil|Oil & Gas
APL|Attock Petroleum|Oil & Gas
ATRL|Attock Refinery|Oil & Gas
NRL|National Refinery|Oil & Gas
SNGP|Sui Northern Gas|Oil & Gas
SSGC|Sui Southern Gas|Oil & Gas
ENGRO|Engro Corp|Fertilizer
EFERT|Engro Fertilizers|Fertilizer
FFC|Fauji Fertilizer|Fertilizer
FATIMA|Fatima Fertilizer|Fertilizer
FFBL|Fauji Fert Bin Qasim|Fertilizer
LUCK|Lucky Cement|Cement
DGKC|D.G. Khan Cement|Cement
MLCF|Maple Leaf Cement|Cement
FCCL|Fauji Cement|Cement
CHCC|Cherat Cement|Cement
KOHC|Kohat Cement|Cement
PIOC|Pioneer Cement|Cement
HUBC|Hub Power|Power
KAPCO|Kot Addu Power|Power
NCPL|Nishat Chunian Power|Power
NPL|Nishat Power|Power
KEL|K-Electric|Power
SYS|Systems Ltd|Technology
TRG|TRG Pakistan|Technology
NETSOL|NetSol Technologies|Technology
AVN|Avanceon|Technology
INDU|Indus Motor|Auto
HCAR|Honda Atlas Cars|Auto
MTL|Millat Tractors|Auto
ATLH|Atlas Honda|Auto
NML|Nishat Mills|Textile
ILP|Interloop|Textile
GATM|Gul Ahmed Textile|Textile
KTML|Kohinoor Textile|Textile
SEARL|The Searle Company|Others
AGP|AGP Ltd|Others
GLAXO|GSK Pakistan|Others
ABOT|Abbott Pakistan|Others
NESTLE|Nestle Pakistan|Others
UNITY|Unity Foods|Others
EPCL|Engro Polymer|Others
LOTCHEM|Lotte Chemical|Others
ICI|ICI Pakistan|Others
ISL|International Steels|Others
MUGHAL|Mughal Iron|Others
PAEL|Pak Elektron|Others
PTC|Pakistan Telecom|Others`.split('\n').forEach(l=>{const[s,n,c]=l.split('|');STK[s]={n,c}});
const hue=s=>SECH[(STK[s]||{}).c]||140,icon=s=>`<i class="bg" style="--h:${hue(s)}">${s.slice(0,2)}</i>`;
function toC(j){const a=j.data.map(r=>({t:r[0]>1e12?r[0]:r[0]*1000,c:+r[1],v:+r[2],o:+r[3]})).filter(x=>x.c>0).sort((x,y)=>x.t-y.t);
  return a.map((x,i)=>{const o=x.o>0?x.o:(i?a[i-1].c:x.c);return{open:o,high:Math.max(o,x.c),low:Math.min(o,x.c),close:x.c,v:x.v,datetime:new Date(x.t).toISOString().replace('T',' ').slice(0,19)}})}
function size(e,sl,cap,rk){const r=e-sl,sh=Math.min(Math.floor(cap*rk/100/r),Math.floor(cap/e));return{sh,cost:sh*e,risk:sh*r}}
function vsurge(v){const a=v.slice(-21,-1).reduce((s,x)=>s+x.v,0)/20,l=v[v.length-1].v;return{avg:a,hot:a>0&&l>1.5*a}}
/*E*/
let E=null,mode='swing';
const MODE={swing:{k:1.8},pos:{k:2.6}};
async function loadEngine(){
  try{const t=await (await fetch('/smc-signal/index.html?'+Date.now())).text(),m=t.match(/\/\*P\*\/([\s\S]*?)\/\*E\*\//);if(!m)throw 0;
    E=new Function(m[1].replace('hr>=7&&hr<20','true').replace('.concat(bt(M,ids,P,Q,r1))','')+';return{TGT,STR,analyze}')();
    E.STR.filter(s=>s[0]!='ict').forEach(s=>$('chips').insertAdjacentHTML('beforeend',`<label><input type="checkbox" id="c_${s[0]}" checked> ${s[1]}</label>`));
  }catch(e){$('msg').textContent='Engine failed to load. The Ali FX index.html must exist in the smc-signal repo.'}
}
$('m_swing').onclick=()=>{mode='swing';$('m_swing').className='on';$('m_pos').className=''};
$('m_pos').onclick=()=>{mode='pos';$('m_pos').className='on';$('m_swing').className=''};
$('sec').add(new Option('All stocks ('+Object.keys(STK).length+')','ALL'));Object.keys(SECH).forEach(s=>$('sec').add(new Option(s)));
function paint(){const a=mtxt(new Date()),c=$('mk'),d=$('mk0');[c,d].forEach(x=>{x.textContent=a.t+(x==d?'':'');x.className='pill '+(a.o?'on':'off')})}
paint();setInterval(paint,30000);
(function(){let y=96,s='',x=6,sd=5;const r=()=>(sd=(sd*16807)%2147483647)/2147483647;
  for(let i=0;i<18;i++){const o=y,c=y+(r()-.62)*14;y=Math.min(108,Math.max(14,c));const up=c<o,h=Math.min(o,c)-r()*6,l=Math.max(o,c)+r()*6,col=up?'#19e08a':'#ff5470';
    s+=`<line x1="${x+4}" x2="${x+4}" y1="${h}" y2="${l}" stroke="${col}"/><rect x="${x}" y="${Math.min(o,c)}" width="8" height="${Math.abs(o-c)+1}" fill="${col}"/>`;x+=16}
  $('ch').innerHTML=s;
  $('ring').innerHTML=['OGDC','HBL','LUCK','ENGRO','PSO','HUBC','MEBL','SYS'].map((s,i)=>`<i class="bg" style="--h:${hue(s)};--a:${i*45}deg">${s.slice(0,4)}</i>`).join('')})();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const SRC=u=>[u,'https://api.allorigins.win/raw?url='+encodeURIComponent(u),'https://corsproxy.io/?'+encodeURIComponent(u)];
let SI=0;
async function pget(sym){const u='https://dps.psx.com.pk/timeseries/eod/'+sym;let er;
  for(let k=0;k<3;k++){const i=(SI+k)%3;try{const r=await fetch(SRC(u)[i]);if(!r.ok)throw Error('HTTP '+r.status);const j=await r.json();if(!j||!j.data||!j.data.length)throw Error('no data');SI=i;return j}catch(e){er=e}}throw er}
let busy=false;
$('go').onclick=async()=>{
  if(busy)return;if(!E){$('msg').textContent='Engine is still loading, try again in a moment.';return}
  const ids=E.STR.map(s=>s[0]).filter(id=>id!='ict'&&$('c_'+id).checked);if(!ids.length){$('msg').textContent='Select at least one strategy.';return}
  const cu=$('custom').value.trim(),sv=$('sec').value,list=cu?cu.toUpperCase().split(/[\s,]+/).filter(Boolean):Object.keys(STK).filter(s=>sv=='ALL'||STK[s].c==sv);
  const P=MODE[mode],t=E.TGT[$('tgt').value],Q=$('q').value,res=[],skip=[];let ok=0;
  busy=true;$('go').disabled=true;
  for(let q=0;q<list.length;q++){
    $('msg').textContent=`Scanning ${q+1}/${list.length}: ${list[q]}`;
    try{const v=toC(await pget(list[q]));if(v.length<150)throw 0;ok++;
      const vs=vsurge(v);if(vs.avg<50000)throw 0;
      const a=E.analyze(v,P,ids,Q,t);a.sigs.forEach(s=>res.push({...s,st:a.st,sym:list[q],hot:vs.hot,sc:s.sc+(vs.hot?1:0)}))}catch(e){skip.push(list[q])}
    if(q%6==5)show(res);await sleep(80);
  }
  show(res);busy=false;$('go').disabled=false;
  $('msg').textContent=ok?'Scan complete.'+(skip.length?' Skipped (no data or low volume): '+skip.slice(0,6).join(', ')+(skip.length>6?'...':''):''):'Could not load PSX data (the browser or network blocked it). Tell Claude and a GitHub Actions data fetcher can be set up.';
};
const gr=x=>x.sc>=5?'A+':x.sc>=4?'A':'B',f2=x=>x.toFixed(2);
function show(res){
  const only=$('prof').checked,cap=+$('cap').value||100000,rk=+$('rk').value||1,nm=Object.fromEntries(E.STR);
  const B=res.filter(x=>x.dir=='BUY').map(x=>({...x,ok:x.st.n>=15&&x.st.avg>0})).filter(x=>!only||x.ok).sort((a,b)=>b.sc-a.sc||b.st.avg-a.st.avg);
  const S=res.filter(x=>x.dir=='SELL');
  const buy=B.map(x=>{const z=size(x.e,x.sl,cap,rk),nmx=(STK[x.sym]||{}).n||x.sym;
    return`<div class="card sig"><div class="h"><b>${icon(x.sym)}<span>${x.sym}<span class="gd">${gr(x)}</span><small>${nmx}</small></span></b><span class="tg">BUY SPOT</span></div>
    <div class="note" style="color:var(--tx)">${x.f.map(i=>nm[i]).join(' + ')}${x.hot?' + Volume surge':''}</div>
    <div class="gr"><div>Entry<b>${f2(x.e)}</b></div><div>Stop Loss<b>${f2(x.sl)}</b></div><div>Target 1<b>${f2(x.tp1)}</b></div><div>Target 2<b>${f2(x.tp2)}</b></div></div>
    <div class="lv">Risk <b>-${((x.e-x.sl)/x.e*100).toFixed(1)}%</b> · T1 <b>+${((x.tp1-x.e)/x.e*100).toFixed(1)}%</b> · T2 <b>+${((x.tp2-x.e)/x.e*100).toFixed(1)}%</b><br>Buy <b>${z.sh.toLocaleString()}</b> shares (≈ PKR ${Math.round(z.cost).toLocaleString()}) · max loss PKR ${Math.round(z.risk).toLocaleString()}</div>
    <div class="note">Past accuracy: <span style="font-weight:800;color:var(--${x.ok?'ac':'rd'})">${(x.st.win*100).toFixed(0)}%</span> (${x.st.n} trades) · avg ${x.st.avg>=0?'+':''}${x.st.avg.toFixed(2)}R ${x.ok?'':'(weak)'}</div></div>`}).join('');
  const avoid=S.map(x=>`<div class="card sig s"><div class="h"><b>${icon(x.sym)}<span>${x.sym}<small>${(STK[x.sym]||{}).n||x.sym}</small></span></b><span class="tg s">AVOID / EXIT</span></div>
    <div class="note" style="color:var(--tx)">Bearish setup: ${x.f.map(i=>nm[i]).join(' + ')}</div>
    <div class="note">Price ${f2(x.e)} · downside target ${f2(x.tp1)} · setup fails above ${f2(x.sl)}. Do not buy; holders may tighten their stop.</div></div>`).join('');
  $('out').innerHTML=(buy||'<div class="card">No BUY setups right now. Scan again after the next close, or switch to Normal quality / turn off the profitable filter.</div>')+(avoid?'<div class="note" style="margin:6px 4px 8px"><b>Weak stocks to avoid</b></div>'+avoid:'');
  }
