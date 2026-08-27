// TollGate Animated Simulator
const canvas = document.getElementById('highway');
const ctx = canvas.getContext('2d');

// State
let vehicles = [];
let plazas = [];
let stats = { vehicles: 0, revenue: 0, onHighway: 0, violations: 0 };
let running = false;
let paused = false;
let animationId = null;
let speed = 3;
let scenario = 'normal';
let vehicleCount = 20;
let lastSpawn = 0;
let eventLog = [];

// Vehicle types
const VEHICLE_TYPES = [
  { type: 'sedan', color: '#3b82f6', width: 40, height: 20, rate: 1000 },
  { type: 'suv', color: '#22c55e', width: 45, height: 22, rate: 1500 },
  { type: 'truck', color: '#ef4444', width: 60, height: 24, rate: 2000 },
  { type: 'bus', color: '#eab308', width: 70, height: 26, rate: 4000 },
  { type: 'motorcycle', color: '#8b5cf6', width: 25, height: 14, rate: 300 },
];

// Plate numbers
const PLATES = ['ABC-1234', 'XYZ-5678', 'MM-9012', 'YGN-3456', 'MDY-7890', 'BGO-1111', 'AYA-2222', 'NPT-3334', 'SN-5555', 'MGK-6667'];

// Initialize
function init() {
  resize();
  window.addEventListener('resize', resize);
  
  document.getElementById('btnStart').addEventListener('click', start);
  document.getElementById('btnStop').addEventListener('click', stop);
  document.getElementById('btnPause').addEventListener('click', togglePause);
  document.getElementById('scenario').addEventListener('change', (e) => scenario = e.target.value);
  document.getElementById('vehicleCount').addEventListener('change', (e) => vehicleCount = parseInt(e.target.value));
  document.getElementById('speed').addEventListener('change', (e) => speed = parseInt(e.target.value));
  
  createPlazas();
  draw();
}

function resize() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}

// Create toll plazas
function createPlazas() {
  const spacing = canvas.width / 4;
  plazas = [
    { x: spacing, name: '0 Mile', gateCode: '0MILE', lanes: 4, color: '#f59e0b' },
    { x: spacing * 2, name: '15 Mile', gateCode: '15MIL', lanes: 4, color: '#3b82f6' },
    { x: spacing * 3, name: '30 Mile', gateCode: '30MIL', lanes: 4, color: '#22c55e' },
  ];
}

// Create vehicle
function createVehicle() {
  const type = VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
  const lane = Math.floor(Math.random() * 3);
  const laneY = canvas.height * 0.3 + lane * 60;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    x: -80,
    y: laneY,
    speed: (1 + Math.random() * 2) * (speed / 3),
    type: type,
    plate: PLATES[Math.floor(Math.random() * PLATES.length)],
    lane: lane,
    hasRFID: Math.random() > 0.2,
    paid: false,
    amount: 0,
    state: 'moving', // moving, rfid-read, entry, exiting, payment, violation
    stateTimer: 0,
    targetPlaza: null,
    glowIntensity: 0,
    trail: [],
  };
}

// Draw highway
function drawHighway() {
  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.3);
  skyGrad.addColorStop(0, '#0f172a');
  skyGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.3);
  
  // Ground
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, canvas.height * 0.3, canvas.width, canvas.height * 0.4);
  
  // Grass
  ctx.fillStyle = '#166534';
  ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
  
  // Road
  const roadY = canvas.height * 0.3;
  const roadH = 180;
  
  // Asphalt
  ctx.fillStyle = '#374151';
  ctx.fillRect(0, roadY, canvas.width, roadH);
  
  // Road edges
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3;
  ctx.setLineDash([20, 10]);
  ctx.beginPath();
  ctx.moveTo(0, roadY + roadH);
  ctx.lineTo(canvas.width, roadY + roadH);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, roadY);
  ctx.lineTo(canvas.width, roadY);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Lane dividers
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.setLineDash([15, 15]);
  for (let i = 1; i < 3; i++) {
    const y = roadY + i * 60;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  
  // Direction arrows
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  for (let i = 0; i < canvas.width; i += 200) {
    for (let lane = 0; lane < 3; lane++) {
      const y = roadY + lane * 60 + 35;
      ctx.beginPath();
      ctx.moveTo(i + 20, y - 8);
      ctx.lineTo(i + 40, y);
      ctx.lineTo(i + 20, y + 8);
      ctx.fill();
    }
  }
}

