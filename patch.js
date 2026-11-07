pget=async function(sym){
  if(!window.DB){
    let er;
    for(const u of ['https://raw.githubusercontent.com/akm786khi-sys/Ali-PSX/main/data.json','data.json']){
      try{const r=await fetch(u+'?t='+Date.now());if(!r.ok)throw Error('HTTP '+r.status);window.DB=await r.json();break}catch(e){er=e}
    }
    if(!window.DB)throw er;
    const n=document.createElement('div');n.className='note';n.style.marginTop='8px';
    n.textContent='PSX data updated: '+new Date(window.DB.t).toLocaleString();
    $('mk').parentNode.appendChild(n);
  }
  const d=window.DB.d[sym];if(!d||!d.length)throw Error('no data for '+sym);
  return{data:d};
};
