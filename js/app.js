/* Hlavní aplikační logika: routing, renderování stránek, interaktivní mapa */
/* ═════════════════════════════════════════════════════════════════════
   APLIKACE
   ═════════════════════════════════════════════════════════════════════ */
const main = $('#obsah');
const riaOf = p => RIA_TYP[p.ria===null?'null':p.ria];
const prekOn = { v:false };
const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

const IC = {
  chev:'<svg class="chev" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 8.4 6 12l7.5-8" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg>',
  lock:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="10.5" width="16" height="11" stroke="currentColor" stroke-width="1.8"/><path d="M7.6 10.5V7.4a4.4 4.4 0 0 1 8.8 0v3.1" stroke="currentColor" stroke-width="1.8"/><rect x="11" y="14.4" width="2" height="3.6" fill="currentColor"/></svg>',
  close:'<svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/></svg>',
  grid:'<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="1" y="1" width="6" height="6"/><rect x="9" y="1" width="6" height="6"/><rect x="1" y="9" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/></svg>',
  list:'<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="1" y="2" width="14" height="3"/><rect x="1" y="6.5" width="14" height="3"/><rect x="1" y="11" width="14" height="3"/></svg>',
  arr:'<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9M8.5 4 12.5 8l-4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  dl:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 5.2h7.2l1.6 2.4H22V20H2V5.2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="miter"/><path d="M12 9.4v4.9" stroke="currentColor" stroke-width="2"/><path d="M8.6 12.2 12 15.6l3.4-3.4" stroke="currentColor" stroke-width="2" stroke-linejoin="miter"/><path d="M8.2 16.9h7.6" stroke="currentColor" stroke-width="2"/></svg>',
  back:'<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 8H4M7.5 3.5 3.5 8l4 4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

/* ── ilustrační motiv karty (odvozený z oblasti projektu) ─────────── */
/* ── motiv karty: původní vizualizace; sloupcové grafy jako sloupoví ─ */
const MOTIV = {
  'Exekuce a insolvence':'pilire','Oběti trestných činů':'radial','Mediace':'oblouk',
  'Znalci a tlumočníci':'kazety','Justice a soudy':'kolonada','Trestní politika':'krivka',
  'Rovnost a vzdělávání':'sklon','Oběti a pachatelé':'radial'
};
/* jeden architektonický sloup: patka – dřík s kanelurou – hlavice */
function sloup(x,w,h,base,c,op){
  const y=base-h, cap=Math.max(5,w*0.42), plin=Math.max(4,w*0.34);
  let g=`<rect x="${(x-w*0.16).toFixed(1)}" y="${(y+cap).toFixed(1)}" width="${(w*1.32).toFixed(1)}" height="${(h-cap-plin).toFixed(1)}" fill="${c}" opacity="${(op*0.62).toFixed(2)}"/>`;
  g+=`<rect x="${x.toFixed(1)}" y="${(y+cap).toFixed(1)}" width="${w.toFixed(1)}" height="${(h-cap-plin).toFixed(1)}" fill="${c}" opacity="${op.toFixed(2)}"/>`;
  for(let k=1;k<3;k++) g+=`<line x1="${(x+w*k/3).toFixed(1)}" y1="${(y+cap+2).toFixed(1)}" x2="${(x+w*k/3).toFixed(1)}" y2="${(base-plin-2).toFixed(1)}" stroke="#fff" stroke-opacity=".45" stroke-width="1"/>`;
  g+=`<rect x="${(x-w*0.22).toFixed(1)}" y="${(y+cap*0.72).toFixed(1)}" width="${(w*1.44).toFixed(1)}" height="${(cap*0.32).toFixed(1)}" fill="${c}" opacity="${Math.min(1,op*1.12).toFixed(2)}"/>`;
  g+=`<rect x="${(x-w*0.38).toFixed(1)}" y="${(y+cap*0.38).toFixed(1)}" width="${(w*1.76).toFixed(1)}" height="${(cap*0.36).toFixed(1)}" fill="${c}" opacity="${Math.min(1,op*1.28).toFixed(2)}"/>`;
  g+=`<rect x="${(x-w*0.50).toFixed(1)}" y="${y.toFixed(1)}" width="${(w*2.00).toFixed(1)}" height="${(cap*0.38).toFixed(1)}" fill="${c}" opacity="${Math.min(1,op*1.45).toFixed(2)}"/>`;
  g+=`<rect x="${(x-w*0.36).toFixed(1)}" y="${(base-plin).toFixed(1)}" width="${(w*1.72).toFixed(1)}" height="${plin.toFixed(1)}" fill="${c}" opacity="${Math.min(1,op*1.3).toFixed(2)}"/>`;
  return g;
}
/* kolečko s vnitřními paprsky — stejný prvek jako rozeta v pozadí webu */
function rozeta(x,y,r,c,op){
  let g=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#fff" stroke="${c}" stroke-width="1.6" opacity="${Math.min(1,op+0.25).toFixed(2)}"/>`;
  for(let k=0;k<6;k++){ const a=k/6*Math.PI*2;
    g+=`<line x1="${(x+Math.cos(a)*r*0.28).toFixed(1)}" y1="${(y+Math.sin(a)*r*0.28).toFixed(1)}" x2="${(x+Math.cos(a)*r*0.86).toFixed(1)}" y2="${(y+Math.sin(a)*r*0.86).toFixed(1)}" stroke="${c}" stroke-width="1.1" opacity="${Math.min(1,op+0.15).toFixed(2)}"/>`; }
  return g;
}
function art(p){
  const c=riaOf(p).bar, t=MOTIV[p.oblast]||'kazety', seed=p.cislo*37;
  const rnd=n=>{const x=Math.sin(seed+n*12.9898)*43758.5453; return x-Math.floor(x);};
  const W=248,H=120; let g='';
  if(t==='pilire'){                      // sloupcový graf jako sloupoví
    const n=7,base=108,w=9.5,gap=W/(n+0.6);
    for(let i=0;i<n;i++) g+=sloup(gap*(i+0.42)+(gap*0.40-w)/2,w,26+rnd(i)*62,base,c,0.24+i*0.045);
    g+=`<rect x="0" y="109" width="${W}" height="4" fill="${c}" opacity=".4"/>`;
  } else if(t==='kolonada'){             // sloupoví s architrávem
    const n=9,base=104,w=9.5,gap=W/(n+0.5);
    for(let i=0;i<n;i++) g+=sloup(gap*(i+0.4),w,34+rnd(i)*62,base,c,0.22+rnd(i+3)*0.28);
    g+=`<rect x="0" y="105" width="${W}" height="3.5" fill="${c}" opacity=".42"/>`;
    g+=`<rect x="0" y="112" width="${W}" height="1.5" fill="${c}" opacity=".28"/>`;
  } else if(t==='radial'){
    g=Array.from({length:22},(_,i)=>{const a=i/22*Math.PI*2,r=22+rnd(i)*40;
      return `<circle cx="${(120+Math.cos(a)*r*1.7).toFixed(1)}" cy="${(62+Math.sin(a)*r).toFixed(1)}" r="${(2+rnd(i+9)*5).toFixed(1)}" fill="${c}" opacity="${(.2+rnd(i)*.6).toFixed(2)}"/>`;}).join('');
  } else if(t==='oblouk'){
    g=`<path d="M6 96 C70 96 70 30 120 30 C170 30 170 96 234 96" stroke="${c}" stroke-width="3" fill="none" opacity=".5"/>`
      +Array.from({length:9},(_,i)=>`<circle cx="${14+i*26}" cy="${(96-Math.sin(i/8*Math.PI)*62).toFixed(1)}" r="5" fill="${c}" opacity="${(.3+i*.06).toFixed(2)}"/>`).join('');
  } else if(t==='kazety'){
    g=Array.from({length:36},(_,i)=>`<rect x="${20+(i%9)*24}" y="${26+Math.floor(i/9)*22}" width="13" height="13" rx="3.5" fill="${c}" opacity="${(.12+rnd(i)*.7).toFixed(2)}"/>`).join('');
  } else if(t==='krivka'){
    const pts=[[8,100],[60,74],[104,84],[150,40],[196,52],[240,20]];
    g=`<polyline points="${pts.map(q=>q.join(',')).join(' ')}" stroke="${c}" stroke-width="3" fill="none" opacity=".55"/>`
      +pts.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i===5?7:5}" fill="${c}" opacity="${(.35+i*.11).toFixed(2)}"/>`).join('');
  } else {
    g=Array.from({length:6},(_,i)=>`<line x1="26" y1="${26+i*14}" x2="222" y2="${96-i*13}" stroke="${c}" stroke-width="2.5" opacity="${(.14+i*.13).toFixed(2)}" stroke-linecap="butt"/>`).join('');
  }
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${g}</svg>`;
}

/* ── POZADÍ STRÁNKY: novorenesanční geometrie ─────────────────────
   Každý motiv leží v jiné rovině a posouvá se jiným tempem.       */
/* Generuje animované pozadí na canvasu — architektonické motivy */
function bgArch(){
  const cv=document.getElementById('bgArch'); if(!cv||!cv.getContext) return;
  const ctx=cv.getContext('2d'); if(!ctx) return;
  let W,H,raf,last=0;
  let syCil=0, syPlynule=0;
  const S=(a)=>`rgba(88,118,168,${a})`;      // šedomodrá
  const V=(a)=>`rgba(124,92,245,${a})`;      // světle fialová
  const B=(a)=>`rgba(43,108,240,${a})`;      // modrá
  const size=()=>{ const r=Math.min(window.devicePixelRatio||1,1.5);
    W=cv.clientWidth; H=cv.clientHeight; cv.width=W*r; cv.height=H*r; ctx.setTransform(r,0,0,r,0,0); };

  /* sv. Bartoloměj v abstrakci: hlava, svatozář, plášť */
  function socha(x,y,h,puls){
    const w=h*0.30;
    ctx.save(); ctx.translate(x,y+puls*1.2);
    ctx.strokeStyle=S(.07); ctx.lineWidth=1;                     // hranolová nika
    ctx.strokeRect(-w*0.95,-h*1.02,w*1.90,h*1.02);
    ctx.strokeRect(-w*0.80,-h*0.94,w*1.60,h*0.90);
    ctx.fillStyle=S(.055);
    ctx.fillRect(-w*1.08,-h*1.10,w*2.16,h*0.05);
    const hy=-h*0.80, hr=w*0.19+puls*0.5;
    ctx.strokeStyle=S(.115); ctx.beginPath();                    // svatozář
    ctx.arc(0,hy,hr*1.95,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle=V(.058);                                       // plášť
    ctx.beginPath();
    ctx.moveTo(-w*0.32,-h*0.60); ctx.lineTo(w*0.32,-h*0.60);
    ctx.lineTo(w*0.64,0); ctx.lineTo(-w*0.58,0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle=S(.095); ctx.beginPath();                    // rovné záhyby
    for(let i=-2;i<=2;i++){ const t=i/2.4;
      ctx.moveTo(w*0.30*t,-h*0.58); ctx.lineTo(w*0.54*t+w*0.03,-h*0.02); }
    ctx.stroke();
    ctx.fillStyle=B(.065);                                       // ramena
    ctx.beginPath();
    ctx.moveTo(-w*0.40,-h*0.60); ctx.lineTo(-w*0.17,-h*0.715);
    ctx.lineTo(w*0.17,-h*0.715); ctx.lineTo(w*0.40,-h*0.60); ctx.closePath(); ctx.fill();
    ctx.strokeStyle=S(.13); ctx.beginPath();                     // hlava
    for(let k=0;k<6;k++){ const a2=k/6*Math.PI*2-Math.PI/2;
      const px=Math.cos(a2)*hr, py=hy+Math.sin(a2)*hr;
      k?ctx.lineTo(px,py):ctx.moveTo(px,py); }
    ctx.closePath(); ctx.stroke();
    ctx.fillStyle=S(.058); ctx.fillRect(-w*0.74,0,w*1.48,h*0.06);
    ctx.restore();
  }

  /* edikula s frontonem a hladkým polem */
  function edikula(x,y,h,ph){
    const w=h*0.62;
    ctx.save(); ctx.translate(x,y+Math.sin(ph)*3);
    ctx.fillStyle=V(.030); ctx.fillRect(-w/2,-h,w,h);
    ctx.strokeStyle=S(.115); ctx.lineWidth=1.4;
    ctx.strokeRect(-w/2,-h,w,h);
    ctx.strokeRect(-w/2+w*0.10,-h+h*0.08,w*0.80,h*0.84);
    ctx.beginPath();
    ctx.moveTo(-w*0.56,-h); ctx.lineTo(0,-h-h*0.16); ctx.lineTo(w*0.56,-h);
    ctx.closePath(); ctx.stroke();
    ctx.strokeStyle=S(.075); ctx.beginPath();
    ctx.moveTo(-w*0.50,-h*1.06); ctx.lineTo(w*0.50,-h*1.06); ctx.stroke();
    const by=-h*0.30, bh=h*0.44;
    ctx.strokeStyle=S(.115);
    ctx.strokeRect(-w*0.42,by-bh,w*0.84,bh);
    ctx.beginPath();
    ctx.moveTo(-w*0.50,by-bh*1.10); ctx.lineTo(w*0.50,by-bh*1.10);
    ctx.moveTo(-w*0.50,by-bh*1.16); ctx.lineTo(w*0.50,by-bh*1.16); ctx.stroke();
    ctx.strokeStyle=S(.080);                                     // kazetové pole
    const k=w*0.155;
    for(let r=0;r<2;r++) for(let cI=0;cI<4;cI++){
      const kx=-w*0.34+cI*k*1.12, ky=-h*0.86+r*k*1.12;
      ctx.strokeRect(kx,ky,k,k); ctx.strokeRect(kx+k*0.26,ky+k*0.26,k*0.48,k*0.48);
    }
    ctx.fillStyle=B(.10);                                        // balustráda
    for(let i=0;i<7;i++){
      const bx=-w*0.44+i*(w*0.88/6);
      ctx.fillRect(bx-2.4,-h*0.10,4.8,h*0.10);
      ctx.beginPath(); ctx.arc(bx,-h*0.12,3.0+(i%3===0?Math.sin(ph)*0.8:0),0,7); ctx.fill();
    }
    ctx.fillStyle=S(.085); ctx.fillRect(-w*0.56,0,w*1.12,h*0.05);
    ctx.restore();
  }

  /* levý prvek: hranolová stěna s triglyfovým vlysem */
  function stenaL(x,y,h,ph){
    const w=h*0.40;
    ctx.save(); ctx.translate(x,y+Math.sin(ph)*2.5);
    ctx.fillStyle=V(.028); ctx.fillRect(-w/2,-h,w,h);
    ctx.strokeStyle=S(.105); ctx.lineWidth=1.3;
    ctx.strokeRect(-w/2,-h,w,h);
    ctx.fillStyle=S(.075);
    ctx.fillRect(-w*0.60,-h*1.04,w*1.20,h*0.035);
    for(let i=0;i<5;i++){
      const bx=-w*0.46+i*(w*0.92/4);
      ctx.fillRect(bx-w*0.045,-h*1.00,w*0.09,h*0.045);
      ctx.strokeStyle=S(.05);
      ctx.beginPath();
      ctx.moveTo(bx-w*0.015,-h*0.995); ctx.lineTo(bx-w*0.015,-h*0.958);
      ctx.moveTo(bx+w*0.015,-h*0.995); ctx.lineTo(bx+w*0.015,-h*0.958);
      ctx.stroke();
    }
    ctx.strokeStyle=S(.10);
    for(let j=0;j<2;j++){
      const py=-h*(0.86-j*0.34), ph2=h*0.26;
      ctx.strokeRect(-w*0.34,py,w*0.68,ph2);
      ctx.fillStyle=B(.035); ctx.fillRect(-w*0.24,py+ph2*0.18,w*0.48,ph2*0.64);
      ctx.strokeRect(-w*0.24,py+ph2*0.18,w*0.48,ph2*0.64);
    }
    ctx.strokeStyle=S(.09);
    for(let j=0;j<2;j++){
      const py=-h*(0.14+j*0.14);
      ctx.strokeRect(-w*0.30,py-h*0.10,w*0.60,h*0.10);
    }
    ctx.fillStyle=S(.085);
    ctx.fillRect(-w*0.70,-h*1.09,w*1.40,h*0.045);
    ctx.fillRect(-w*0.62,0,w*1.24,h*0.05);
    ctx.restore();
  }

  /* pravý prvek: attika s balustrádou a lizénami */
  function stenaP(x,y,h,ph){
    const w=h*0.46;
    ctx.save(); ctx.translate(x,y+Math.sin(ph+1.1)*2.5);
    ctx.fillStyle=V(.024); ctx.fillRect(-w/2,-h*0.86,w,h*0.86);
    ctx.strokeStyle=S(.10); ctx.lineWidth=1.3;
    ctx.strokeRect(-w/2,-h*0.86,w,h*0.86);
    ctx.strokeStyle=S(.065);
    for(let i=1;i<4;i++){
      ctx.beginPath();
      ctx.moveTo(-w/2+i*w/4,-h*0.86); ctx.lineTo(-w/2+i*w/4,0); ctx.stroke();
    }
    ctx.strokeStyle=S(.10);
    for(let i=0;i<2;i++){
      const px=-w*0.30+i*w*0.36;
      ctx.strokeRect(px-w*0.14,-h*0.68,w*0.28,h*0.28);
      ctx.strokeRect(px-w*0.08,-h*0.62,w*0.16,h*0.16);
    }
    ctx.fillStyle=S(.08);
    ctx.fillRect(-w*0.62,-h*0.92,w*1.24,h*0.04);
    ctx.fillRect(-w*0.56,-h*1.06,w*1.12,h*0.035);
    ctx.fillStyle=B(.085);
    for(let i=0;i<8;i++){
      const bx=-w*0.50+i*(w*1.00/7);
      ctx.fillRect(bx-w*0.020,-h*1.03,w*0.040,h*0.11);
    }
    ctx.fillStyle=S(.085);
    ctx.fillRect(-w*0.60,0,w*1.20,h*0.04);
    ctx.fillRect(-w*0.70,h*0.04,w*1.40,h*0.035);
    ctx.restore();
  }

  function kazetovyStrop(x,y,w,h,ph){
    ctx.save(); ctx.translate(x,y);
    const c=4, r=3, kw=w/c, kh=h/r;
    for(let i=0;i<c;i++) for(let j=0;j<r;j++){
      const o=0.05+0.035*Math.sin(ph+i*0.6+j*0.9);
      ctx.strokeStyle=S(o); ctx.lineWidth=1.2;
      ctx.strokeRect(i*kw,j*kh,kw*0.9,kh*0.9);
      ctx.strokeRect(i*kw+kw*0.22,j*kh+kh*0.22,kw*0.46,kh*0.46);
      ctx.fillStyle=B(o*0.5);
      ctx.fillRect(i*kw+kw*0.38,j*kh+kh*0.38,kw*0.14,kh*0.14);
    }
    ctx.restore();
  }

  function serliana(x,y,w,ph){
    const h=w*0.62;
    ctx.save(); ctx.translate(x,y); ctx.scale(1,1+Math.sin(ph)*0.02);
    ctx.strokeStyle=S(.095); ctx.lineWidth=1.3;
    ctx.beginPath();
    ctx.moveTo(-w/2,0); ctx.lineTo(-w/2,-h*0.62);
    ctx.moveTo(-w*0.18,0); ctx.lineTo(-w*0.18,-h*0.62);
    ctx.arc(0,-h*0.62,w*0.18,Math.PI,0);
    ctx.moveTo(w*0.18,-h*0.62); ctx.lineTo(w*0.18,0);
    ctx.moveTo(w/2,-h*0.62); ctx.lineTo(w/2,0);
    ctx.stroke();
    ctx.fillStyle=V(.035);
    ctx.fillRect(-w/2,-h*0.62,w*0.32,h*0.62);
    ctx.fillRect(w*0.18,-h*0.62,w*0.32,h*0.62);
    ctx.strokeStyle=S(.06);
    ctx.beginPath(); ctx.moveTo(-w*0.60,-h*0.70); ctx.lineTo(w*0.60,-h*0.70);
    ctx.moveTo(-w*0.60,-h*0.76); ctx.lineTo(w*0.60,-h*0.76); ctx.stroke();
    ctx.restore();
  }

  function bosaz(x,y,w,h,ph){
    ctx.save(); ctx.translate(x,y);
    const c=3, r=4, kw=w/c, kh=h/r;
    for(let i=0;i<c;i++) for(let j=0;j<r;j++){
      const o=0.055+0.03*Math.sin(ph+i*0.8+j*0.5);
      const cx0=i*kw+kw/2, cy0=j*kh+kh/2, dx=kw*0.42, dy=kh*0.42;
      ctx.strokeStyle=S(o); ctx.lineWidth=1.2;
      ctx.beginPath();
      ctx.moveTo(cx0,cy0-dy); ctx.lineTo(cx0+dx,cy0); ctx.lineTo(cx0,cy0+dy);
      ctx.lineTo(cx0-dx,cy0); ctx.closePath(); ctx.stroke();
      ctx.fillStyle=B(o*0.45); ctx.fill();
    }
    ctx.restore();
  }

  function kartus(x,y,r,ph){
    ctx.save(); ctx.translate(x,y); ctx.rotate(ph*0.05);
    ctx.strokeStyle=S(.085); ctx.lineWidth=1.2;
    ctx.beginPath();
    ctx.moveTo(0,-r); ctx.lineTo(r*0.72,-r*0.42); ctx.lineTo(r*0.72,r*0.42);
    ctx.lineTo(0,r); ctx.lineTo(-r*0.72,r*0.42); ctx.lineTo(-r*0.72,-r*0.42);
    ctx.closePath(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0,-r*0.62); ctx.lineTo(r*0.44,-r*0.26); ctx.lineTo(r*0.44,r*0.26);
    ctx.lineTo(0,r*0.62); ctx.lineTo(-r*0.44,r*0.26); ctx.lineTo(-r*0.44,-r*0.26);
    ctx.closePath(); ctx.strokeStyle=V(.06); ctx.stroke();
    ctx.restore();
  }

  function rozeta(x,y,r,ph){
    ctx.strokeStyle=S(.075); ctx.lineWidth=1.1;
    ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y,r*0.34,0,7); ctx.stroke();
    ctx.beginPath();
    for(let k=0;k<12;k++){ const a2=ph*0.5+k/12*Math.PI*2;
      ctx.moveTo(x+Math.cos(a2)*r*0.36,y+Math.sin(a2)*r*0.36);
      ctx.lineTo(x+Math.cos(a2)*r,y+Math.sin(a2)*r); }
    ctx.strokeStyle=V(.07); ctx.stroke();
  }

  /* dva statické šedé sloupy u obou okrajů */
  function nosneSloupy(){
    const cw=Math.max(26,Math.min(46,W*0.030));
    [[-cw*0.34],[W-cw*0.66]].forEach(([x])=>{
      ctx.fillStyle='rgba(108,124,148,.075)';
      ctx.fillRect(x,0,cw,H);
      ctx.fillStyle='rgba(108,124,148,.10)';
      ctx.fillRect(x-cw*0.20,0,cw*1.40,10);
      ctx.fillRect(x-cw*0.34,10,cw*1.68,7);
      ctx.fillRect(x-cw*0.20,H-14,cw*1.40,14);
      ctx.fillRect(x-cw*0.34,H-22,cw*1.68,8);
      ctx.strokeStyle='rgba(108,124,148,.06)'; ctx.lineWidth=1;
      ctx.beginPath();
      for(let k=1;k<4;k++){ ctx.moveTo(x+cw*k/4,22); ctx.lineTo(x+cw*k/4,H-26); }
      ctx.stroke();
    });
  }

  function draw(t){
    ctx.clearRect(0,0,W,H);
    const s=t/1000, P=k=>-syPlynule*k;
    // kazetová síť
    ctx.strokeStyle=S(.062); ctx.lineWidth=1;
    const G=112, gy=((P(0.04)%G)+G)%G; ctx.beginPath();
    for(let x=(W%G)/2;x<W;x+=G){ ctx.moveTo(x,0); ctx.lineTo(x,H); }
    for(let y=gy-G;y<H;y+=G){ ctx.moveTo(0,y); ctx.lineTo(W,y); }
    ctx.stroke();
    // kordonová římsa s dentikuly
    const cy=H*0.30+P(0.10);
    ctx.strokeStyle=S(.075); ctx.beginPath();
    ctx.moveTo(0,cy); ctx.lineTo(W,cy); ctx.moveTo(0,cy+7); ctx.lineTo(W,cy+7); ctx.stroke();
    ctx.fillStyle=S(.058);
    for(let x=(W%26)/2;x<W;x+=26) ctx.fillRect(x,cy+9,11,7);

    nosneSloupy();

    const sh=Math.min(H*0.42,380);
    stenaL(W*0.085,H*1.02+P(0.16),sh*0.86,s*0.42);
    edikula(W*0.275,H*0.94+P(0.24),sh*0.86,s*0.5);
    socha(W*0.725,H*1.02+P(0.11),sh*0.94,Math.sin(s*0.5)*1.4);
    stenaP(W*0.915,H*0.80+P(0.31),sh*0.86,s*0.42);
    kazetovyStrop(W*0.045,H*0.24+P(0.39),Math.min(150,W*0.12),Math.min(130,H*0.14),s*0.4);
    bosaz(W*0.885,H*0.16+P(0.36),Math.min(100,W*0.085),Math.min(150,H*0.17),s*0.45+1.6);
    serliana(W*0.50,H*1.12+P(0.27),Math.min(230,W*0.19),s*0.36);
    kartus(W*0.135,H*0.60+P(0.46),Math.min(40,W*0.032),s);
    kartus(W*0.865,H*0.56+P(0.19),Math.min(40,W*0.032),s+1.7);
    rozeta(W*0.5,H*0.14+P(0.52),Math.min(W,H)*0.050,s);

    // datové souhvězdí
    const N=11,R=Math.min(W,H)*0.19,ccx=W*0.5,ccy=H*0.46+P(0.28),rt=s*0.045, pts=[];
    for(let i=0;i<N;i++){ const a2=rt+i/N*Math.PI*2;
      pts.push([ccx+Math.cos(a2)*R*(0.72+0.28*Math.sin(i*2.1)),
                ccy+Math.sin(a2)*R*(0.72+0.28*Math.cos(i*1.7))]); }
    ctx.strokeStyle=V(.07); ctx.lineWidth=1; ctx.beginPath();
    for(let i=0;i<N;i++) for(let j=i+1;j<N;j+=3){ ctx.moveTo(pts[i][0],pts[i][1]); ctx.lineTo(pts[j][0],pts[j][1]); }
    ctx.stroke();
    ctx.fillStyle=B(.115);
    pts.forEach(q=>ctx.fillRect(q[0]-2.5,q[1]-2.5,5,5));
  }

  /* scroll se dohání postupně, aby byl pohyb plynulý */
  const ctiScroll=()=>{ syCil = window.scrollY || window.pageYOffset || 0; };
  ctiScroll(); syPlynule = syCil;
  window.addEventListener('scroll', ctiScroll, {passive:true});
  function loop(t){
    const d = syCil - syPlynule;
    if(Math.abs(d) > 0.25){ syPlynule += d*0.16; draw(t); last=t; }
    else if(t-last > 45){ syPlynule = syCil; draw(t); last=t; }
    raf=requestAnimationFrame(loop);
  }
  size(); draw(0);
  if(!RM) raf=requestAnimationFrame(loop);
  else window.addEventListener('scroll',()=>{ syPlynule=syCil; draw(performance.now()); },{passive:true});
  window.addEventListener('resize',()=>{ size(); syPlynule=syCil; draw(performance.now()); });
}

/* ── společné kreslení: rytina staré stavební dokumentace ─────────── */
/* Jeden slovník tvarů se používá v hero i v pozadí stránky.
   Liší se jen barvou a krytím, které se předává v objektu T.         */
function ryt(ctx, T){
  const L=(a=1)=>T.linka(a), Z=(a=1)=>T.zlato(a);

  const kota=(x1,y,x2,txt)=>{
    ctx.strokeStyle=L(.55); ctx.lineWidth=.7;
    ctx.beginPath();
    ctx.moveTo(x1,y); ctx.lineTo(x2,y);
    ctx.moveTo(x1,y-4); ctx.lineTo(x1,y+4);
    ctx.moveTo(x2,y-4); ctx.lineTo(x2,y+4);
    ctx.stroke();
    if(txt && T.popisky){
      ctx.fillStyle=L(.6); ctx.font='9px "IBM Plex Mono", monospace';
      ctx.textAlign='center'; ctx.fillText(txt,(x1+x2)/2,y-6); ctx.textAlign='start';
    }
  };

  const prucelí=(x,y,w)=>{
    const h=w*1.25;
    ctx.strokeStyle=L(); ctx.lineWidth=1;
    ctx.strokeRect(x,y-h,w,h);
    ctx.beginPath();
    ctx.moveTo(x-w*0.10,y-h); ctx.lineTo(x+w/2,y-h-w*0.30); ctx.lineTo(x+w*1.10,y-h);
    ctx.closePath(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x+w*0.36,y); ctx.lineTo(x+w*0.36,y-h*0.42);
    ctx.arc(x+w/2,y-h*0.42,w*0.14,Math.PI,0);
    ctx.lineTo(x+w*0.64,y); ctx.stroke();
    ctx.strokeStyle=L(.7);
    for(let r=0;r<2;r++) for(let c=0;c<4;c++)
      ctx.strokeRect(x+w*0.08+c*w*0.22, y-h*0.90+r*h*0.24, w*0.14, h*0.16);
    ctx.strokeStyle=L(.5);
    ctx.beginPath(); ctx.moveTo(x-w*0.06,y-h*0.52); ctx.lineTo(x+w*1.06,y-h*0.52); ctx.stroke();
    kota(x,y+12,x+w,'430');
  };

  const rez=(x,y,w)=>{
    const h=w*0.68, patra=2, poli=5;
    ctx.strokeStyle=L(); ctx.lineWidth=1;
    ctx.strokeRect(x,y-h,w,h);
    for(let p=0;p<patra;p++){
      const py=y-h*(p+1)/patra, ph=h/patra;
      ctx.beginPath(); ctx.moveTo(x,py+ph); ctx.lineTo(x+w,py+ph); ctx.stroke();
      for(let i=0;i<poli;i++){
        const cw=w/poli, cx0=x+i*cw+cw*0.16, cw2=cw*0.68;
        ctx.strokeStyle=L(.75);
        ctx.beginPath();
        ctx.moveTo(cx0,py+ph-4); ctx.lineTo(cx0,py+ph*0.42);
        ctx.arc(cx0+cw2/2,py+ph*0.42,cw2/2,Math.PI,0);
        ctx.lineTo(cx0+cw2,py+ph-4); ctx.stroke();
        ctx.strokeStyle=L(.35);
        for(let k=1;k<4;k++){
          ctx.beginPath();
          ctx.moveTo(cx0+cw2*k/4,py+ph-6); ctx.lineTo(cx0+cw2*k/4,py+ph*0.30); ctx.stroke();
        }
      }
    }
    ctx.strokeStyle=L(.6);
    ctx.beginPath();
    for(let i=0;i<7;i++){
      ctx.moveTo(x+w*0.06+i*w*0.045,y-h*0.10-i*h*0.05);
      ctx.lineTo(x+w*0.06+(i+1)*w*0.045,y-h*0.10-i*h*0.05);
      ctx.lineTo(x+w*0.06+(i+1)*w*0.045,y-h*0.10-(i+1)*h*0.05);
    }
    ctx.stroke();
    kota(x,y+12,x+w,'630');
  };

  const arkada=(x,y,w,n)=>{
    const h=w/n*0.95, cw=w/n;
    ctx.strokeStyle=L(); ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+w,y); ctx.stroke();
    for(let i=0;i<n;i++){
      const cx0=x+i*cw;
      ctx.strokeStyle=L(.85);
      ctx.beginPath();
      ctx.moveTo(cx0+cw*0.12,y); ctx.lineTo(cx0+cw*0.12,y-h*0.55);
      ctx.arc(cx0+cw*0.5,y-h*0.55,cw*0.38,Math.PI,0);
      ctx.lineTo(cx0+cw*0.88,y); ctx.stroke();
      ctx.strokeStyle=L(.45);
      ctx.beginPath();
      ctx.moveTo(cx0+cw*0.06,y-h*0.98); ctx.lineTo(cx0+cw*0.94,y-h*0.98); ctx.stroke();
    }
    ctx.strokeStyle=L(.6);
    ctx.beginPath();
    ctx.moveTo(x-6,y-h*1.06); ctx.lineTo(x+w+6,y-h*1.06);
    ctx.moveTo(x-6,y-h*1.12); ctx.lineTo(x+w+6,y-h*1.12); ctx.stroke();
  };

  const sloupy=(x,y,h)=>{
    const w=h*0.13, mezera=h*0.34;
    [0,1].forEach(i=>{
      const cx0=x+i*(w+mezera);
      ctx.strokeStyle=L(); ctx.lineWidth=1;
      ctx.strokeRect(cx0,y-h*0.86,w,h*0.86);
      ctx.strokeStyle=L(.4);
      for(let k=1;k<4;k++){
        ctx.beginPath(); ctx.moveTo(cx0+w*k/4,y-h*0.84); ctx.lineTo(cx0+w*k/4,y-h*0.03); ctx.stroke();
      }
      ctx.strokeStyle=L(.9);
      ctx.strokeRect(cx0-w*0.20,y-h*0.94,w*1.40,h*0.045);
      ctx.strokeRect(cx0-w*0.34,y-h*1.00,w*1.68,h*0.05);
      ctx.strokeRect(cx0-w*0.24,y-h*0.05,w*1.48,h*0.05);
      kota(cx0,y+12,cx0+w,'450');
    });
  };

  const histogram=(x,y,w,h,ph)=>{
    ctx.strokeStyle=L(.8); ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x,y-h); ctx.lineTo(x,y); ctx.lineTo(x+w,y); ctx.stroke();
    for(let i=0;i<10;i++){
      const t=i/9, g=Math.exp(-Math.pow((t-0.42)*2.7,2));
      const bh=h*(0.10+0.78*g)*(1+0.04*Math.sin(ph+i*0.6));
      const bx=x+2+i*(w-4)/10, bw=(w-4)/10*0.78;
      ctx.strokeStyle=L(.7); ctx.strokeRect(bx,y-bh,bw,bh);
      ctx.strokeStyle=L(.25);
      for(let s2=2;s2<bh;s2+=4){
        ctx.beginPath(); ctx.moveTo(bx,y-s2); ctx.lineTo(bx+bw,y-s2-2.5); ctx.stroke();
      }
    }
  };

  const rozptyl=(x,y,w,h,ph)=>{
    ctx.strokeStyle=L(.8); ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x,y-h); ctx.lineTo(x,y); ctx.lineTo(x+w,y); ctx.stroke();
    ctx.fillStyle=L(.75);
    for(let i=0;i<26;i++){
      const q=Math.sin(i*12.9898)*43758.5453, r1=q-Math.floor(q);
      const q2=Math.sin(i*78.233)*43758.5453, r2=q2-Math.floor(q2);
      const px=x+6+r1*(w-12), py=y-6-(r1*0.62+r2*0.34)*(h-12);
      ctx.beginPath(); ctx.arc(px,py+Math.sin(ph+i)*0.6,1.5,0,7); ctx.fill();
    }
    ctx.strokeStyle=Z(.9); ctx.lineWidth=1.1;
    ctx.beginPath(); ctx.moveTo(x+4,y-h*0.20); ctx.lineTo(x+w-4,y-h*0.82); ctx.stroke();
  };

  /* svazek datových toků s uzly, hlavní motiv rytiny */
  const toky=(x,y,w,h,ph,n)=>{
    for(let i=0;i<n;i++){
      const t=i/(n-1), amp=h*(0.16+0.60*Math.sin(Math.PI*t));
      const f1=1.05+t*0.5, f2=1.9-t*0.4;
      ctx.strokeStyle=Z(0.20+0.55*Math.sin(Math.PI*t));
      ctx.lineWidth=0.8;
      ctx.beginPath();
      for(let k=0;k<=64;k++){
        const u=k/64, px=x+u*w;
        const py=y + Math.sin(u*Math.PI*f1 + ph + t*1.3)*amp
                   + Math.sin(u*Math.PI*f2 + ph*0.7 + t*2.1)*amp*0.34;
        k?ctx.lineTo(px,py):ctx.moveTo(px,py);
      }
      ctx.stroke();
      if(i%4===0){
        const u=0.16+((i*0.11)%0.72), px=x+u*w;
        const py=y + Math.sin(u*Math.PI*f1 + ph + t*1.3)*amp
                   + Math.sin(u*Math.PI*f2 + ph*0.7 + t*2.1)*amp*0.34;
        ctx.fillStyle=Z(1); ctx.beginPath(); ctx.arc(px,py,2.1,0,7); ctx.fill();
      }
    }
  };

  return {kota, prucelí, rez, arkada, sloupy, histogram, rozptyl, toky};
}

/* ── HERO: dýchající sloupoví a svazek datových toků ──────────────── */
function heroCanvas(){
  const cv = document.getElementById('heroCanvas'); if(!cv || !cv.getContext) return;
  const ctx = cv.getContext('2d'); if(!ctx) return;
  let raf, W, H, cols;
  const CW = 13, GAP = 9;
  const T = {
    linka:a=>`rgba(206,218,236,${0.30*a})`,
    zlato:a=>`rgba(214,182,124,${0.72*a})`,
    popisky:false
  };
  const K = ryt(ctx, T);
  function size(){
    const r = Math.min(window.devicePixelRatio||1, 1.5);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W*r; cv.height = H*r; ctx.setTransform(r,0,0,r,0,0);
    cols = Math.ceil(W/(CW+GAP))+1;
  }
  function frame(t){
    ctx.clearRect(0,0,W,H);
    const base = H*0.94;
    for(let i=0;i<cols;i++){
      const ph = i*0.42, sp = RM?0:t/2600;
      const a = (Math.sin(ph+sp)+Math.sin(ph*1.7+sp*1.6)+Math.sin(ph*0.6+sp*.7))/3;
      const h = (0.10+0.45*(a*0.5+0.5))*H;
      const x = i*(CW+GAP);
      const hot = (i%11===3);
      const grd = ctx.createLinearGradient(0,base-h,0,base);
      grd.addColorStop(0, hot?'rgba(127,169,255,.85)':'rgba(90,128,190,.30)');
      grd.addColorStop(1,'rgba(90,128,190,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(x, base-h, CW, h);
      // dórská hlavice: echinus, abakus a patka
      ctx.fillStyle = hot?'rgba(160,195,255,.45)':'rgba(120,155,215,.18)';
      ctx.fillRect(x-2, base-h-4, CW+4, 4);
      ctx.fillStyle = hot?'rgba(160,195,255,.6)':'rgba(120,155,215,.26)';
      ctx.fillRect(x-4, base-h-8, CW+8, 4);
      ctx.fillRect(x-6, base-h-12, CW+12, 4);
      ctx.fillRect(x-2, base-3, CW+4, 3);
    }
    // triumfální oblouk: zrcadlově symetrické pilastry a půlkruh
    const aw=Math.min(W*0.52,700), acx=W*0.72, ah=H*0.62, pw=16;
    ctx.strokeStyle='rgba(127,169,255,.10)'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(acx-aw/2, base); ctx.lineTo(acx-aw/2, base-ah+aw/2);
    ctx.arc(acx, base-ah+aw/2, aw/2, Math.PI, 0);
    ctx.lineTo(acx+aw/2, base);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(acx-aw/2-pw, base); ctx.lineTo(acx-aw/2-pw, base-ah*0.55);
    ctx.moveTo(acx+aw/2+pw, base); ctx.lineTo(acx+aw/2+pw, base-ah*0.55);
    ctx.strokeStyle='rgba(127,169,255,.07)'; ctx.stroke();
    // svazek datových toků přes celou šířku
    K.toky(-W*0.05, H*0.44, W*1.10, H*0.30, RM?0:t/5200*1.6, 26);
    if(!RM) raf = requestAnimationFrame(frame);
  }
  size(); frame(0);
  if(typeof ResizeObserver!=='undefined'){
    const ro=new ResizeObserver(()=>{ size(); if(RM) frame(0); }); ro.observe(cv);
  } else { window.addEventListener('resize',()=>{ size(); if(RM) frame(0); }); }
}

/* ── SCROLLYTELLING: pozice teček pro jednotlivé fáze ─────────────── */
const NDOT = 48;
function stagePos(stage){
  const rnd = n => { const x=Math.sin(n*127.1+stage*13.7)*43758.5453; return x-Math.floor(x); };
  const out=[];
  for(let i=0;i<NDOT;i++){
    if(stage===0){ out.push({x:8+rnd(i)*84, y:10+rnd(i+50)*80, o:.55, r:2.6, c:'#5E779B'}); }
    else if(stage===1){ const t=i/NDOT; const sp=(rnd(i)-.5)*(42*(1-t)+5);
      out.push({x:6+t*76, y:50+sp, o:.75, r:2.8, c:'#7FA9FF'}); }
    else if(stage===2){ const cx=i%8, cy=Math.floor(i/8);
      out.push({x:16+cx*9.6, y:22+cy*11.5, o:1, r:3.4, c:(i%8<5)?'#7FA9FF':'#33507F'}); }
    else if(stage===3){ const hs=[8,5,7,3,6,4]; let k=i, b=0;
      while(b<6 && k>=hs[b]){ k-=hs[b]; b++; }
      if(b>=6){ out.push({x:50,y:50,o:0,r:2,c:'#7FA9FF'}); }
      else out.push({x:14+b*14.5, y:86-k*8.2, o:1, r:3.6, c:b===0?'#7FA9FF':'#4E76C4'}); }
    else {
      if(i>=NDOT-10){                       // uzel rozhodnutí: prstenec teček
        const k=i-(NDOT-10), a2=k/10*Math.PI*2;
        out.push({x:82+Math.cos(a2)*11, y:50+Math.sin(a2)*11, o:1, r:3.4, c:'#7FA9FF'});
      } else {                              // proud: rovnoměrné rozestupy, sbíhá se
        const t=i/(NDOT-10);
        out.push({x:4+t*66, y:50+Math.sin(t*Math.PI*1.6+0.5)*(20*(1-t*0.82)), o:.55+t*.45, r:2.6+t*1.1, c:t>.6?'#6C90D8':'#3C5D96'});
      }
    }
  }
  return out;
}
function buildStage(){
  const dots = Array.from({length:NDOT},(_,i)=>`<circle class="stage-dot" id="sd${i}" r="3" cx="50" cy="50" fill="#5E779B"/>`).join('');
  return `<svg class="stage-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <g id="stageGuides">
      <path id="gFunnel" class="stage-guide" d="M6 6 L84 46 M6 94 L84 54"/>
      <path id="gAxis" class="stage-guide" d="M10 88 L92 88 M10 88 L10 14"/>
      <circle id="gNode" class="stage-guide" cx="82" cy="50" r="13"/>
    </g>
    <g id="stageDots">${dots}</g>
  </svg>`;
}
function setStage(s){
  const pos = stagePos(s);
  pos.forEach((p,i)=>{
    const el = document.getElementById('sd'+i); if(!el) return;
    el.setAttribute('cx',p.x.toFixed(2)); el.setAttribute('cy',p.y.toFixed(2));
    el.setAttribute('r',p.r); el.setAttribute('fill',p.c); el.style.opacity=p.o;
    el.style.transitionDelay = (i%12)*22+'ms';
    el.style.animation = (s===4 && !RM) ? `proud ${(3.4+ (i%7)*0.18).toFixed(2)}s ease-in-out ${(i*55)}ms infinite` : '';
  });
  const g = id => document.getElementById(id);
  if(g('gFunnel')) g('gFunnel').classList.toggle('on', s===1);
  if(g('gAxis')) g('gAxis').classList.toggle('on', s===3);
  if(g('gNode')) g('gNode').classList.toggle('on', s===4);
}

/* ── HOMEPAGE ─────────────────────────────────────────────────────── */
const F = { ria:'vse', obl:'', q:'', view:'karty' };
const poradi = p => p.stav==='dokonceno' ? 0 : (p.vystupy.length ? 1 : 2);
const rank = p => (p.poradi!==undefined ? p.poradi : 99);
const SORTED = () => [...PROJEKTY].sort((a,b)=> (a.pripravujeme?1:0)-(b.pripravujeme?1:0) || rank(a)-rank(b) || poradi(a)-poradi(b) || a.cislo-b.cislo);

function pcard(p,i){
  const r = riaOf(p);
  const cls = (i===0 ? 'hero-card' : (i<3 ? 'wide' : '')) + (p.pripravujeme?' soon-card':'');
  if(p.pripravujeme){
    return `<a class="pcard ${cls}" href="#/projekt/${p.id}" style="--ring:var(--slate)">
      <div class="pcard-art">${art(p)}</div>
      <div class="pcard-body">
        <div class="pcard-tags">
          <span class="tag t-obl">${esc(p.oblast)}</span>
          <span class="tag t-stav priprava">Připravujeme</span>
        </div>
        <h3>${esc(p.nazev)}</h3>
        <div class="pcard-foot"><span>${p.utvar.join(' · ')}</span><span class="pcard-go">${IC.arr}</span></div>
      </div></a>`;
  }
  return `<a class="pcard ${cls}" href="#/projekt/${p.id}" style="--ring:${r.c}">
    <div class="pcard-art">${art(p)}</div>
    <div class="pcard-body">
      <div class="pcard-tags">
        <span class="tag ${r.cls}">${r.l}</span>
        <span class="tag t-obl">${esc(p.oblast)}</span>
      </div>
      <h3>${esc(p.nazev)}</h3>
      <div class="pcard-reveal">
        <p class="pcard-q"><i>?</i><span>${esc(p.otazka||p.perex)}</span></p>
        ${(p.vysledky&&p.vysledky.length)?`<ul class="pcard-out">${p.vysledky.map(v=>`<li>${IC.check}<span>${esc(v)}</span></li>`).join('')}</ul>`:''}
      </div>
      <div class="pcard-foot">
        <span>${p.utvar.join(' · ')}</span>
        ${p.vystupy.length?`<span>${p.vystupy.length} výstup${p.vystupy.length>1?'y':''}</span>`:''}
        <span class="pcard-go">${IC.arr}</span>
      </div>
    </div></a>`;
}

function prow(p){
  const r=riaOf(p);
  return `<a class="prow" href="#/projekt/${p.id}" style="--ring:${p.pripravujeme?'var(--slate)':r.c}">
    <span class="prow-art">${art(p)}</span>
    <h3>${esc(p.nazev)}</h3>
    <span class="prow-meta">
      ${p.pripravujeme?`<span class="tag t-stav priprava">Připravujeme</span>`:`<span class="tag ${r.cls}">${r.l}</span>`}
      <span class="tag t-obl">${esc(p.oblast)}</span>
    </span>
    <span class="prow-go">${IC.arr}</span>
  </a>`;
}
function fits(p){
  if(F.ria==='exante' && p.ria!=='ex-ante') return false;
  if(F.ria==='expost' && p.ria!=='ex-post') return false;
  if(F.ria==='jine' && p.ria!==null) return false;
  if(F.obl && p.oblast!==F.obl) return false;
  if(F.q){ const h=(p.nazev+' '+p.perex+' '+p.popis+' '+p.oblast+' '+(p.kod||'')+' '+p.utvar.join(' ')).toLowerCase();
    if(!h.includes(F.q.toLowerCase())) return false; }
  return true;
}
function paint(){
  const list = SORTED().filter(fits);
  const g = $('#catalog'); if(!g) return;
  g.className = F.view==='seznam' ? 'rows' : 'catalog';
  g.innerHTML = list.length ? (F.view==='seznam' ? list.map(prow).join('') : list.map(pcard).join(''))
    : `<div class="pending" style="grid-column:1/-1"><b>Žádný projekt neodpovídá filtrům</b><span>Zkuste některé z omezení zrušit.</span></div>`;
}

/* Vykreslí úvodní stránku s přehledem projektů a filtry */
function renderHome(){
  const oblasti = [...new Set(PROJEKTY.map(p=>p.oblast))].sort();
  main.innerHTML = `
  <section class="hero">
    <canvas id="heroCanvas"></canvas>
    <div class="hero-in wrap on-void">
      <h1 class="rv" style="margin-top:26px">Oddělení analýz <em>a hodnocení dopadů</em> <span class="l3">regulace</span></h1>
      <p class="motto rv">Validní data jako <b>pilíř</b> v rozhodování resortu spravedlnosti.</p>
    </div>
    <div class="scrollcue"><i></i></div>
  </section>

  <section class="sec" id="projekty">
    <div class="wrap">
      <div class="arch-rule rv" aria-hidden="true" style="margin-top:8px"></div>
      <div class="filters">
        <button class="chip" data-ria="vse">Vše</button>
        <button class="chip" data-ria="exante">RIA ex ante</button>
        <button class="chip" data-ria="expost">RIA ex post</button>
        <button class="chip" data-ria="jine">Jiné</button>
        <span class="fdiv"></span>
        <select class="fsearch" id="fobl" style="min-width:0" aria-label="Oblast">
          <option value="">Všechny oblasti</option>
          ${oblasti.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('')}
        </select>
        <input class="fsearch" id="fq" type="search" placeholder="Hledat…" aria-label="Hledat v projektech">
        <div class="vswitch" role="group" aria-label="Způsob zobrazení">
          <button data-view="karty">${IC.grid} Karty</button>
          <button data-view="seznam">${IC.list} Seznam</button>
        </div>
      </div>
      <div class="catalog" id="catalog"></div>
      <div style="margin-top:46px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;max-width:1000px">
        ${Object.values(RIA_TYP).map(v=>`<div><span class="tag ${v.cls}">${v.l}</span>
          <p style="font-size:13.5px;color:var(--ink-3);line-height:1.55;margin:12px 0 0">${esc(v.popis)}</p></div>`).join('')}
      </div>
    </div>
  </section>
`;

  $$('.chip').forEach(b=>{
    b.setAttribute('aria-pressed', String(b.dataset.ria===F.ria));
    b.onclick = () => { F.ria=b.dataset.ria;
      $$('.chip').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.ria===F.ria))); paint(); };
  });
  $$('.vswitch button').forEach(b=>{
    b.setAttribute('aria-pressed', String(b.dataset.view===F.view));
    b.onclick=()=>{ F.view=b.dataset.view;
      $$('.vswitch button').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.view===F.view)));
      paint(); };
  });
  $('#fobl').value=F.obl; $('#fq').value=F.q;
  $('#fobl').onchange=e=>{F.obl=e.target.value;paint()};
  $('#fq').oninput=e=>{F.q=e.target.value;paint()};
  paint();
  heroCanvas();
}

function observeSteps(){
  const steps=$$('.step'); if(!steps.length) return;
  if(typeof IntersectionObserver==='undefined'){ steps.forEach(s=>s.classList.add('on')); return; }
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){
      steps.forEach(s=>s.classList.remove('on'));
      e.target.classList.add('on');
      setStage(+e.target.dataset.step);
    }});
  },{rootMargin:'-45% 0px -45% 0px'});
  steps.forEach(s=>io.observe(s));
}

/* ── počítadla ────────────────────────────────────────────────────── */
function counters(){
  const els=$$('[data-count]'); if(!els.length) return;
  const run=el=>{
    const to=+el.dataset.count, sfx=el.dataset.suffix||'', t0=performance.now(), d=1400;
    if(RM){ el.textContent=to.toLocaleString('cs-CZ')+sfx; return; }
    const step=t=>{ const k=Math.min(1,(t-t0)/d), e=1-Math.pow(1-k,3);
      el.textContent=Math.round(to*e).toLocaleString('cs-CZ')+(k===1?sfx:'');
      if(k<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  if(typeof IntersectionObserver==='undefined'){ els.forEach(run); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ run(e.target); io.unobserve(e.target); }}),{threshold:.4});
  els.forEach(e=>io.observe(e));
}

/* ── DETAIL PROJEKTU ──────────────────────────────────────────────── */
function tl(p){
  const items=p.timeline.filter(t=>prekOn.v||t.typ!=='prekazka');
  const n=p.timeline.filter(t=>t.typ==='prekazka').length;
  const body=items.map(t=>{
    const det=t.detail&&t.detail.length;
    return `<div class="tl-item ${t.typ}"><span class="tl-dot"></span>
      <details class="tlc"${det?'':' data-plain'}>
        <summary>
          <span class="tl-when">${esc(t.obdobi)} · ${TYPY[t.typ]||''}</span>
          <span class="tl-title">${esc(t.nazev)}</span>
          <span class="tl-sum">${esc(t.shrnuti)}</span>
          ${det?IC.chev:''}
        </summary>
        ${det?`<div class="tl-body"><ul>${t.detail.map(d=>`<li>${esc(d)}</li>`).join('')}</ul></div>`:''}
      </details></div>`;}).join('');
  return (n?`<label class="tgl"><input type="checkbox" id="tgP" ${prekOn.v?'checked':''}> Zobrazit i překážky a rizika (${n})</label>`:'')
    +`<div class="tl">${body}</div>`;
}

function vystup(v,pid){
  /* Renderuje jeden výstup projektu: vizualizace v article, pak mapa
     (pokud existuje), a nakonec podrobná zjištění + metoda/limity. */
  const viz=v.viz||[];
  const mapy=viz.filter(c=>c.k==='mapa');
  const ostatni=viz.filter(c=>c.k!=='mapa');
  const zjist = v.zjisteni&&v.zjisteni.length
    ? `<details class="disc"><summary>${IC.chev}${esc(v.zjistNadpis||'Podrobná zjištění')}<span class="cnt">${v.zjisteni.length} bodů</span></summary>
        <div class="disc-body">${v.zjisteni.map(z=>`<div class="find"><b>${esc(z.t)}</b><p>${esc(z.d)}</p></div>`).join('')}</div></details>` : '';
  const met = v.metoda
    ? `<details class="disc"><summary>${IC.chev}Metoda, data a limity</summary>
        <div class="disc-body"><table class="mtable"><tbody>
          <tr><th>Design</th><td>${esc(v.metoda.design)}</td></tr>
          ${v.metoda.vzorek?`<tr><th>Vzorek</th><td>${esc(v.metoda.vzorek)}</td></tr>`:''}
          ${v.metoda.sber?`<tr><th>Sběr dat</th><td>${esc(v.metoda.sber)}</td></tr>`:''}
          <tr><th>Limity</th><td>${esc(v.metoda.limity)}</td></tr>
        </tbody></table></div></details>` : '';
  /* Pokud výstup obsahuje jen mapu (žádné další vizualizace), nadpis
     se zobrazí přímo nad mapou a prázdný .out článek se vynechá. */
  const hasOstatni = ostatni.length > 0;
  return `${hasOstatni?`<article class="out">
    <div class="out-head">
      <h3 class="out-title">${esc(v.nazev)}</h3>
      ${v.poznamka?`<p style="font-size:14.5px;line-height:1.6;color:var(--ink-2);background:var(--surface-2);border-left:3px solid var(--signal);padding:16px 20px;margin:0 0 30px;max-width:78ch">${v.poznamka}</p>`:''}
    </div>
    ${ostatni.map(c=>chart(c)).join('')}
  </article>`:''}
  ${mapy.map(c=>mapaBlok(c, v.nazev)).join('')}
  ${(zjist||met)?`<div class="out">${zjist}${met}</div>`:''}`;
}

/* jeden řádek se souborem ke stažení */
function dlRow(title, sub, href, fname){
  return `<div class="dl">
    <div><b>${title}</b><span>${sub}</span></div>
    <a href="${href}" download="${fname}">Stáhnout PDF ${IC.dl||''}</a>
  </div>`;
}
/* Renderuje blok ke stažení: výzkumná zpráva, projektový list */
function dlBlok(p){
  const e = (typeof PDFY!=='undefined') ? PDFY[p.id] : null;
  if(!e) return '';
  const rows=[];
  if(e.zprava) rows.push(dlRow('Výzkumná zpráva','Podrobný dokument s metodikou, zjištěními a zdroji', e.zprava, `OAHDR_${p.id}_zprava.pdf`));
  if(e.onepager){
    if(e.opLabel==='design') rows.push(dlRow('Předpokládaný výzkumný design','Plánovaný design studie na jednu stranu', e.onepager, `OAHDR_${p.id}_vyzkumny-design.pdf`));
    else rows.push(dlRow('Projektový list','Shrnutí projektu na jednu stranu', e.onepager, `OAHDR_${p.id}_projektovy-list.pdf`));
  }
  return `<div class="dls">${rows.join('')}</div>`;
}

/* Vykreslí detail jednoho projektu: hero, anotace, výstupy, zdroje, ke stažení */
function renderDetail(id){
  const p=PROJEKTY.find(x=>x.id===id); if(!p) return renderHome();
  const r=riaOf(p);
  if(p.pripravujeme){
    main.innerHTML=`
    <section class="dhero">
      <div class="dhero-art">${art(p)}</div>
      <div class="wrap dhero-in on-void">
        <a class="back" href="#/">${IC.back} Všechny projekty</a>
        <div class="dhero-tags">
          <span class="tag t-stav priprava" style="background:rgba(255,255,255,.08)">Připravujeme</span>
          <span class="tag">${esc(p.oblast)}</span>
        </div>
        <h1>${esc(p.nazev)}</h1>
      </div>
    </section>
    <div class="wrap" style="padding:78px 0 120px">
      <div class="pending"><b>Na projektu pracujeme</b><span>Tento projekt je v přípravné fázi. Anotaci, výstupy a zdroje dat sem doplníme, jakmile budou k dispozici.</span></div>
    </div>`;
    window.scrollTo(0,0);
    return;
  }
  main.innerHTML=`
  <section class="dhero">
    <div class="dhero-art">${art(p)}</div>
    <div class="wrap dhero-in on-void">
      <a class="back" href="#/">${IC.back} Všechny projekty</a>
      <div class="dhero-tags">
        <span class="tag ${r.cls}">${r.l}</span>
        <span class="tag">${esc(p.oblast)}</span>
      </div>
      <h1>${esc(p.nazev)}</h1>
      <p class="dhero-perex">${esc(p.perex)}</p>
      <dl class="metagrid">
        <div><dt>Spolupracující věcný útvar</dt><dd>${p.utvar.join(' · ')}</dd></div>
        ${p.partner?`<div><dt>Další spolupráce</dt><dd style="font-weight:400;font-size:13.5px">${esc(p.partner)}</dd></div>`:''}
      </dl>
    </div>
  </section>
  <div class="wrap dbody">
    <nav class="drail" aria-label="Obsah stránky">
      <span class="drail-t">${esc(p.zkratka||p.nazev)}</span>
      <a href="#anotace" data-go="anotace" class="on">Anotace</a>
      <a href="#vystupy" data-go="vystupy">Výstupy</a>
      <a href="#data" data-go="data">Zdroje dat</a>
      ${(typeof PDFY!=='undefined'&&PDFY[p.id])?`<a href="#stazeni" data-go="stazeni">Ke stažení</a>`:''}
    </nav>
    <div>
      <section class="dsec" id="anotace"><h2>Anotace</h2>
        <div class="prose"><p>${esc(p.popis)}</p><p>${esc(p.cileText||"")}</p></div>
      </section>
      <section class="dsec" id="vystupy"><h2>Výstupy</h2>
        ${p.vystupy.length?p.vystupy.map(v=>vystup(v,p.id)).join('')
          :`<div class="pending"><b>Výstup se připravuje</b><span>Projekt je ve fázi, kdy zveřejnitelný výstup zatím nevznikl. Doplníme jej sem, jakmile bude uzavřen.</span></div>`}
      </section>
      <section class="dsec" id="data"><h2>Zdroje dat</h2>
        <div class="srcs">${(p.zdroje||[]).map(z=>`<div class="src"><b>${esc(z.t)}</b><span>${esc(z.d)}</span></div>`).join('')}</div>
      </section>
      ${(typeof PDFY!=='undefined'&&PDFY[p.id])?`<section class="dsec" id="stazeni"><h2>Ke stažení</h2>${dlBlok(p)}</section>`:''}
    </div>
  </div>`;
  $$('.drail a[data-go]').forEach(a=>a.onclick=e=>{
    e.preventDefault(); const t=document.getElementById(a.dataset.go);
    if(t) t.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});
  });
  spy();
  if(p.vystupy.some(v=>(v.viz||[]).some(c=>c.k==='mapa'))) initMapa();
}
function bindTgl(p){
  const t=$('#tgP'); if(t) t.onchange=e=>{ prekOn.v=e.target.checked; $('#tlw').innerHTML=tl(p); bindTgl(p); };
}

/* ═════════════════ INTERAKTIVNÍ MAPA ════════════════════════════════ */
const KRAJ_ID = {'Praha':'CZ-PR','Středočeský':'CZ-ST','Jihočeský':'CZ-JC','Plzeňský':'CZ-PL',
  'Karlovarský':'CZ-KA','Ústecký':'CZ-US','Liberecký':'CZ-LI','Královéhradecký':'CZ-KR',
  'Pardubický':'CZ-PA','Vysočina':'CZ-VY','Jihomoravský':'CZ-JM','Olomoucký':'CZ-OL',
  'Zlínský':'CZ-ZL','Moravskoslezský':'CZ-MO'};
const ID_KRAJ = Object.fromEntries(Object.entries(KRAJ_ID).map(([a,b])=>[b,a]));
const AKR = {'Akreditace MSp / PMS':'ano','Jiný režim (registrace, certifikát, pověření)':'jiny','Bez akreditace':'ne'};
const MS = { lyr:null, kraj:null, akr:'vse', org:null };

function mapaBlok(c, nadpis){
  /* Generuje rozvržení mapy: nadpis + SVG mapa na celou šířku nahoře,
     pod ní tři panely v jednom řádku (filtry / seznam / detail). */
  return `<div class="mfb" id="mapa">
    ${nadpis?`<div class="map-head-in"><b>${esc(nadpis)}</b></div>`:''}
    <div class="mapapp">
      <section class="mp-stage">
        <svg class="czmap" id="czmap" viewBox="30 -10 1000 600" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mapa krajů České republiky"></svg>
        <div class="mp-lgd">
          <span>Méně</span><span class="ramp" id="mRamp"></span><span>Více organizací</span>
          <span class="tot" id="mTot"></span>
        </div>
      </section>
      <div class="mp-panels">
        <aside class="mp-panel mp-panel-filtr">
          <div class="mp-panel-head">Vrstvy a filtry</div>
          <div class="mp-panel-body" id="paneFiltr">
            <div class="mp-sec"><h4>Datová vrstva</h4><div id="mLayers"></div></div>
            <div class="mp-sec"><h4>Akreditace</h4><div id="mAkr">
              ${[['vse','Vše'],['ano','Akreditace MSp / PMS'],['jiny','Jiný režim'],['ne','Bez akreditace / neuvedeno']]
                .map(([k,l])=>`<button type="button" class="lyr" data-akr="${k}">${l}</button>`).join('')}
            </div></div>
            <div class="mp-sec" style="padding-bottom:26px">
              <h4>Nápověda</h4>
              <p style="font-size:13.5px;line-height:1.6;color:var(--ink-2)">
                Kliknutím na kraj v mapě se zobrazí seznam organizací v prostředním panelu.
                Opětovným kliknutím na vybraný kraj nebo tlačítkem <b>Zpět na přehled</b> se vrátíte na souhrn.
              </p>
            </div>
          </div>
        </aside>
        <aside class="mp-panel mp-panel-seznam">
          <div class="mp-panel-head">Seznam</div>
          <div class="mp-panel-body" id="paneSeznam"><div id="mList"></div></div>
        </aside>
        <aside class="mp-panel mp-panel-detail">
          <div class="mp-panel-head">Detail</div>
          <div class="mp-panel-body mp-det-body" id="mDetPanel">
            <div id="mDetail" class="mapa-detail"></div>
          </div>
        </aside>
      </div>
    </div>
  </div>`;
}

function mRows(){
  const rows = MAPA.R[MS.lyr]||[];
  const S=MAPA.S;
  return rows.filter(r=>{
    if(MS.akr==='vse') return true;
    return (AKR[S[r[5]]]||'ne')===MS.akr;
  });
}
function mCounts(){
  const S=MAPA.S, m={};
  mRows().forEach(r=>{ const k=S[r[7]]; if(k) m[k]=(m[k]||0)+1; });
  return m;
}
function setTab(t){ /* Panely jsou nyní vždy viditelné — přepínání tabů odstraněno */ }
/* Roztáhne .mfb na přesnou šířku viewportu (px, ne %/vw), ať je zanořená
   kdekoli — funguje shodně na desktopu (asymetrický sloupec drail) i na
   mobilu (jednosloupcové rozvržení). */
function fitBleed(){
  $$('.mfb').forEach(el=>{
    el.style.width=''; el.style.marginLeft=''; el.style.marginRight='';
    const r=el.getBoundingClientRect(), vw=document.documentElement.clientWidth;
    el.style.width=vw+'px';
    el.style.marginLeft=(-r.left)+'px';
    el.style.marginRight=(r.left-(vw-r.right))+'px';
  });
}
let _bleedBound=false;
function initMapa(){
  /* Inicializace mapové aplikace: vrstvy, filtry, kraj-click, resize listener. */
  if(typeof MAPA==='undefined' || !document.getElementById('mapa')) return;
  MS.lyr = MS.lyr || MAPA.L[0].id;
  const box = $('#mLayers');
  box.innerHTML = MAPA.L.map(l=>`<button class="lyr" data-l="${l.id}"><i style="background:${l.color}"></i>${esc(l.short)}<span class="n">${(MAPA.R[l.id]||[]).length}</span></button>`).join('');
  const sync=()=>{
    $$('#mLayers .lyr').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===MS.lyr)));
    $$('#mAkr .lyr').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.akr===MS.akr)));
  };
  $$('#mLayers .lyr').forEach(b=>b.onclick=()=>{MS.lyr=b.dataset.l;MS.org=null;sync();drawMapa();});
  $$('#mAkr .lyr').forEach(b=>b.onclick=()=>{MS.akr=b.dataset.akr;MS.org=null;sync();drawMapa();});
  /* Tlačítko pro zavření detailu odstraněno — detail je vždy viditelný v pravém panelu */
  sync(); drawMapa();
  fitBleed();
  if(!_bleedBound){
    let t; window.addEventListener('resize',()=>{ clearTimeout(t); t=setTimeout(fitBleed,120); });
    _bleedBound=true;
  }
}
function drawMapa(){
  const svg=$('#czmap'); if(!svg) return;
  const L=MAPA.L.find(x=>x.id===MS.lyr), cnt=mCounts();
  const max=Math.max(1,...Object.values(cnt));
  const shade=n=>{ if(!n) return '#E9EDF1';
    const o=.2+.8*Math.min(1,n/max); return hexA(L.color,o); };
  svg.innerHTML = Object.entries(MAPA.P).map(([id,d])=>{
    const k=ID_KRAJ[id], n=cnt[k]||0;
    return `<path d="${d}" data-k="${esc(k)}" fill="${shade(n)}" class="${MS.kraj===k?'sel':''}"><title>${esc(k)}: ${n}</title></path>`;
  }).join('') + Object.entries(MAPA.C).map(([id,[x,y]])=>{
    const k=ID_KRAJ[id], n=cnt[k]||0;
    return `<text class="cnt" x="${x}" y="${y+4}" fill="${n/max>.55?'#fff':'var(--ink)'}">${n||''}</text>`;
  }).join('');
  svg.querySelectorAll('path').forEach(p=>p.onclick=()=>{
    const k=p.dataset.k;
    MS.kraj = (MS.kraj===k) ? null : k;
    MS.org=null; drawMapa();
    if(MS.kraj) setTab('seznam');
  });
  const ramp=$('#mRamp');
  if(ramp) ramp.innerHTML=[0.2,0.4,0.6,0.8,1].map(o=>`<i style="background:${hexA(L.color,o)}"></i>`).join('');
  const tot=$('#mTot');
  if(tot) tot.innerHTML = `${esc(L.short)} · <b>${mRows().length}</b> záznamů`;
  mList();
}
function hexA(hex,a){
  const h=hex.replace('#','');
  const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
  return `rgba(${r},${g},${b},${a.toFixed(2)})`;
}
function mList(){
  /* Vykreslí seznam organizací ve středním panelu (Seznam). */
  const el=$('#mList'); if(!el) return;
  const S=MAPA.S, L=MAPA.L.find(x=>x.id===MS.lyr);
  if(!MS.kraj){
    const cnt=mCounts();
    const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]);
    el.innerHTML=`<h4>${esc(L.label)}</h4>
      <p style="font-size:14px;color:var(--ink-2);line-height:1.55;margin-bottom:20px">Celkem ${mRows().length} záznamů. Vyberte kraj v mapě a zobrazí se jeho organizace.</p>
      ${top.map(([k,n])=>`<div style="border-bottom:1px solid var(--line-2);padding:9px 0"><b style="font-size:13.5px;display:flex;font-weight:500"><span>${esc(k)}</span><span class="mono" style="margin-left:auto;color:var(--ink-3)">${n}</span></b></div>`).join('')}`;
    mDetail();
    return;
  }
  const rows=mRows().filter(r=>S[r[7]]===MS.kraj);
  el.innerHTML=`<h4>${esc(MS.kraj)} · ${rows.length} záznamů</h4>
    ${rows.length?rows.slice(0,150).map((r,i)=>{
      const a=AKR[S[r[5]]]||'ne';
      return `<div class="org${MS.org===i?' sel':''}" data-i="${i}" role="button" tabindex="0">
        <b>${esc(S[r[0]])}</b>
        ${S[r[1]]?`<p>${esc(S[r[1]])}</p>`:''}
        ${S[r[3]]?`<p style="color:var(--ink-3)">${esc(S[r[3]])}</p>`:''}
        ${S[r[2]]?`<span class="meta">${esc(S[r[2]])}</span>`:''}
        ${L.akr?`<span class="akr ${a}">${esc(S[r[5]]||'Neuvedeno')}</span>`:''}
      </div>`;}).join('')+(rows.length>150?`<p style="font-size:12.5px;color:var(--ink-3);margin-top:14px">Zobrazeno prvních 150 z ${rows.length} záznamů.</p>`:'')
      :`<p style="font-size:14px;color:var(--ink-3)">V tomto kraji nejsou pro zvolenou vrstvu a filtr žádné záznamy.</p>`}`;
  {
    const b=document.createElement('button');
    b.className='mp-back'; b.type='button';
    b.innerHTML='&larr; Zpět na přehled krajů';
    b.onclick=()=>{ MS.kraj=null; MS.org=null; drawMapa(); };
    el.insertBefore(b, el.firstChild);
  }
  el.querySelectorAll('.org').forEach(o=>{
    const pick=()=>{ MS.org=+o.dataset.i; mList(); mDetail(); };
    o.onclick=pick;
    o.onkeydown=ev=>{ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); pick(); } };
  });
  mDetail();
}
function mDetail(){
  /* Vykreslí detail vybrané organizace v pravém panelu. */
  const el=$('#mDetail');
  if(!el) return;
  const S=MAPA.S, L=MAPA.L.find(x=>x.id===MS.lyr);
  const rows=MS.kraj?mRows().filter(r=>S[r[7]]===MS.kraj):[];
  const r=(MS.org!==null&&rows[MS.org])?rows[MS.org]:null;
  if(!r){
    el.innerHTML=`<p class="prazdno">Vyberte kraj v mapě a poté konkrétní organizaci v seznamu. Zobrazí se tu její podrobnosti.</p>`;
    return;
  }
  const pole=[
    ['Program nebo služba',S[r[1]]],
    ['Cílová skupina',S[r[3]]],
    ['Působnost',S[r[2]]],
    ['Kraj',S[r[7]]],
    ['Akreditace',S[r[5]]],
    ['Režim akreditace',S[r[8]]]
  ].filter(x=>x[1]);
  el.innerHTML=`
    <span class="lyr-of">${esc(L.label)}</span>
    <h5>${esc(S[r[0]])}</h5>
    ${S[r[4]]?`<p style="font-family:var(--serif);font-size:16.5px;line-height:1.6;color:var(--ink-2);max-width:80ch;margin:14px 0 26px">${esc(S[r[4]])}</p>`:'<div style="height:14px"></div>'}
    <dl>${pole.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
      ${S[r[6]]?`<div><dt>Web</dt><dd><a href="${esc(S[r[6]].startsWith('http')?S[r[6]]:'https://'+S[r[6]])}" target="_blank" rel="noopener" style="color:var(--signal)">${esc(S[r[6]])}</a></dd></div>`:''}
    </dl>`;
}

/* ── TÝM ──────────────────────────────────────────────────────────── */
function kontakt(c){
  if(!c.mail) return '';
  return `<div class="tm-c">
    <a href="mailto:${esc(c.mail)}">${esc(c.mail)}</a>
    <span><i>linka</i> ${esc(c.tel||'—')}</span>
    <span><i>sídlo</i> ${esc(c.sidlo||'—')}</span>
  </div>`;
}
const monogram = j => j.replace(/(Mgr\.|PhDr\.|Ph\.D\.|et|,)/g,'').trim().split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
function osoba(c,lead){
  const img = c.foto && IMG[c.foto]
    ? `<span class="pfw"><img class="pf tlum" src="${IMG[c.foto]}" alt="" loading="lazy">
         ${IMG[c.foto+'_c']?`<img class="pf barva" src="${IMG[c.foto+'_c']}" alt="" loading="lazy">`:''}</span>`
    : `<span class="pf pf-mono">${monogram(c.jmeno)}</span>`;
  return `<div class="tm${lead?' lead':''}">
    ${img}
    <div>
      <b>${esc(c.jmeno)}</b><span class="role">${esc(c.role)}</span>
      ${kontakt(c)}
      ${c.li?`<a class="tm-li" href="${c.li}" target="_blank" rel="noopener" aria-label="LinkedIn profil">${SOC.li}</a>`:''}
    </div></div>`;
}
const SOC = {
  web:`<svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="1.5" y="1.5" width="21" height="21" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="12" cy="12" r="7.2" stroke="currentColor" stroke-width="1.5"/>
    <path d="M12 4.8v14.4M4.8 12h14.4" stroke="currentColor" stroke-width="1.3"/>
    <path d="M12 4.8c2.6 2.6 2.6 11.8 0 14.4M12 4.8c-2.6 2.6-2.6 11.8 0 14.4" stroke="currentColor" stroke-width="1.3"/>
    <path d="M6 8.2h12M6 15.8h12" stroke="currentColor" stroke-width="1.3"/></svg>`,
  x:`<svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="1.5" y="1.5" width="21" height="21" stroke="currentColor" stroke-width="1.6"/>
    <path d="M6.2 6h3.1l4 5.3L17.6 6h1.9l-5.2 5.8L20 18h-3.1l-4.2-5.6L7.5 18H5.6l5.5-6.2L6.2 6Z" fill="currentColor"/></svg>`,
  li:`<svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="1.5" y="1.5" width="21" height="21" stroke="currentColor" stroke-width="1.6"/>
    <rect x="5.6" y="9.8" width="2.6" height="8.2" fill="currentColor"/>
    <rect x="5.4" y="5.6" width="3" height="2.8" fill="currentColor"/>
    <path d="M11 18v-8.2h2.6v1.2c.6-.9 1.6-1.4 2.8-1.4 2 0 3.2 1.3 3.2 3.6V18h-2.6v-4.4c0-1.2-.5-1.9-1.5-1.9s-1.9.8-1.9 2V18H11Z" fill="currentColor"/></svg>`,
  fb:`<svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="1.5" y="1.5" width="21" height="21" stroke="currentColor" stroke-width="1.6"/>
    <path d="M15.6 7.2h-1.7c-1.4 0-2.1.8-2.1 2.1v1.5H9.4v2.7h2.4V22h2.9v-8.5h2.2l.4-2.7h-2.6V9.9c0-.3.2-.5.6-.5h1.9V7.2Z" fill="currentColor"/></svg>`,
  ig:`<svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="1.5" y="1.5" width="21" height="21" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="12" cy="12" r="4.4" stroke="currentColor" stroke-width="1.7"/>
    <rect x="16.4" y="5.8" width="2.4" height="2.4" fill="currentColor"/></svg>`
};
const HEAD = t => `<h2 style="font-family:var(--mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-3);margin-bottom:30px">${t}</h2>`;
/* Vykreslí stránku týmu s profily zaměstnanců */
function renderTym(){
  main.innerHTML=`
  <section class="dhero"><img class="dhero-mark" src="${IMG.oahdr_mark||''}" alt="" aria-hidden="true"><div class="wrap dhero-in on-void">
    <a class="back" href="#/">${IC.back} Všechny projekty</a>
        <h1 style="margin-top:22px">Analytický tým</h1>
  </div></section>
  <div class="wrap" style="padding-top:78px;padding-bottom:120px">
    ${HEAD('Vedení')}
    <div class="team" style="margin-bottom:70px">${TYM.vedeni.map(v=>osoba(v,true)).join('')}</div>
    ${HEAD('Řešitelé')}
    <div class="team" style="margin-bottom:70px">${TYM.clenove.map(c=>osoba(c,false)).join('')}</div>
    ${HEAD('Spolupráce')}
    <div class="team" style="margin-bottom:70px">${TYM.spolupracujici.map(c=>osoba(c,false)).join('')}</div>
    ${HEAD('Jsme součástí')}
    <div class="tm-note" style="margin-top:0">
      <div style="flex:1;min-width:280px;display:flex;flex-direction:column">
        <h3 style="font-size:27px;letter-spacing:-.013em;margin-bottom:16px">${esc(TYM.odbor.nazev)}</h3>
        <p>${esc(TYM.odbor.text)}</p>
      </div>
      <div class="team" style="flex:1.3;min-width:300px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">
        ${TYM.odbor.lide.map(c=>osoba(c,false)).join('')}
      </div>
    </div>
  </div>`;
}

/* ── ODDĚLENÍ (se scrollytellingem) ───────────────────────────────── */
/* Vykreslí stránku "Náš přístup" s informacemi o oddělení */
function renderAbout(){
  main.innerHTML=`
  <section class="dhero"><img class="dhero-mark" src="${IMG.oahdr_mark||''}" alt="" aria-hidden="true"><div class="wrap dhero-in on-void">
    <a class="back" href="#/">${IC.back} Všechny projekty</a>
        <h1 style="margin-top:22px">Metoda</h1>
  </div></section>
  <section class="scrolly" id="proces">
    <div class="wrap on-void">
      <div class="scrolly-grid">
        <div class="scrolly-stage">${buildStage()}</div>
        <div id="steps">${PROCES.map((s,i)=>`
          <div class="step" data-step="${i}">
            <h3>${esc(s.h)}</h3><p>${esc(s.t)}</p>
            <div class="ex">${s.ex}</div>
          </div>`).join('')}</div>
      </div>
    </div>
  </section>


  <section class="sec"><div class="wrap">
    <div class="sec-head rv"><h2>Časté dotazy</h2></div>
    <div class="faq">
      ${FAQ.map((f,i)=>`<details class="faq-i"${i===0?' open':''}>
        <summary>${esc(f.q)}</summary>
        <div class="faq-b">${f.a}${f.odkaz?`<a href="${f.odkaz.u}" target="_blank" rel="noopener">${esc(f.odkaz.t)} ${IC.arr}</a>`:''}</div>
      </details>`).join('')}
    </div>
  </div></section>

  <section class="cta">
    <img class="cta-mark" src="${IMG.oahdr_mark||''}" alt="" aria-hidden="true">
    <div class="wrap on-void" style="position:relative;z-index:1">
      <h2>Kontaktujte nás</h2>
      <p>Zajímá vás některý z projektů, potřebujete analytickou podporu nebo si chcete jen ujasnit, jestli je na vaši otázku možné odpovědět daty? Ozvěte se komukoli z týmu.</p>
      <a href="#/tym">Přejít na kontakty ${IC.arr}</a>
    </div>
  </section>`;
  setStage(0); observeSteps();
}

/* ── OBSERVERY A ROUTER ───────────────────────────────────────────── */
function reveal(){
  const els=$$('.rv,[data-ch]');
  if(typeof IntersectionObserver==='undefined'){ els.forEach(e=>e.classList.add('in','rv')); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){
    e.target.classList.add(e.target.hasAttribute('data-ch')?'in':'in'); io.unobserve(e.target); }}),{threshold:.16});
  els.forEach(e=>io.observe(e));
}
function spy(){
  const links=$$('.drail a'), secs=$$('.dsec');
  if(!links.length||typeof IntersectionObserver==='undefined') return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){
    links.forEach(a=>a.classList.toggle('on', a.dataset.go===e.target.id)); }}),{rootMargin:'-110px 0px -66% 0px'});
  secs.forEach(s=>io.observe(s));
}
function topbarState(){
  const tb=$('#topbar');
  const dark=!!document.querySelector('.hero,.dhero');
  const onScroll=()=>{
    const y=window.scrollY;
    const limit = dark ? (document.querySelector('.hero')?window.innerHeight-90:260) : 0;
    tb.classList.toggle('solid', y>limit-1);
    tb.classList.toggle('void', dark && y<=limit-1);
  };
  window.removeEventListener('scroll', window._ts||(()=>{}));
  window._ts=onScroll; window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
}

/* Směrování (routing) — reaguje na hash v URL a vykreslí odpovídající stránku */
function route(){
  const raw=location.hash.replace(/^#/,'');
  if(raw && raw[0]!=='/') return;
  const parts=(raw||'/').split('/').filter(Boolean);
  if(parts[0]==='projekt'&&parts[1]) renderDetail(parts[1]);
  else if(parts[0]==='tym') renderTym();
  else if(parts[0]==='oddeleni'||parts[0]==='o-oddeleni') renderAbout();
  /* intranet je nyní samostatný soubor intranet.html */
  else renderHome();
  try{ window.scrollTo({top:0,behavior:'auto'}); }catch(e){}
  const cur = parts[0]==='tym' ? '#/tym'
            : (parts[0]==='oddeleni'||parts[0]==='o-oddeleni') ? '#/oddeleni'
            : '#/';
  $$('.topnav a').forEach(x=>x.classList.toggle('act', x.getAttribute('href')===cur));
  reveal(); counters(); topbarState();
}
window.addEventListener('hashchange', route);
window.addEventListener('beforeprint', ()=>$$('details').forEach(d=>d.open=true));
const SITE = [
  ['https://msp.gov.cz/web/msp','Web ministerstva','web'],
  ['https://www.linkedin.com/company/ministerstvo-spravedlnosti-%C4%8Desk%C3%A9-republiky/','LinkedIn','li'],
  ['https://www.facebook.com/ministerstvospravedlnosti/?locale=cs_CZ','Facebook','fb'],
  ['https://x.com/SpravedlnostCZ','X','x'],
  ['https://www.instagram.com/ministerstvospravedlnosti/?hl=cs','Instagram','ig']
];
const fs2=document.getElementById('footSoc');
if(fs2) fs2.innerHTML = SITE.map(([u,l,k])=>`<a href="${u}" target="_blank" rel="noopener" aria-label="${l}">${SOC[k]}</a>`).join('');
const setImg=(id,k)=>{ const el=document.getElementById(id); if(el&&IMG[k]) el.src=IMG[k]; };
setImg('lgDark','oahdr_dark'); setImg('lgLight','oahdr_light');
setImg('lvDark','lev_light');  setImg('lvLight','lev_dark');
setImg('lgFoot','oahdr_mark');  setImg('lvFoot','lev_light');
bgArch();

route();