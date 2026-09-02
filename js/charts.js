/* Vizualizace: chart(), cBars(), cMatice() a další grafové funkce */
/* ═════════════════════════════════════════════════════════════════════
   GRAFY — chart(spec) vrací HTML řetězec. Animace se spouští při
   scrollu přes .ch → třída .in (viz observer v aplikační logice).
   ═════════════════════════════════════════════════════════════════════ */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const num = n => String(n).replace('.',',');
const MESICE = ['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];
const MES_KR = ['led','úno','bře','dub','kvě','čvn','čvc','srp','zář','říj','lis','pro'];
const fmtM = s => { if(!s) return '—'; const [y,m]=s.split('-').map(Number); return MESICE[m-1]+' '+y; };
const mIdx = s => { const [y,m]=s.split('-').map(Number); return y*12+(m-1); };

/* kolečko s vnitřními paprsky, stejný prvek jako rozeta v pozadí */
function rozetaSVG(col){
  let g=`<circle cx="12" cy="12" r="10" fill="var(--surface)" stroke="${col}" stroke-width="2.2"/>`;
  for(let k=0;k<6;k++){ const a=k/6*Math.PI*2;
    g+=`<line x1="${(12+Math.cos(a)*3.2).toFixed(1)}" y1="${(12+Math.sin(a)*3.2).toFixed(1)}" x2="${(12+Math.cos(a)*9).toFixed(1)}" y2="${(12+Math.sin(a)*9).toFixed(1)}" stroke="${col}" stroke-width="1.5"/>`; }
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${g}</svg>`;
}
function chartHead(c){
  if(!c.title && !c.sub) return '';
  return `<div class="viz-h">${c.title?`<b>${esc(c.title)}</b>`:''}${c.sub?`<span>${esc(c.sub)}</span>`:''}</div>`;
}
function chartNote(c){ return c.note?`<p class="viz-note">${c.note}</p>`:''; }

/* ── obrázek / mapa jako výstup (rastr z analýzy) ─────────────────── */
function cObraz(c){
  const src=(typeof IMG!=='undefined' && IMG[c.src])?IMG[c.src]:c.src;
  return `<figure class="viz-fig"><img class="viz-img" src="${src}" alt="${esc(c.alt||c.title||'')}" loading="lazy"></figure>`;
}
function chart(c){
  const inner = ({bars:cBars,compare:cCompare,stack:cStack,dots:cDots,slope:cSlope,
                  donut:cDonut,grid:cGrid,flow:cFlow,network:cNetwork,
                  sled:cSled,matice:cMatice,obraz:cObraz}[c.k]||(()=>''))(c);
  return `<div class="viz"><div class="ch" data-ch>${chartHead(c)}${inner}${chartNote(c)}</div></div>`;
}

/* ── číslovaný sled (výčet variant, kroků, předpokladů) ──────────── */
function cSled(c){
  return `<div class="sled">${c.data.map((d,i)=>`
    <div class="sled-i">
      <span class="sled-n">${String(i+1).padStart(2,'0')}</span>
      <div><b>${esc(d.l)}</b>${d.t?`<p>${esc(d.t)}</p>`:''}</div>
    </div>`).join('')}</div>`;
}

/* ── směrová matice (kvalitativní intenzita, ne měřené hodnoty) ──── */
function cMatice(c){
  const lv=['','var(--c5)','var(--c3)','var(--c1)'];
  return `<div style="overflow-x:auto"><table class="ch-grid mat">
    <thead><tr><th>${esc(c.rowsLabel||'')}</th>${c.cols.map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead>
    <tbody>${c.rows.map((r,i)=>`<tr><td>${esc(r.l)}</td>${r.c.map((v,j)=>`<td>
      <span class="lvl">${[0,1,2,3].map(k=>`<i class="${k&&k<=v?'on':''}" style="background:${k&&k<=v?lv[v]:'var(--line-2)'};transition-delay:${(i*4+j)*30+k*40}ms"></i>`).join('')}</span>
    </td>`).join('')}</tr>`).join('')}</tbody></table></div>
  ${c.legenda?`<p class="viz-note">${c.legenda}</p>`:''}`;
}

/* ── vodorovné pruhy ──────────────────────────────────────────────── */
function cBars(c){
  const max = c.max || Math.max(...c.data.map(d=>d.v));
  const col = c.color || 'var(--signal)';
  return `<div class="ch-rows">${c.data.map((d,i)=>`
    <div class="ch-row${d.hi?' hi':''}">
      <div class="ch-lab">${esc(d.l)}${d.t?`<em>${esc(d.t)}</em>`:''}</div>
      <div class="ch-track"><div class="ch-fill" style="--w:${(d.v/max*100).toFixed(1)}%;background:${d.hi?'var(--ink)':col};transition-delay:${i*70}ms"></div></div>
      ${c.label===false?'<span></span>':`<div class="ch-val">${num(d.v)}${esc(c.unit||'')}</div>`}
    </div>`).join('')}</div>`;
}

/* ── porovnání dvou řad ───────────────────────────────────────────── */
function cCompare(c){
  const max = c.max || Math.max(...c.data.flatMap(d=>d.v));
  return `<div class="ch-legend">${c.series.map(s=>`<span><i style="background:${s.c}"></i>${esc(s.n)}</span>`).join('')}</div>
  <div class="ch-cmp">${c.data.map((d,i)=>`
    <div class="g">
      <div class="ch-lab">${esc(d.l)}</div>
      ${d.v.map((v,j)=>`<div class="ch-pair">
        <div class="ch-track" style="height:20px"><div class="ch-fill" style="--w:${(v/max*100).toFixed(1)}%;background:${c.series[j].c};transition-delay:${(i*2+j)*80}ms"></div></div>
        <div class="ch-val" style="font-size:14px">${num(v)}${esc(c.unit||'')}</div>
      </div>`).join('')}
    </div>`).join('')}</div>`;
}

/* ── stohovaný pruh ───────────────────────────────────────────────── */
function cStack(c){
  const tot = c.data.reduce((a,d)=>a+d.v,0);
  return `<div class="ch-stack">${c.data.map((d,i)=>`
      <div style="--w:${(d.v/tot*100).toFixed(2)}%;background:${d.c};transition-delay:${i*90}ms">
        ${d.v/tot>0.09?`<span>${num(d.v)} %</span>`:''}
      </div>`).join('')}</div>
    <div class="ch-legend" style="margin:20px 0 0">${c.data.map(d=>`<span><i style="background:${d.c}"></i>${esc(d.l)} · ${num(d.v)} %</span>`).join('')}</div>`;
}

/* ── lízátka ──────────────────────────────────────────────────────── */
function cDots(c){
  const max = c.max || Math.max(...c.data.map(d=>d.v))*1.12;
  return `<div class="ch-dots">${c.data.map((d,i)=>{
    const w = (d.v/max*100).toFixed(1)+'%';
    const col = d.hi?'var(--signal)':'var(--slate)';
    return `<div class="ch-dot-row">
      <div class="ch-lab" style="${d.hi?'color:var(--ink);font-weight:600':''}">${esc(d.l)}</div>
      <div class="ch-dot-track" style="--w:${w}">
        <div class="ch-dot-line" style="background:${col};transition-delay:${i*110}ms"></div>
        <div class="ch-dot-pt${d.hi?' big':''}" style="color:${col};transition-delay:${i*110}ms">${rozetaSVG(col)}</div>
        <div class="ch-dot-val" style="transition-delay:${i*110+300}ms">${num(d.v)}${esc(c.unit||'')}</div>
      </div></div>`;}).join('')}</div>`;
}

/* ── srovnávací spojnice ──────────────────────────────────────────── */
function cSlope(c){
  const W=760,H=48*c.data.length+70, xa=250, xb=610;
  const max = Math.max(...c.data.flatMap(d=>[d.a,d.b]))*1.05;
  const sx = v => xa + (v/max)*(xb-xa)*0;
  const rows = c.data.map((d,i)=>{
    const y = 54+i*48;
    const ax = xa + (d.a/max)*300, bx = xa + (d.b/max)*300;
    return `<g>
      <text x="0" y="${y+4}" class="ch-svg-name">${esc(d.l)}</text>
      <line x1="${xa}" y1="${y}" x2="${xa+300}" y2="${y}" stroke="var(--line-2)" stroke-width="2"/>
      <line class="dash" style="--len:300;transition-delay:${i*90}ms" x1="${Math.min(ax,bx)}" y1="${y}" x2="${Math.max(ax,bx)}" y2="${y}" stroke="${'var(--line)'}" stroke-width="6" stroke-linecap="round"/>
      <circle class="pop" style="transition-delay:${i*90+200}ms" cx="${bx}" cy="${y}" r="7" fill="var(--surface)" stroke="var(--slate)" stroke-width="3"/>
      <circle class="pop" style="transition-delay:${i*90+300}ms" cx="${ax}" cy="${y}" r="8" fill="var(--signal)"/>
      <text x="${xa+320}" y="${y+5}" class="ch-svg-val">${num(d.a)}${esc(c.unit||'')}</text>
    </g>`;}).join('');
  return `<div class="ch-legend"><span><i style="background:var(--signal)"></i>${esc(c.aLab)}</span><span><i style="background:var(--slate);border-radius:50%"></i>${esc(c.bLab)}</span></div>
   <svg viewBox="0 0 ${W} ${H}" role="img">${rows}</svg>`;
}

/* ── prstenec ─────────────────────────────────────────────────────── */
function cDonut(c){
  const tot=c.data.reduce((a,d)=>a+d.v,0), R=76, C=2*Math.PI*R;
  let acc=0;
  const arcs=c.data.map((d,i)=>{
    const len=d.v/tot*C, off=acc; acc+=len;
    return `<circle class="ch-arc" style="--c:${C.toFixed(2)};--da:${len.toFixed(2)} ${(C-len).toFixed(2)};transition-delay:${i*130}ms"
      cx="110" cy="110" r="${R}" fill="none" stroke="${d.c}" stroke-width="30" stroke-linecap="butt"
      transform="rotate(${(off/C*360-90).toFixed(2)} 110 110)"/>`;
  }).join('');
  const lead=c.data[0];
  let spokes='';
  for(let k=0;k<24;k++){ const a=k/24*Math.PI*2;
    spokes+=`<line x1="${(110+Math.cos(a)*61).toFixed(1)}" y1="${(110+Math.sin(a)*61).toFixed(1)}" x2="${(110+Math.cos(a)*91).toFixed(1)}" y2="${(110+Math.sin(a)*91).toFixed(1)}" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>`; }
  return `<div style="display:flex;gap:44px;align-items:center;flex-wrap:wrap">
    <svg viewBox="0 0 220 220" style="width:220px;flex:none" role="img">${arcs}${spokes}
      <text x="110" y="104" text-anchor="middle" class="ch-svg-val" style="font-size:34px">${num(lead.v)} %</text>
      <text x="110" y="128" text-anchor="middle" class="ch-svg-lab">${esc(lead.l.slice(0,22))}</text>
    </svg>
    <div class="ch-legend" style="flex-direction:column;gap:12px;margin:0;align-items:flex-start">
      ${c.data.map(d=>`<span><i style="background:${d.c}"></i>${esc(d.l)} <b class="mono">${num(d.v)} %</b></span>`).join('')}
    </div></div>`;
}

/* ── matice ───────────────────────────────────────────────────────── */
function cGrid(c){
  return `<div style="overflow-x:auto"><table class="ch-grid">
    <thead><tr><th></th>${c.cols.map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead>
    <tbody>${c.rows.map((r,i)=>`<tr class="${r.hi?'hi':''}"><td>${esc(r.l)}</td>${
      r.c.map((v,j)=>`<td><i class="cell${v?' y':''}" style="transition-delay:${(i*4+j)*28}ms"></i></td>`).join('')
    }</tr>`).join('')}</tbody></table></div>`;
}

/* ── tok ──────────────────────────────────────────────────────────── */
function cFlow(c){
  const W=900,H=340;
  const px = n => n.x/100*W, py = n => n.y/100*H;
  const N = Object.fromEntries(c.nodes.map(n=>[n.id,n]));
  const links = c.links.map((l,i)=>{
    const a=N[l[0]], b=N[l[1]], w=l[2]||6;
    const x1=px(a)+56, y1=py(a), x2=px(b)-56, y2=py(b), mx=(x1+x2)/2;
    const d=`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
    return `<path class="dash" style="--len:600;transition-delay:${i*140}ms" d="${d}" fill="none"
      stroke="${b.c}" stroke-opacity=".35" stroke-width="${w*1.6}" stroke-linecap="round"/>`;
  }).join('');
  const nodes = c.nodes.map((n,i)=>{
    const w=Math.max(112, n.l.length*7.2), x=px(n), y=py(n);
    return `<g class="pop" style="transition-delay:${i*90}ms">
      <rect x="${(x-w/2-6).toFixed(1)}" y="${y-29}" width="${(w+12).toFixed(1)}" height="5" fill="${n.c}" opacity=".55"/>
      <rect x="${x-w/2}" y="${y-22}" width="${w}" height="44" fill="${n.c}"/>
      <rect x="${(x-w/2-6).toFixed(1)}" y="${y+24}" width="${(w+12).toFixed(1)}" height="4" fill="${n.c}" opacity=".35"/>
      <text x="${x}" y="${y}" class="nd-lab">${esc(n.l)}</text></g>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img"><g>${links}</g><g>${nodes}</g></svg>`;
}

/* ── síť ──────────────────────────────────────────────────────────── */
function cNetwork(c){
  const W=880,H=460;
  const px=n=>n.x/100*W, py=n=>n.y/100*H;
  const N=Object.fromEntries(c.nodes.map(n=>[n.id,n]));
  const links=c.links.map((l,i)=>{
    const a=N[l[0]],b=N[l[1]];
    return `<line class="dash" style="--len:520;transition-delay:${i*90}ms" x1="${px(a)}" y1="${py(a)}" x2="${px(b)}" y2="${py(b)}"
      stroke="var(--line)" stroke-width="2"/>`;}).join('');
  const nodes=c.nodes.map((n,i)=>{
    const words=n.l.split(' ');
    let lines=[],cur='';
    words.forEach(w=>{ if((cur+' '+w).trim().length>14){lines.push(cur.trim());cur=w;} else cur+=' '+w; });
    lines.push(cur.trim());
    const isC=(n.r||30)>40;
    return `<g class="pop" style="transition-delay:${i*110+200}ms">
      <circle cx="${px(n)}" cy="${py(n)}" r="${n.r||30}" fill="${n.c}" fill-opacity="${isC?1:.14}" stroke="${n.c}" stroke-width="2"/>
      ${Array.from({length:12},(_,k)=>{const a=k/12*Math.PI*2,r0=(n.r||30);
        return `<line x1="${(px(n)+Math.cos(a)*r0*0.80).toFixed(1)}" y1="${(py(n)+Math.sin(a)*r0*0.80).toFixed(1)}" x2="${(px(n)+Math.cos(a)*r0).toFixed(1)}" y2="${(py(n)+Math.sin(a)*r0).toFixed(1)}" stroke="${isC?'#fff':n.c}" stroke-opacity="${isC?.45:.5}" stroke-width="1.2"/>`;}).join('')}
      ${lines.map((t,k)=>`<text x="${px(n)}" y="${py(n)+(k-(lines.length-1)/2)*14}" class="${isC?'nd-lab':'nd-out'}" dominant-baseline="middle">${esc(t)}</text>`).join('')}
    </g>`;}).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img"><g>${links}</g><g>${nodes}</g></svg>`;
}