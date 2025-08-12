// public/script.js
const $ = (sel) => document.querySelector(sel);

async function fetchServerInfo() {
  const t0 = performance.now();
  const res = await fetch('/api/info', {
    headers: { 'X-Client-Name': 'WebUI' }
  });
  const t1 = performance.now();
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  $('#serverInfo').textContent = JSON.stringify(data, null, 2);
  $('#latency').textContent = `Latency ~ ${Math.round(t1 - t0)} ms | Status ${res.status}`;
}

async function call404() {
  const res = await fetch('/khong-ton-tai');
  const txt = await res.text();
  $('#errorBox').textContent = `Status ${res.status}\n\n` + txt;
}
async function call500() {
  const res = await fetch('/api/boom');
  const txt = await res.text();
  $('#errorBox').textContent = `Status ${res.status}\n\n` + txt;
}

// Simple network monitor (client-side)
function mountMonitor() {
  const target = $('#monitor');
  const resources = performance.getEntriesByType('resource');
  const render = (list) => {
    const rows = list.map(r => `
      <tr>
        <td style="text-align:left; padding:10px 12px;">${r.name.split('/').slice(-1)[0]}</td>
        <td style="text-align:right; padding:10px 12px;">${Math.round(r.duration)} ms</td>
        <td style="text-align:center; padding:10px 12px;">${r.initiatorType}</td>
      </tr>
    `).join('');
    target.innerHTML = `
      <table style="width:100%; border-collapse:separate; border-spacing:0;">
        <thead>
          <tr>
            <th style="text-align:left; padding:10px 12px;">RESOURCE</th>
            <th style="text-align:right; padding:10px 12px;">DURATION</th>
            <th style="text-align:center; padding:10px 12px;">TYPE</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  };
  render(resources);
  const obs = new PerformanceObserver((list) => {
    render(performance.getEntriesByType('resource'));
  });
  obs.observe({ entryTypes: ['resource'] });
}

// (Bonus) WebSocket client – chỉ hiển thị nếu server có bật ws
function tryWebSocket() {
  const loc = window.location;
  const wsUrl = (loc.protocol === 'https:' ? 'wss://' : 'ws://') + loc.host + '/ws';
  let ws;
  try { ws = new WebSocket(wsUrl); } catch { return; }

  ws.onopen = () => {
    $('#wsCard').style.display = '';
    log('WS opened');
  };
  ws.onmessage = (evt) => log('WS message: ' + evt.data);
  ws.onclose = () => log('WS closed');
  ws.onerror = (e) => log('WS error');

  function log(msg){
    const box = $('#wsLog');
    box.textContent += `\n${new Date().toLocaleTimeString()} › ${msg}`;
    box.scrollTop = box.scrollHeight;
  }

  $('#wsSend')?.addEventListener('click', () => {
    const v = $('#wsInput').value.trim();
    if(!v) return; ws.send(v); log('You: ' + v); $('#wsInput').value='';
  });
}

// Bind UI
$('#btnFetch').addEventListener('click', fetchServerInfo);
$('#btn404').addEventListener('click', call404);
$('#btn500').addEventListener('click', call500);

mountMonitor();
tryWebSocket();
