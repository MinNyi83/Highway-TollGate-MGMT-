// TollGate Animated Simulator
const canvas = document.getElementById('highway');
const ctx = canvas.getContext('2d');

let vehicles = [];
let plazas = [];
let stats = { vehicles: 0, revenue: 0, onHighway: 0, violations: 0 };
let running = false;
let paused = false;
let animationId = null;
let speed = 3;
let scenario = 'normal';
let vehicleCount = 30;
let lastSpawn = 0;
let eventLog = [];

const LANE_COUNT = 4;
const LANE_H = 50;
const LANE_GAP = 20;
const ROAD_H = LANE_COUNT * LANE_H + LANE_GAP;

const VEHICLE_TYPES = [
  { type: 'sedan', color: '#3b82f6', width: 44, height: 22, rate: 1000 },
  { type: 'suv', color: '#22c55e', width: 50, height: 24, rate: 1500 },
  { type: 'truck', color: '#ef4444', width: 65, height: 26, rate: 2000 },
  { type: 'bus', color: '#eab308', width: 75, height: 28, rate: 4000 },
];

const PLATES = ['ABC-1234','XYZ-5678','MM-9012','YGN-3456','MDY-7890','BGO-1111','AYA-2222','NPT-3334','SN-5555','MGK-6667'];

function init() {
  resize();
  window.addEventListener('resize', resize);
  document.getElementById('btnStart').addEventListener('click', start);
  document.getElementById('btnStop').addEventListener('click', stop);
  document.getElementById('btnPause').addEventListener('click', togglePause);
  document.getElementById('scenario').addEventListener('change', e => scenario = e.target.value);
  document.getElementById('vehicleCount').addEventListener('change', e => vehicleCount = parseInt(e.target.value));
  document.getElementById('speed').addEventListener('change', e => speed = parseInt(e.target.value));
  createPlazas();
  draw();
}

function resize() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  createPlazas();
}

function createPlazas() {
  const sp = canvas.width / 4;
  plazas = [
    { x: sp, name: '0 Mile', gateCode: '0MILE', lanes: LANE_COUNT, color: '#f59e0b' },
    { x: sp * 2, name: '15 Mile', gateCode: '15MIL', lanes: LANE_COUNT, color: '#3b82f6' },
    { x: sp * 3, name: '30 Mile', gateCode: '30MIL', lanes: LANE_COUNT, color: '#22c55e' },
  ];
}

function createVehicle() {
  const type = VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
  const goingRight = Math.random() > 0.5;
  const laneInGroup = Math.floor(Math.random() * 2);
  const roadTop = (canvas.height - ROAD_H) / 2 - 10;
  let laneY;
  if (goingRight) {
    laneY = roadTop + laneInGroup * LANE_H + LANE_H / 2;
  } else {
    laneY = roadTop + LANE_GAP + 2 * LANE_H + laneInGroup * LANE_H + LANE_H / 2;
  }
  return {
    id: Math.random().toString(36).substr(2, 9),
    x: goingRight ? -80 : canvas.width + 80,
    y: laneY,
    speed: (1.5 + Math.random() * 2),
    direction: goingRight ? 1 : -1,
    type,
    plate: PLATES[Math.floor(Math.random() * PLATES.length)],
    lane: goingRight ? laneInGroup : laneInGroup + 2,
    hasRFID: Math.random() > 0.15,
    amount: 0,
    state: 'moving',
    processedPlazas: {},
    trail: [],
  };
}

// ===== DRAWING =====
function drawHighway() {
  const roadTop = (canvas.height - ROAD_H) / 2 - 10;

  const skyGrad = ctx.createLinearGradient(0, 0, 0, roadTop);
  skyGrad.addColorStop(0, '#0f172a');
  skyGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, roadTop);

  ctx.fillStyle = '#166534';
  ctx.fillRect(0, roadTop - 30, canvas.width, 30);
  ctx.fillStyle = '#166534';
  ctx.fillRect(0, roadTop + ROAD_H, canvas.width, 30);

  ctx.fillStyle = '#374151';
  ctx.fillRect(0, roadTop, canvas.width, ROAD_H);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, roadTop); ctx.lineTo(canvas.width, roadTop); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, roadTop + ROAD_H); ctx.lineTo(canvas.width, roadTop + ROAD_H); ctx.stroke();

  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  ctx.setLineDash([15, 15]);
  ctx.beginPath(); ctx.moveTo(0, roadTop + LANE_H); ctx.lineTo(canvas.width, roadTop + LANE_H); ctx.stroke();
  ctx.setLineDash([]);

  const medianY = roadTop + 2 * LANE_H;
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, medianY); ctx.lineTo(canvas.width, medianY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, medianY + LANE_GAP); ctx.lineTo(canvas.width, medianY + LANE_GAP); ctx.stroke();
  ctx.fillStyle = '#2d3748';
  ctx.fillRect(0, medianY, canvas.width, LANE_GAP);

  ctx.strokeStyle = '#fbbf2430';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 30) {
    ctx.beginPath(); ctx.moveTo(i, medianY); ctx.lineTo(i + LANE_GAP, medianY + LANE_GAP); ctx.stroke();
  }

  const downTop = medianY + LANE_GAP;
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  ctx.setLineDash([15, 15]);
  ctx.beginPath(); ctx.moveTo(0, downTop + LANE_H); ctx.lineTo(canvas.width, downTop + LANE_H); ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let i = 50; i < canvas.width; i += 250) {
    for (let l = 0; l < 2; l++) {
      const ay = roadTop + l * LANE_H + LANE_H / 2;
      ctx.beginPath(); ctx.moveTo(i, ay - 8); ctx.lineTo(i + 20, ay); ctx.lineTo(i, ay + 8); ctx.fill();
    }
    for (let l = 0; l < 2; l++) {
      const ay = downTop + l * LANE_H + LANE_H / 2;
      ctx.beginPath(); ctx.moveTo(i + 20, ay - 8); ctx.lineTo(i, ay); ctx.lineTo(i + 20, ay + 8); ctx.fill();
    }
  }

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 9px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('UP →', 8, roadTop + 12);
  ctx.fillText('← DOWN', 8, downTop + 12);
}

