const form = document.getElementById('hit-form');
const err  = document.getElementById('err');
const box  = document.getElementById('ajax-box');

const canvas = document.getElementById('plot');
const ctx = canvas.getContext('2d');

const xGroup = document.getElementById('x-group');
const xHidden = document.getElementById('x-hidden');
const xDisplay = document.getElementById('x-display');
const historyTable = document.getElementById('history');
const emptyNote = document.getElementById('empty-note');

const allowedXs = [-5,-4,-3,-2,-1,0,1,2,3];

function getSelected(name){
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? Number(el.value) : NaN;
}
function parseY(text){ return Number(String(text ?? '').replace(',', '.')); }

function renderTable(history){
  const tbody = historyTable.querySelector('tbody');
  tbody.innerHTML = '';
  if (!history || history.length === 0){
    if (emptyNote) emptyNote.style.display = '';
    return;
  }
  if (emptyNote) emptyNote.style.display = 'none';
  for (const it of history){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${it.x}</td>
      <td>${it.y}</td>
      <td>${it.r}</td>
      <td>${it.hit ? 'Да' : 'Нет'}</td>
      <td>${it.timestamp ?? it.time ?? ''}</td>`;
    tbody.appendChild(tr);
  }
}

function readHistoryFromDom(){
  let json = box.querySelector('#history-json');
  if (!json) json = document.getElementById('history-json');
  if (!json) return [];
  try { return JSON.parse(json.textContent || '[]') || []; }
  catch { return []; }
}

function drawPoints(history){
  const r = getSelected('r') || 1;
  const subset = history.filter(it => Number(it.r) === Number(r));
  for (const it of subset){
    const [cx, cy] = toCanvas(it.x / r, it.y / r);
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, 2*Math.PI);
    ctx.fillStyle = it.hit ? 'green' : 'red';
    ctx.fill();
  }
}

function updateUiFromHistory(){
  const history = readHistoryFromDom();
  drawArea();
  drawPoints(history);
  renderTable(history);
}

function baseScale(){ return Math.min(canvas.width, canvas.height) * 0.4; }
function toCanvas(x,y){ const w=canvas.width,h=canvas.height,ox=w/2,oy=h/2,s=baseScale(); return [ox + x*s, oy - y*s]; }
function fromCanvas(x,y){ const w=canvas.width,h=canvas.height,ox=w/2,oy=h/2,s=baseScale(); return [(x-ox)/s,(oy-y)/s]; }

function drawAxes(){
  const w=canvas.width,h=canvas.height,ox=w/2,oy=h/2;
  ctx.strokeStyle='#000'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(0,oy); ctx.lineTo(w,oy);
  ctx.moveTo(ox,0); ctx.lineTo(ox,h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w-10,oy-4); ctx.lineTo(w,oy); ctx.lineTo(w-10,oy+4);
  ctx.moveTo(ox-4,10); ctx.lineTo(ox,0); ctx.lineTo(ox+4,10); ctx.stroke();
}

function drawTicks(){
  const w=canvas.width,h=canvas.height,ox=w/2,oy=h/2,s=baseScale(),t=6;
  ctx.fillStyle='#000'; ctx.font='12px monospace';
  const vt=(x)=>ctx.fillRect(x,oy-t/2,1,t);
  const ht=(y)=>ctx.fillRect(ox - t/2, y, t, 1);

  const r = getSelected('r');
  const hasR = Number.isFinite(r);            // выбран ли R

  // подписи по X
  vt(ox + 0.5*s); ctx.fillText(hasR ? String(r/2)  : 'R/2',  ox + 0.5*s - 12, oy-6);
  vt(ox + 1.0*s); ctx.fillText(hasR ? String(r)    : 'R',    ox + 1.0*s - 6,  oy-6);
  vt(ox - 0.5*s); ctx.fillText(hasR ? '-'+ String(r/2) : '-R/2', ox - 0.5*s - 20, oy-6);
  vt(ox - 1.0*s); ctx.fillText(hasR ? '-'+ String(r)   : '-R',   ox - 1.0*s - 14, oy-6);

  // подписи по Y
  ht(oy - 0.5*s); ctx.fillText(hasR ? String(r/2)  : 'R/2',  ox+6, oy - 0.5*s + 4);
  ht(oy - 1.0*s); ctx.fillText(hasR ? String(r)    : 'R',    ox+6, oy - 1.0*s + 4);
  ht(oy + 0.5*s); ctx.fillText(hasR ? '-' + String(r/2) : '-R/2', ox+6, oy + 0.5*s + 4);
  ht(oy + 1.0*s); ctx.fillText(hasR ? '-' + String(r)   : '-R',   ox+6, oy + 1.0*s + 4);
}
function drawArea() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const kx=1/7, ky=1/6, Xmin=-7, Xmax=7, step=0.02;
  const top=[], bot=[];
  for(let X=Xmin; X<Xmax; X+=step){
    const [tx, ty] = toCanvas(kx*X, yTop(X)*ky);
    const [bx, by] = toCanvas(kx*X, yBottom(X)*ky);
    top.push([tx,ty]); bot.push([bx,by]);
  }
  ctx.beginPath();
  ctx.moveTo(top[0][0], top[0][1]);
  for(let i=1;i<top.length;i++) ctx.lineTo(top[i][0], top[i][1]);
  for(let i=bot.length-1;i>=0;i--) ctx.lineTo(bot[i][0], bot[i][1]);
  ctx.closePath(); ctx.fillStyle='rgba(0,150,255,0.35)'; ctx.fill();
  drawAxes(); drawTicks();
}
function yTop(X){
  const a=Math.abs(X);
  if (a<0.5) return 2.25;
  else if (a<0.75) return 3*a + 0.75;
  else if (a<1) return 9 - 8*a;
  else if (a<3) return 1.5 - 0.5*a - (3*Math.sqrt(10)/7)*(Math.sqrt(3 - a*a + 2*a) - 2);
  else return 3*Math.sqrt(1 - Math.pow(a/7,2));
}
function yBottom(X){
  const a=Math.abs(X);
  if (a<4) return a/2 - ((3*Math.sqrt(33)-7)/112)*a*a + Math.sqrt(1 - Math.pow(Math.abs(a-2)-1,2)) - 3;
  else return -3*Math.sqrt(1 - Math.pow(a/7,2));
}



xGroup.addEventListener('click', (e)=>{
  const btn = e.target.closest('.x-btn');
  if (!btn) return;
  xGroup.querySelectorAll('.x-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  xHidden.value = btn.value;
  xDisplay.textContent = btn.value;
});


const yEl = document.getElementById('y');
yEl.addEventListener('input', () => {
  yEl.value = yEl.value.replace(',', '.');
  if (yEl.value === '') { yEl.setCustomValidity(''); return; }
  const v = Number(yEl.value);
  if (Number.isNaN(v))        yEl.setCustomValidity('Введите число');
  else if (v < -3 || v > 5)   yEl.setCustomValidity('Y должен быть от -3 до 5');
  else                        yEl.setCustomValidity('');
});

document.querySelectorAll('#r-group input[name="r"]').forEach(el =>
  el.addEventListener('change', updateUiFromHistory)
);

window.addEventListener('resize', updateUiFromHistory);

function buildLocalUrl(action, params) {
  const actionUrl = new URL(action, window.location.href);
  const qs = params instanceof URLSearchParams ? params : new URLSearchParams(params);
  return actionUrl.pathname + '?' + qs.toString();
}

canvas.addEventListener('click', async e=>{
  err.textContent = '';
  const r = getSelected('r');
  if(![1,2,3,4,5].includes(r)){ err.textContent = 'r не выбран'; return; }

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const px = (e.clientX - rect.left) * scaleX;
  const py = (e.clientY - rect.top) * scaleY;

  const [xCanvas, yCanvas] = fromCanvas(px, py);
  const serverX = Number((xCanvas * r).toFixed(3));
  const serverY = Number((yCanvas * r).toFixed(3));

  if (serverX < -5 || serverX > 3) { err.textContent = 'X вне диапазона [-5; 3]'; return; }
  if (serverY < -3 || serverY > 5) { err.textContent = 'Y вне диапазона [-3; 5]'; return; }

  const fd = new FormData(form);
  fd.set('x', String(serverX));
  fd.set('y', String(serverY));
  fd.set('r', String(r));

  const url = buildLocalUrl(form.action, new URLSearchParams(fd));
  try {
    const res  = await fetch(url, {
      method:'GET',
      cache: 'no-store',
      headers: { 'Accept': 'text/html', 'X-Requested-With': 'XMLHttpRequest', 'Cache-Control': 'no-store' },
    });
    const html = await res.text();
    if (!res.ok) { err.textContent = `Ошибка ${res.status}`; return; }
    box.innerHTML = html;
    updateUiFromHistory();
  } catch {
    err.textContent = 'Сеть/сервер недоступны';
  }
});


function isXRValid() {
  const r = getSelected('r');
  const rOk = [1,2,3,4,5].includes(r);

  const xStr = String(xHidden.value ?? '').trim();
  const xVal = (xStr === '') ? NaN : Number(xStr);
  const xOk  = Number.isFinite(xVal) && allowedXs.includes(xVal);

  return { xOk, rOk, xVal, r };
}


form.addEventListener('submit', async (e) => {
  if (e.submitter && e.submitter.id === 'submit-btn') {
    let el = form.querySelector('input[name="response"]');
    if (!el) {
      el = document.createElement('input');
      el.type = 'hidden';
      el.name = 'response';
      form.appendChild(el);
    }
    el.value = 'string';
  } else {
    const el = form.querySelector('input[name="response"]');
    if (el) el.remove();
  }

  if (!form.reportValidity()) {
    e.preventDefault();
    return;
  }

  const { xOk, rOk, xVal } = isXRValid();
  if (!rOk) { err.textContent = 'Выберите R'; e.preventDefault(); return; }
  if (!xOk) { err.textContent = 'Выберите X'; e.preventDefault(); return; }

  yEl.value = String(parseY(yEl.value));
  xHidden.value = String(xVal);

  err.textContent = '';
});




document.getElementById('clear-btn').addEventListener('click', async ()=>{
  err.textContent = '';
  try {
    const url = buildLocalUrl(form.action, { action: 'clear' });
    const res = await fetch(url, {
      method:'GET',
      cache: 'no-store',
      headers: { 'Accept': 'text/html', 'X-Requested-With': 'XMLHttpRequest', 'Cache-Control': 'no-store'},
    });
    const html = await res.text();
    if (!res.ok) { err.textContent = `Не удалось очистить (HTTP ${res.status})`; return; }
    box.innerHTML = html;
    updateUiFromHistory();
  } catch {
    err.textContent = 'Сеть/сервер недоступны';
  }
});

function initPageState() {
  function loadForm(){
    try{
      const raw = sessionStorage.getItem('lastForm');
      if (!raw) return;
      const last = JSON.parse(raw);

      xGroup.querySelectorAll('.x-btn').forEach(e => {
        if (String(last?.x) === String(e.value)) {
          e.classList.add('selected');
          xHidden.value = e.value;
          xDisplay.textContent = e.value;
        } else {
          e.classList.remove('selected');
        }
      });

      if (last?.y !== null && last?.y !== undefined) {
        document.querySelector('#y').value = String(last.y);
      }

      document.querySelectorAll('#r-group input').forEach(e => {
        e.checked = (Number(last?.r) === Number(e.value));
      });
    } catch {}
  }

  function saveForm(){
    try{
      const lastForm = {
        x: (el => el ? Number(el.value) : null)(document.querySelector('#x-group .x-btn.selected')),
        y: (v  => v === '' ? null : parseY(v))((document.querySelector('#y')?.value) ?? ''),
        r: (el => el ? Number(el.value) : null)(document.querySelector('#r-group :checked')),
      };
      sessionStorage.setItem('lastForm', JSON.stringify(lastForm));
    } catch{}
  }

  function checkLast(){
    const raw = sessionStorage.getItem('lastForm');
    if (!raw) return false;
    try{
      const lastForm = JSON.parse(raw);
      return (lastForm.x != null && lastForm.y != null && lastForm.r != null);
    } catch { return false; }
  }

  (async () => {
    try{
      const url = buildLocalUrl(form.action, { action: 'history' });
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Accept': 'text/html', 'X-Requested-With': 'XMLHttpRequest' }
      });
      const html = await res.text();
      if (res.ok) {
        box.innerHTML = html;
      }
    } catch {}

    updateUiFromHistory();

    if (checkLast()){
      loadForm();
      updateUiFromHistory();
    } else {
      xGroup.querySelectorAll('.x-btn').forEach(b => b.classList.remove('selected'));
      xHidden.value = '';
      if (xDisplay) xDisplay.textContent = '-';

      yEl.value = '';
      yEl.setCustomValidity('');

      document.querySelectorAll('#r-group input[name="r"]').forEach(e => { e.checked = false; });
    }

    form.addEventListener('submit', () => saveForm());
  })();
}


document.addEventListener('DOMContentLoaded', initPageState);