// Draw plaza
function drawPlaza(plaza) {
  const roadY = canvas.height * 0.3;
  
  // Plaza structure
  ctx.fillStyle = '#475569';
  ctx.fillRect(plaza.x - 40, roadY - 30, 80, roadH + 60);
  
  // Roof
  ctx.fillStyle = plaza.color;
  ctx.fillRect(plaza.x - 50, roadY - 40, 100, 15);
  
  // Gate name
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(plaza.name, plaza.x, roadY - 45);
  
  // Lanes
  for (let i = 0; i < plaza.lanes; i++) {
    const y = roadY + i * 60 + 10;
    
    // Booth
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(plaza.x - 30, y, 60, 40);
    
    // Booth border
    ctx.strokeStyle = plaza.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(plaza.x - 30, y, 60, 40);
    
    // Traffic light
    const lightColor = Math.random() > 0.3 ? '#22c55e' : '#ef4444';
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(plaza.x, y + 20, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = lightColor;
    ctx.beginPath();
    ctx.arc(plaza.x, y + 20, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // RFID antenna
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(plaza.x - 35, y + 5);
    ctx.lineTo(plaza.x - 45, y + 5);
    ctx.lineTo(plaza.x - 45, y + 35);
    ctx.lineTo(plaza.x - 35, y + 35);
    ctx.stroke();
    
    // ANPR camera
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(plaza.x + 35, y + 5, 12, 8);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(plaza.x + 41, y + 9, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Draw vehicle
function drawVehicle(v) {
  ctx.save();
  
  // Trail glow
  if (v.state === 'rfid-read' || v.state === 'entry' || v.state === 'payment') {
    ctx.shadowColor = v.state === 'rfid-read' ? '#22c55e' : v.state === 'entry' ? '#3b82f6' : '#8b5cf6';
    ctx.shadowBlur = 20;
  }
  
  // Vehicle body
  ctx.fillStyle = v.type.color;
  const x = v.x;
  const y = v.y;
  const w = v.type.width;
  const h = v.type.height;
  
  // Body
  ctx.beginPath();
  ctx.roundRect(x - w/2, y - h/2, w, h, 4);
  ctx.fill();
  
  // Windows
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(x - w/2 + 5, y - h/2 + 3, w * 0.3, h - 6);
  
  // Wheels
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(x - w/3, y + h/2, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + w/3, y + h/2, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Plate number
  ctx.fillStyle = '#fff';
  ctx.font = '8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(v.plate, x, y + 2);
  
  // RFID indicator
  if (v.hasRFID) {
    ctx.fillStyle = v.state === 'rfid-read' ? '#22c55e' : '#22c55e80';
    ctx.beginPath();
    ctx.arc(x + w/2 + 5, y - h/2 - 5, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // State indicator
  if (v.state === 'rfid-read') {
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, w/2 + 10, 0, Math.PI * 2);
    ctx.stroke();
  } else if (v.state === 'entry') {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(x, y, w/2 + 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (v.state === 'payment') {
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, w/2 + 10, 0, Math.PI * 2);
    ctx.stroke();
    
    // Payment symbol
    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 12px system-ui';
    ctx.fillText('K', x, y - h/2 - 15);
  } else if (v.state === 'violation') {
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, w/2 + 15, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px system-ui';
    ctx.fillText('!', x, y - h/2 - 15);
  }
  
  ctx.restore();
}

// Draw particles
let particles = [];
function createParticle(x, y, color) {
  particles.push({
    x, y,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    life: 1,
    color,
    size: 2 + Math.random() * 3,
  });
}

function updateParticles() {
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.02;
    p.size *= 0.98;
    
    ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, '0');
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Add event to log
function addEvent(type, plate, detail, amount) {
  const time = new Date().toLocaleTimeString();
  eventLog.unshift({ type, plate, detail, amount, time });
  if (eventLog.length > 50) eventLog.pop();
  updateEventLog();
}

function updateEventLog() {
  const log = document.getElementById('eventLog');
  log.innerHTML = eventLog.map(e => `
    <div class="event-item ${e.type}">
      <div class="event-time">${e.time}</div>
      <div class="event-plate">${e.plate}</div>
      <div class="event-detail">${e.detail}</div>
      ${e.amount ? `<div class="event-amount">K ${e.amount.toLocaleString()}</div>` : ''}
    </div>
  `).join('');
}

// Update stats
function updateStats() {
  document.getElementById('stat-vehicles').textContent = stats.vehicles;
  document.getElementById('stat-revenue').textContent = `K ${stats.revenue.toLocaleString()}`;
  document.getElementById('stat-onhighway').textContent = stats.onHighway;
  document.getElementById('stat-violations').textContent = stats.violations;
}

// Main update loop
function update(timestamp) {
  if (!running || paused) {
    animationId = requestAnimationFrame(update);
    return;
  }
  
  const roadY = canvas.height * 0.3;
  
  // Spawn vehicles
  const spawnInterval = scenario === 'rush' ? 500 : scenario === 'holiday' ? 300 : scenario === 'night' ? 2000 : 1000;
  if (timestamp - lastSpawn > spawnInterval / (speed / 3) && vehicles.length < vehicleCount) {
    vehicles.push(createVehicle());
    lastSpawn = timestamp;
  }
  
  // Update vehicles
  vehicles.forEach(v => {
    // Move vehicle
    if (v.state === 'moving') {
      v.x += v.speed * (speed / 3);
    }
    
    // Check plaza interaction
    plazas.forEach(plaza => {
      const dist = Math.abs(v.x - plaza.x);
      
      // RFID read zone
      if (dist < 60 && v.state === 'moving' && v.hasRFID) {
        v.state = 'rfid-read';
        v.stateTimer = 30;
        v.targetPlaza = plaza;
        createParticle(v.x, v.y, '#22c55e');
        addEvent('rfid', v.plate, `RFID tag detected at ${plaza.name}`);
        stats.vehicles++;
      }
      
      // Entry zone
      if (dist < 40 && v.state === 'moving') {
        v.state = 'entry';
        v.stateTimer = 40;
        v.targetPlaza = plaza;
        createParticle(v.x, v.y, '#3b82f6');
        addEvent('entry', v.plate, `Entry at ${plaza.name}`);
        stats.onHighway++;
      }
      
      // Payment zone
      if (dist < 30 && (v.state === 'rfid-read' || v.state === 'entry')) {
        v.state = 'payment';
        v.stateTimer = 50;
        v.amount = v.type.rate;
        stats.revenue += v.amount;
        createParticle(v.x, v.y, '#8b5cf6');
        addEvent('exit', v.plate, `Toll paid at ${plaza.name}`, v.amount);
      }
      
      // Violation (no RFID, no payment)
      if (dist < 30 && v.state === 'moving' && !v.hasRFID && Math.random() < 0.1) {
        v.state = 'violation';
        v.stateTimer = 60;
        stats.violations++;
        createParticle(v.x, v.y, '#ef4444');
        addEvent('violation', v.plate, `No RFID tag detected at ${plaza.name}`);
      }
    });
    
    // State timer
    if (v.stateTimer > 0) {
      v.stateTimer--;
      if (v.stateTimer === 0) {
        if (v.state === 'payment') {
          stats.onHighway--;
        }
        v.state = 'moving';
      }
    }
    
    // Trail
    if (v.state === 'rfid-read' || v.state === 'entry' || v.state === 'payment') {
      v.trail.push({ x: v.x, y: v.y, alpha: 1 });
    }
    v.trail = v.trail.filter(t => {
      t.alpha -= 0.05;
      return t.alpha > 0;
    });
  });
  
  // Remove off-screen vehicles
  vehicles = vehicles.filter(v => v.x < canvas.width + 100);
  
  // Draw
  draw();
  updateStats();
  
  animationId = requestAnimationFrame(update);
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawHighway();
  
  // Draw trails
  vehicles.forEach(v => {
    v.trail.forEach(t => {
      ctx.fillStyle = v.type.color + Math.floor(t.alpha * 100).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(t.x, t.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  });
  
  plazas.forEach(drawPlaza);
  vehicles.forEach(drawVehicle);
  updateParticles();
}

// Start simulation
function start() {
  if (running) return;
  
  running = true;
  paused = false;
  vehicles = [];
  stats = { vehicles: 0, revenue: 0, onHighway: 0, violations: 0 };
  eventLog = [];
  
  document.getElementById('btnStart').disabled = true;
  document.getElementById('btnStop').disabled = false;
  document.getElementById('btnPause').disabled = false;
  
  addEvent('rfid', 'SYSTEM', 'Simulation started');
  animationId = requestAnimationFrame(update);
}

// Stop simulation
function stop() {
  running = false;
  paused = false;
  vehicles = [];
  
  document.getElementById('btnStart').disabled = false;
  document.getElementById('btnStop').disabled = true;
  document.getElementById('btnPause').disabled = true;
  document.getElementById('btnPause').textContent = 'Pause';
  
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  
  draw();
  updateStats();
  addEvent('rfid', 'SYSTEM', 'Simulation stopped');
}

// Toggle pause
function togglePause() {
  paused = !paused;
  document.getElementById('btnPause').textContent = paused ? 'Resume' : 'Pause';
  addEvent('rfid', 'SYSTEM', paused ? 'Simulation paused' : 'Simulation resumed');
}

// Initialize
init();