function drawPlaza(plaza) {
  const roadTop = (canvas.height - ROAD_H) / 2 - 10;
  const medianY = roadTop + 2 * LANE_H;
  const downTop = medianY + LANE_GAP;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(plaza.x - 50, roadTop - 48, 100, 48);
  ctx.fillStyle = plaza.color;
  ctx.fillRect(plaza.x - 50, roadTop - 55, 100, 10);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(plaza.name, plaza.x, roadTop - 40);
  ctx.font = '9px monospace';
  ctx.fillText(plaza.gateCode, plaza.x, roadTop - 28);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(plaza.x - 50, roadTop + ROAD_H, 100, 45);

  for (let i = 0; i < 2; i++) drawBooth(plaza, plaza.x, roadTop + i * LANE_H + 5, LANE_H - 10);
  for (let i = 0; i < 2; i++) drawBooth(plaza, plaza.x, downTop + i * LANE_H + 5, LANE_H - 10);
}

function drawBooth(plaza, bx, by, bh) {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(bx - 26, by, 52, bh);
  ctx.strokeStyle = plaza.color;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bx - 26, by, 52, bh);

  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(bx, by + bh / 2, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = Math.random() > 0.1 ? '#22c55e' : '#ef4444';
  ctx.beginPath(); ctx.arc(bx, by + bh / 2, 4, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bx - 30, by + 3); ctx.lineTo(bx - 38, by + 3);
  ctx.lineTo(bx - 38, by + bh - 3); ctx.lineTo(bx - 30, by + bh - 3);
  ctx.stroke();

  ctx.fillStyle = '#334155';
  ctx.fillRect(bx + 30, by + 3, 8, 6);
  ctx.fillStyle = '#ef4444';
  ctx.beginPath(); ctx.arc(bx + 34, by + 6, 2, 0, Math.PI * 2); ctx.fill();
}

function drawVehicle(v) {
  ctx.save();
  const x = v.x, y = v.y, w = v.type.width, h = v.type.height;

  if (v.state === 'rfid-read') { ctx.shadowColor = '#22c55e'; ctx.shadowBlur = 20; }
  else if (v.state === 'entry') { ctx.shadowColor = '#3b82f6'; ctx.shadowBlur = 18; }
  else if (v.state === 'payment') { ctx.shadowColor = '#8b5cf6'; ctx.shadowBlur = 20; }
  else if (v.state === 'violation') { ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 20; }

  ctx.fillStyle = v.type.color;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 5); ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath(); ctx.roundRect(x - w / 2 + 5, y - h / 2 + 3, w * 0.3, h - 6, 3); ctx.fill();

  const hx = v.direction === 1 ? x + w / 2 - 2 : x - w / 2 + 2;
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath(); ctx.arc(hx, y - h / 4, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(hx, y + h / 4, 2, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(x - w / 3, y + h / 2, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + w / 3, y + h / 2, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x - w / 3, y - h / 2, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + w / 3, y - h / 2, 3.5, 0, Math.PI * 2); ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(v.plate, x, y + 3);

  if (v.hasRFID) {
    ctx.fillStyle = v.state === 'rfid-read' ? '#22c55e' : '#22c55e80';
    ctx.beginPath(); ctx.arc(x, y - h / 2 - 6, 3, 0, Math.PI * 2); ctx.fill();
  }

  if (v.state === 'rfid-read') {
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, w / 2 + 10, 0, Math.PI * 2); ctx.stroke();
  } else if (v.state === 'entry') {
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.arc(x, y, w / 2 + 12, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
  } else if (v.state === 'payment') {
    ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, w / 2 + 10, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#8b5cf6'; ctx.font = 'bold 11px system-ui';
    ctx.fillText('K', x, y - h / 2 - 16);
  } else if (v.state === 'violation') {
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, w / 2 + 12, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#ef4444'; ctx.font = 'bold 14px system-ui';
    ctx.fillText('!', x, y - h / 2 - 16);
  }

  ctx.restore();
}

// Particles
let particles = [];
function createParticle(x, y, color) {
  for (let i = 0; i < 6; i++) {
    particles.push({ x, y, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, life: 1, color, size: 2 + Math.random() * 3 });
  }
}
function updateParticles() {
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vx *= 0.95; p.vy *= 0.95; p.life -= 0.04; p.size *= 0.97;
    ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, '0');
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
  });
}

