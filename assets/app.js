/* =========================================================================
   Lions Clube Taquara — motor da landing page
   Este arquivo raramente precisa ser editado. O conteúdo fica nos .md
   dentro de content/<AL>/. Para mudar textos, edite os .md, não este arquivo.
   ========================================================================= */

const MONTH_NAMES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const MONTH_ABBR = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const TYPE_ICON = {campanha:"heart-handshake", evento:"calendar-event",
  reuniao:"users", comemorativa:"star"};

async function fetchText(path){
  try{ const r = await fetch(path, {cache:"no-store"}); if(!r.ok) return null; return await r.text(); }
  catch(e){ return null; }
}
function norm(s){ return (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim(); }
function esc(s){ return (s||"").replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function typeKey(t){
  t = norm(t);
  if(t.startsWith("campanha")) return "campanha";
  if(t.startsWith("reuni")) return "reuniao";
  if(t.startsWith("come") || t.startsWith("feria") || t.includes("comemora")) return "comemorativa";
  return "evento";
}

/* ---------- parse config.md ---------- */
function parseConfig(text){
  const kv = {}; const sections = []; let inSections = false;
  text.split("\n").forEach(raw=>{
    const line = raw.replace(/\r/,"");
    const t = line.trim();
    if(/^##\s*Se[cç]/i.test(t)){ inSections = true; return; }
    if(t.startsWith("#") || t==="") return;
    if(inSections){
      if(t.includes("|")){
        const p = t.split("|").map(x=>x.trim());
        sections.push({file:p[0], title:p[1]||"", icon:p[2]||"point", mode:(p[3]||"markdown").toLowerCase()});
      }
    } else {
      const i = line.indexOf(":");
      if(i>0){ kv[line.slice(0,i).trim()] = line.slice(i+1).trim(); }
    }
  });
  return {kv, sections};
}

/* ---------- AL helpers ---------- */
function monthsForAL(al){
  const m = /AL(\d{2})-(\d{2})/.exec(al||"");
  const y1 = m ? 2000+parseInt(m[1],10) : new Date().getFullYear();
  const y2 = m ? 2000+parseInt(m[2],10) : y1+1;
  const out = [];
  for(let mo=6; mo<=11; mo++) out.push({mi:mo, year:y1, label:`${MONTH_NAMES[mo]} ${y1}`});
  for(let mo=0; mo<=5; mo++)  out.push({mi:mo, year:y2, label:`${MONTH_NAMES[mo]} ${y2}`});
  return out;
}

/* ---------- renderers ---------- */
function sectionShell(title, icon, inner, extraClass=""){
  const s = document.createElement("section");
  s.className = "section "+extraClass;
  s.innerHTML = `<h2><i class="ti ti-${esc(icon)}"></i>${esc(title)}</h2><div class="prose">${inner}</div>`;
  return s;
}

function renderMarkdown(title, icon, text){
  const html = window.marked ? marked.parse(text) : esc(text);
  return sectionShell(title, icon, html);
}

function renderFinanceiro(title, icon, text){
  const kv = {};
  text.split("\n").forEach(l=>{ const i=l.indexOf(":");
    if(i>0 && !l.trim().startsWith("#")) kv[l.slice(0,i).trim()]=l.slice(i+1).trim(); });
  let inner = "";
  if(kv.titular) inner += `<p class="fin-row"><strong>Titular:</strong> ${esc(kv.titular)}</p>`;
  if(kv.conta)   inner += `<p class="fin-row"><strong>Conta:</strong> ${esc(kv.conta)}</p>`;
  const tipo = kv.pix_tipo ? ` (${esc(kv.pix_tipo)})` : "";
  inner += `<button class="pix-btn" type="button"><i class="ti ti-eye"></i> Mostrar chave PIX</button>
    <div class="pix-box"><span class="pix-key">${esc(kv.pix||"—")}</span>${tipo}
    <button class="copy" type="button">copiar</button>
    <p class="pix-warn"><i class="ti ti-alert-triangle"></i> ${esc(kv.aviso||"Confirme com a tesouraria antes de transferir.")}</p></div>`;
  const sec = sectionShell(title, icon, inner);
  const btn = sec.querySelector(".pix-btn"), box = sec.querySelector(".pix-box");
  btn.addEventListener("click", ()=>{
    const open = box.classList.toggle("on");
    btn.innerHTML = open ? '<i class="ti ti-eye-off"></i> Ocultar chave PIX'
                         : '<i class="ti ti-eye"></i> Mostrar chave PIX';
  });
  sec.querySelector(".copy").addEventListener("click",e=>{
    navigator.clipboard && navigator.clipboard.writeText(kv.pix||"");
    e.target.textContent="copiado!"; setTimeout(()=>e.target.textContent="copiar",1500);
  });
  return sec;
}

function renderAniversarios(title, icon, text){
  let cat = "nascimento"; const items = [];
  text.split("\n").forEach(raw=>{
    const t = raw.trim();
    if(t.startsWith("##")){ cat = norm(t).includes("casamento") ? "casamento" : "nascimento"; return; }
    if(t.startsWith("#") || t==="") return;
    const m = /^(\d{1,2})\/(\d{1,2})\s*\|\s*(.+)$/.exec(t);
    if(m){ items.push({d:+m[1], mo:+m[2]-1, name:m[3].trim(), cat}); }
  });
  items.sort((a,b)=> a.mo-b.mo || a.d-b.d);
  let inner = ""; let curMo = -1;
  items.forEach(it=>{
    if(it.mo!==curMo){ if(curMo!==-1) inner+="</ul>"; curMo=it.mo;
      inner += `<p class="bday-month">${MONTH_NAMES[it.mo]}</p><ul class="bday-list">`; }
    const ic = it.cat==="casamento" ? "rings" : "cake";
    const dd = String(it.d).padStart(2,"0"), mm = String(it.mo+1).padStart(2,"0");
    inner += `<li><span class="d">${dd}/${mm}</span><i class="ti ti-${ic}"></i>${esc(it.name)}</li>`;
  });
  if(items.length) inner+="</ul>"; else inner = "<p>Nenhum aniversário cadastrado ainda.</p>";
  return sectionShell(title, icon, inner);
}

let ACTS = [];   // guarda atividades para o modal
function renderCampanhas(title, icon, text, al){
  const months = monthsForAL(al);
  const byLabel = {};
  // parse: seções por "## Mês Ano", blocos separados por linha em branco
  let curLabel = null, buf = [];
  function flush(){
    if(!curLabel || buf.length===0) return;
    const blocks = buf.join("\n").split(/\n\s*\n/);
    blocks.forEach(b=>{
      const a = {}; let has=false;
      b.split("\n").forEach(l=>{ const i=l.indexOf(":");
        if(i>0){ a[l.slice(0,i).trim().toLowerCase()]=l.slice(i+1).trim(); has=true; } });
      if(has && (a.titulo||a.data)){
        (byLabel[norm(curLabel)] = byLabel[norm(curLabel)]||[]).push(a);
      }
    });
    buf=[];
  }
  text.split("\n").forEach(raw=>{
    const t = raw.replace(/\r/,"");
    if(t.trim().startsWith("##")){ flush(); curLabel = t.replace(/^#+/,"").trim(); return; }
    if(t.trim().startsWith("#")) return;
    buf.push(t);
  });
  flush();

  const navBtns = months.map(m=>{
    const list = byLabel[norm(m.label)]||[];
    return `<button class="${list.length?"has":""}" data-go="mes-${m.year}-${m.mi}">${MONTH_ABBR[m.mi]}</button>`;
  }).join("");

  const sub = `Atividades de ${MONTH_NAMES[months[0].mi].toLowerCase()}/${months[0].year} a ${MONTH_NAMES[months[11].mi].toLowerCase()}/${months[11].year}`;
  let body = "";
  ACTS = [];
  months.forEach(m=>{
    let list = (byLabel[norm(m.label)]||[]).slice();
    list.sort((x,y)=>{
      const dx = (/(\d{1,2})\/(\d{1,2})/.exec(x.data)||[0,99])[1];
      const dy = (/(\d{1,2})\/(\d{1,2})/.exec(y.data)||[0,99])[1];
      return (+dx)-(+dy);
    });
    body += `<div class="cal-month" id="mes-${m.year}-${m.mi}"><h3>${m.label}</h3>` +
      (list.length?`<span class="count">${list.length} ${list.length>1?"atividades":"atividade"}</span>`:"") + `</div>`;
    if(!list.length){
      body += `<div class="empty"><i class="ti ti-coffee"></i> Sem atividades programadas</div>`;
    } else {
      list.forEach(a=>{
        const idx = ACTS.push(a)-1;
        const tk = typeKey(a.tipo);
        const dm = /(\d{1,2})\/(\d{1,2})/.exec(a.data||"");
        const day = dm ? dm[1].padStart(2,"0") : "•";
        const time = a.hora ? `<div class="time">${esc(a.hora)}</div>` : "";
        const more = a.detalhes||a.link ? ` · <span class="more">ver detalhes</span>` : "";
        const resp = a.responsavel ? `resp. ${esc(a.responsavel)}` : (tk==="comemorativa"?"data comemorativa":"");
        body += `<div class="act" data-act="${idx}">
          <div class="date"><div class="day">${day}</div>${time}</div>
          <span class="chip ${tk}"><i class="ti ti-${TYPE_ICON[tk]}"></i></span>
          <div class="body"><p class="ttl">${esc(a.titulo||"Atividade")}</p>
          <p class="meta">${resp}${more}</p></div></div>`;
      });
    }
  });

  const sec = document.createElement("section");
  sec.className = "section cal";
  sec.innerHTML =
    `<div class="cal-head"><h2><i class="ti ti-${esc(icon)}"></i>${esc(title)}</h2><p>${sub}</p></div>
     <div class="cal-nav">${navBtns}</div>
     <div class="cal-legend">
       <span><span class="chip campanha"><i class="ti ti-heart-handshake"></i></span> Campanha</span>
       <span><span class="chip evento"><i class="ti ti-calendar-event"></i></span> Evento</span>
       <span><span class="chip reuniao"><i class="ti ti-users"></i></span> Reunião</span>
       <span><span class="chip comemorativa"><i class="ti ti-star"></i></span> Comemorativa / feriado</span>
     </div>
     <div class="cal-body">${body}</div>`;
  sec.querySelectorAll(".cal-nav button").forEach(b=>{
    b.addEventListener("click",()=>{ const el=document.getElementById(b.dataset.go);
      if(el) el.scrollIntoView({behavior:"smooth",block:"start"}); });
  });
  sec.querySelectorAll(".act").forEach(el=>{
    el.addEventListener("click",()=>openModal(ACTS[+el.dataset.act]));
  });
  return sec;
}

/* ---------- modal ---------- */
function openModal(a){
  if(!a) return;
  const tk = typeKey(a.tipo);
  const m = document.getElementById("modal");
  const ico = document.getElementById("m-ico");
  ico.className = "ico chip "+tk;
  ico.innerHTML = `<i class="ti ti-${TYPE_ICON[tk]}"></i>`;
  document.getElementById("m-title").textContent = a.titulo||"Atividade";
  const when = [a.data, a.hora].filter(Boolean).join(" · ");
  document.getElementById("m-when").textContent = when;
  document.getElementById("m-det").textContent = a.detalhes||"";
  document.getElementById("m-resp").textContent = a.responsavel ? ("Responsável: "+a.responsavel) : "";
  const link = document.getElementById("m-link");
  if(a.link){ link.href=a.link; link.hidden=false; } else { link.hidden=true; }
  m.classList.add("on");
}
function closeModal(){ document.getElementById("modal").classList.remove("on"); }

/* ---------- banner ---------- */
function buildHero(text, al, kv){
  const slot = document.getElementById("hero-slot");
  const imgs = [];
  (text||"").split("\n").forEach(raw=>{ const t=raw.trim();
    if(t.startsWith("#")||t==="") return;
    const p = t.split("|"); if(p[0].trim()) imgs.push({file:p[0].trim(), cap:(p[1]||"").trim()}); });
  const hero = document.createElement("section");
  hero.className = "hero";
  const slides = imgs.map((im,i)=>
    `<div class="slide ${i===0?"on":""}" style="background-image:url('content/${al}/fotos/${encodeURIComponent(im.file)}')"></div>`).join("");
  const dots = imgs.map((_,i)=>`<button class="${i===0?"on":""}" aria-label="foto ${i+1}"></button>`).join("");
  hero.innerHTML = `${slides}<div class="scrim"></div>
    <div class="inner"><p class="eyebrow">${esc(kv.clube||"Lions Clube")}</p>
    <p class="motto">${esc(kv.lema||"Nós servimos")}</p>
    <p class="caption">${esc(imgs[0]?imgs[0].cap:"")}</p>
    <div class="dots">${dots}</div></div>`;
  slot.appendChild(hero);
  if(imgs.length>1){
    let i=0; const sl=hero.querySelectorAll(".slide"), dt=hero.querySelectorAll(".dots button"),
      cap=hero.querySelector(".caption");
    setInterval(()=>{ sl[i].classList.remove("on"); dt[i].classList.remove("on");
      i=(i+1)%imgs.length;
      sl[i].classList.add("on"); dt[i].classList.add("on"); cap.textContent=imgs[i].cap; }, 4500);
    dt.forEach((d,k)=>d.addEventListener("click",()=>{ sl[i].classList.remove("on"); dt[i].classList.remove("on");
      i=k; sl[i].classList.add("on"); dt[i].classList.add("on"); cap.textContent=imgs[i].cap; }));
  }
}

/* ---------- topbar / header / footer ---------- */
function fillChrome(kv, als, al){
  document.getElementById("h-clube").textContent = kv.clube||"Lions Clube Taquara";
  document.getElementById("h-cidade").textContent = (kv.cidade||"") + (kv.lema?` · ${kv.lema}`:"");
  document.getElementById("h-al").textContent = al.replace("AL","AL ").replace("-","/");
  document.getElementById("f-motto").textContent = kv.lema||"Nós servimos";
  document.title = (kv.clube||"Lions Clube Taquara");

  const left = [];
  if(kv.distrito) left.push(esc(kv.distrito));
  if(kv.distrito_multiplo) left.push(esc(kv.distrito_multiplo));
  document.getElementById("tb-left").innerHTML = left.join(" · ");
  const right = [];
  if(kv.mylion_url) right.push(`<a href="${esc(kv.mylion_url)}" target="_blank" rel="noopener"><i class="ti ti-device-mobile"></i>MyLion</a>`);
  if(kv.instagram_url) right.push(`<a href="${esc(kv.instagram_url)}" target="_blank" rel="noopener"><i class="ti ti-brand-instagram"></i>Instagram</a>`);
  document.getElementById("tb-right").innerHTML = right.join("");

  const fnav = [];
  if(kv.estatuto_url) fnav.push(`<a href="${esc(kv.estatuto_url)}" target="_blank" rel="noopener">Estatuto (PDF)</a>`);
  if(kv.instagram_url) fnav.push(`<a href="${esc(kv.instagram_url)}" target="_blank" rel="noopener">Instagram</a>`);
  if(kv.mylion_url) fnav.push(`<a href="${esc(kv.mylion_url)}" target="_blank" rel="noopener">MyLion</a>`);
  document.getElementById("f-nav").innerHTML = fnav.join("");

  const sel = document.getElementById("al-select");
  if(als.length>1){
    sel.hidden=false;
    sel.innerHTML = als.map(a=>`<option value="${esc(a)}" ${a===al?"selected":""}>${a.replace("AL","AL ").replace("-","/")}</option>`).join("");
    sel.addEventListener("change",()=>{ location.hash = sel.value; location.reload(); });
  }
}

/* ---------- main ---------- */
async function main(){
  const cfgText = await fetchText("content/config.md");
  if(!cfgText){ document.getElementById("content").innerHTML =
    '<p class="loading">Não consegui carregar <code>content/config.md</code>. Se você abriu o arquivo direto (file://), publique no GitHub Pages ou rode um servidor local.</p>'; return; }
  const {kv, sections} = parseConfig(cfgText);
  const als = (kv.als||kv.al_atual||"AL26-27").split(",").map(s=>s.trim()).filter(Boolean);
  const hashAL = location.hash.replace("#","");
  const al = als.includes(hashAL) ? hashAL : (kv.al_atual||als[0]);

  fillChrome(kv, als, al);

  const content = document.getElementById("content");
  content.innerHTML = "";
  for(const s of sections){
    const text = await fetchText(`content/${al}/${s.file}`);
    if(text===null) continue; // arquivo ausente: pula a seção sem quebrar
    if(s.mode==="banner"){ buildHero(text, al, kv); continue; }
    let node;
    if(s.mode==="financeiro") node = renderFinanceiro(s.title, s.icon, text);
    else if(s.mode==="aniversarios") node = renderAniversarios(s.title, s.icon, text);
    else if(s.mode==="campanhas") node = renderCampanhas(s.title, s.icon, text, al);
    else node = renderMarkdown(s.title, s.icon, text);
    content.appendChild(node);
  }

  document.getElementById("m-close").addEventListener("click", closeModal);
  document.getElementById("modal").addEventListener("click", e=>{ if(e.target.id==="modal") closeModal(); });
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeModal(); });
}
main();