function addEvent(type, plate, detail, amount) {
  eventLog.unshift({ type, plate, detail, amount, time: new Date().toLocaleTimeString() });
  if (eventLog.length > 30) eventLog.pop();
  const log = document.getElementById('eventLog');
  log.innerHTML = eventLog.map(e => `
    <div class="event-item ${e.type}">
      <div class="event-time">${e.time}</div>
      <div class="event-plate">${e.plate}</div>
      <div class="event-detail">${e.detail}</div>
      ${e.amount ? `<div class="event-amount">K ${e.amount.toLocaleString()}</div>` : ''}
    </div>`).join('');
}

function updateStats() {
  document.getElementById('stat-vehicles').textContent = stats.vehicles;
  document.getElementById('stat-revenue').textContent = `K ${stats.revenue.toLocaleString()}`;
  document.getElementById('stat-onhighway').textContent = Math.max(0, stats.onHighway);
  document.getElementById('stat-violations').textContent = stats.violations;
}

// ===== SIMULATION =====
function update(timestamp) {
  if (!running || paused) { animationId = requestAnimationFrame(update); return; }

  const spawnInterval = scenario === 'rush' ? 350 : scenario === 'holiday' ? 250 : scenario === 'night' ? 2000 : 700;
  if (timestamp - lastSpawn > spawnInterval / (speed / 2) && vehicles.length < vehicleCount) {
    vehicles.push(createVehicle());
    lastSpawn = timestamp;
  }

  vehicles.forEach(v => {
    // ALWAYS move — vehicles never stop
    const moveSpeed = v.speed * v.direction * (speed / 2);
    v.x += moveSpeed;

    plazas.forEach(plaza => {
      if (v.processedPlazas[plaza.gateCode]) return;
      const dist = Math.abs(v.x - plaza.x);

      if (dist < 40 && v.state === 'moving') {
        if (v.hasRFID) {
          v.state = 'rfid-read';
          v.processedPlazas[plaza.gateCode] = true;
          createParticle(v.x, v.y, '#22c55e');
          addEvent('rfid', v.plate, `RFID → ${plaza.name}`);
          stats.vehicles++;

          setTimeout(() => {
            v.amount = v.type.rate;
            stats.revenue += v.amount;
            createParticle(v.x, v.y, '#8b5cf6');
            addEvent('exit', v.plate, `Paid at ${plaza.name}`, v.amount);
            v.state = 'moving';
          }, 600 / (speed / 2));
        } else {
          v.state = 'violation';
          v.processedPlazas[plaza.gateCode] = true;
          stats.violations++;
          createParticle(v.x, v.y, '#ef4444');
          addEvent('violation', v.plate, `No RFID at ${plaza.name}`);

          setTimeout(() => { v.state = 'moving'; }, 800 / (speed / 2));
        }
      }
    });

    if (v.state !== 'moving') {
      v.trail.push({ x: v.x, y: v.y, alpha: 1 });
    }
    v.trail = v.trail.filter(t => { t.alpha -= 0.05; return t.alpha > 0; });
  });

  vehicles = vehicles.filter(v => v.x > -200 && v.x < canvas.width + 200);
  draw();
  updateStats();
  animationId = requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawHighway();
  vehicles.forEach(v => {
    v.trail.forEach(t => {
      ctx.fillStyle = v.type.color + Math.floor(t.alpha * 60).toString(16).padStart(2, '0');
      ctx.beginPath(); ctx.arc(t.x, t.y, 3, 0, Math.PI * 2); ctx.fill();
    });
  });
  plazas.forEach(drawPlaza);
  vehicles.forEach(drawVehicle);
  updateParticles();
}

function start() {
  if (running) return;
  running = true; paused = false;
  vehicles = [];
  stats = { vehicles: 0, revenue: 0, onHighway: 0, violations: 0 };
  eventLog = [];
  document.getElementById('btnStart').disabled = true;
  document.getElementById('btnStop').disabled = false;
  document.getElementById('btnPause').disabled = false;
  addEvent('rfid', 'SYSTEM', 'Simulation started');
  animationId = requestAnimationFrame(update);
}

function stop() {
  running = false; paused = false; vehicles = [];
  document.getElementById('btnStart').disabled = false;
  document.getElementById('btnStop').disabled = true;
  document.getElementById('btnPause').disabled = true;
  document.getElementById('btnPause').textContent = '⏸';
  if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
  draw(); updateStats();
  addEvent('rfid', 'SYSTEM', 'Simulation stopped');
}

function togglePause() {
  paused = !paused;
  document.getElementById('btnPause').textContent = paused ? '▶' : '⏸';
  addEvent('rfid', 'SYSTEM', paused ? 'Paused' : 'Resumed');
}

init();
