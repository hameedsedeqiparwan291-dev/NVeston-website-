import React, { useEffect, useRef } from 'react';

/* ==========================================================================
   Financial Intelligence visual
   Three translucent analytical planes stacked in CSS 3D space: market context,
   underlying drivers and the scenario range for a decision. All illustrative.
   ========================================================================== */

const AREA = 'M0,150 C40,140 70,152 110,128 C150,104 180,118 220,92 C260,66 300,84 340,58 C370,40 390,46 400,38 L400,200 L0,200 Z';
const BARS = [42, 58, 51, 72, 66, 84, 79, 95];

function Plane({ z, children, className = '', delay = '0s' }) {
  return (
    <div className="fi-plane" style={{ '--z': `${z}px`, animationDelay: delay }}>
      <div className={`fi-glass ${className}`}>{children}</div>
    </div>
  );
}

export function FinancialIntelligenceVisual() {
  return (
    <figure className="fi-root" role="img" aria-label="Illustration: three layered analytical planes — market context, the drivers behind it, and a range of possible outcomes for one decision.">
      <div className="fi-stage" aria-hidden="true">
        <div className="fi-scene">
          {/* Base plane: market context */}
          <Plane z={0} delay="0s">
            <svg viewBox="0 0 400 200" className="h-full w-full">
              <defs>
                <linearGradient id="fi-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="hsl(var(--chart-2))" stopOpacity="0.5" />
                  <stop offset="1" stopColor="hsl(var(--chart-2))" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[40, 80, 120, 160].map((y) => <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="hsl(var(--chart-2))" strokeOpacity="0.14" />)}
              {[80, 160, 240, 320].map((x) => <line key={x} y1="0" y2="200" x1={x} x2={x} stroke="hsl(var(--chart-2))" strokeOpacity="0.1" />)}
              <path d={AREA} fill="url(#fi-area)" />
              <path d={AREA.split(' L400')[0]} fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2" />
            </svg>
            <span className="fi-label">Context</span>
          </Plane>

          {/* Middle plane: drivers */}
          <Plane z={90} delay="-2s">
            <svg viewBox="0 0 400 200" className="h-full w-full">
              {BARS.map((h, i) => (
                <g key={i}>
                  <rect x={28 + i * 46} y={180 - h * 1.6} width="22" height={h * 1.6} fill="hsl(var(--primary))" fillOpacity={0.18 + i * 0.07} />
                  <rect x={28 + i * 46} y={180 - h * 1.6} width="22" height="2" fill="hsl(var(--primary))" />
                </g>
              ))}
              <line x1="16" x2="384" y1="180" y2="180" stroke="hsl(var(--primary))" strokeOpacity="0.4" />
            </svg>
            <span className="fi-label">Drivers</span>
          </Plane>

          {/* Top plane: the decision and its range of outcomes */}
          <Plane z={180} delay="-4s" className="fi-glass-top">
            <svg viewBox="0 0 400 200" className="h-full w-full">
              <path d="M40,120 C140,116 230,70 370,34 L370,178 C230,160 140,128 40,120 Z" fill="hsl(var(--primary))" fillOpacity="0.1" />
              <path d="M40,120 C140,116 230,70 370,34" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="1.8" className="draw-line" style={{ '--len': 360 }} />
              <path d="M40,120 C140,124 230,150 370,178" fill="none" stroke="hsl(var(--chart-3))" strokeWidth="1.8" className="draw-line" style={{ '--len': 360 }} />
              <path d="M40,120 C150,120 240,108 370,98" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.6" className="draw-line" style={{ '--len': 340 }} />
              <circle cx="40" cy="120" r="6" fill="hsl(var(--primary))" />
              <circle cx="40" cy="120" r="13" fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.4" />
              {[[370, 34], [370, 98], [370, 178]].map(([x, y]) => <circle key={y} cx={x} cy={y} r="4" fill="hsl(var(--foreground))" />)}
            </svg>
            <span className="fi-label">Decision range</span>
          </Plane>

          {/* Light pillars connecting the planes */}
          {[[12, 70], [52, 30], [88, 62]].map(([x, y], i) => (
            <span key={i} className="fi-pillar" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * -1.3}s` }} />
          ))}
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-muted-foreground">
        Illustrative. Context, drivers and a range of outcomes — the layers of a well-informed decision.
      </figcaption>
    </figure>
  );
}

/* ==========================================================================
   Global Market Intelligence visual
   Canvas-rendered dot-matrix globe with connections between major financial
   centres. Coordinates are real city locations; the connections are decorative
   and do not represent data.
   ========================================================================== */

// Coarse continent outlines [lon, lat] used only to place land dots.
const LAND = [
  [[-168,66],[-162,70],[-140,70],[-125,70],[-100,72],[-85,70],[-80,64],[-95,60],[-90,57],[-80,52],[-65,60],[-60,55],[-56,52],[-66,45],[-70,42],[-76,38],[-76,35],[-81,31],[-80,26],[-82,26],[-85,30],[-90,29],[-97,27],[-97,22],[-92,18],[-87,21],[-88,16],[-83,10],[-79,9],[-80,7],[-85,10],[-92,14],[-100,17],[-106,23],[-110,24],[-112,31],[-117,32],[-120,35],[-124,40],[-124,48],[-130,54],[-137,59],[-148,60],[-153,57],[-160,56],[-165,60]],
  [[-73,78],[-60,82],[-30,83],[-20,80],[-20,72],[-30,68],[-40,65],[-44,60],[-50,63],[-55,70],[-65,76]],
  [[-80,9],[-75,11],[-62,11],[-52,5],[-50,0],[-44,-2],[-35,-6],[-39,-14],[-41,-22],[-48,-26],[-53,-34],[-58,-38],[-65,-41],[-67,-47],[-69,-52],[-74,-53],[-75,-46],[-73,-37],[-71,-28],[-70,-18],[-76,-14],[-81,-6],[-80,-1],[-78,3],[-77,8]],
  [[-10,36],[-9,43],[-1,44],[-4,48],[2,51],[8,54],[8,57],[5,59],[5,62],[12,66],[18,70],[28,71],[40,68],[55,69],[70,73],[80,73],[100,77],[115,74],[130,72],[142,72],[160,70],[170,70],[180,67],[178,62],[165,60],[160,55],[155,58],[140,54],[140,47],[135,43],[129,41],[127,38],[126,35],[122,37],[121,31],[118,24],[110,21],[108,17],[109,12],[105,9],[103,1],[101,3],[100,8],[98,14],[94,17],[92,21],[88,22],[81,15],[80,9],[77,8],[73,16],[72,21],[67,24],[62,25],[57,26],[52,27],[49,30],[48,28],[51,24],[56,25],[57,22],[52,16],[45,13],[43,15],[39,21],[35,28],[34,31],[36,36],[30,36],[27,37],[26,40],[23,40],[22,37],[20,40],[16,38],[18,40],[13,45],[12,44],[16,41],[12,38],[8,44],[3,43],[-1,37],[-5,36]],
  [[-17,21],[-17,15],[-15,11],[-12,7],[-8,4],[-2,5],[5,6],[9,4],[9,-1],[12,-6],[13,-12],[12,-18],[15,-27],[18,-34],[22,-34],[27,-33],[32,-28],[35,-24],[35,-18],[40,-15],[40,-10],[39,-5],[43,0],[48,5],[51,11],[44,11],[43,13],[38,18],[35,23],[32,31],[25,32],[20,31],[15,32],[10,34],[10,37],[3,37],[-2,35],[-6,36],[-10,30],[-13,27]],
  [[44,-25],[47,-25],[50,-15],[49,-12],[44,-17]],
  [[114,-22],[114,-34],[118,-35],[124,-34],[131,-31],[137,-35],[140,-38],[146,-39],[150,-37],[153,-28],[153,-25],[146,-19],[145,-15],[142,-11],[141,-17],[136,-12],[132,-11],[129,-15],[125,-14],[121,-19]],
  [[-6,50],[2,51],[2,53],[0,54],[-2,56],[-2,58],[-5,58],[-6,56],[-5,54],[-3,53],[-5,52]],
  [[-10,52],[-6,52],[-6,55],[-10,54]],
  [[130,31],[132,34],[136,34],[140,35],[141,38],[142,42],[145,44],[141,45],[140,41],[139,38],[137,37],[133,35],[130,33]],
  [[95,5],[98,4],[104,-2],[106,-6],[101,-3]],
  [[109,1],[111,-3],[116,-4],[119,1],[117,7],[113,3]],
  [[105,-6],[114,-7],[114,-8],[106,-7]],
  [[131,-1],[141,-3],[150,-10],[144,-8],[138,-8],[132,-4]],
  [[172,-35],[178,-38],[175,-41],[171,-44],[167,-46],[168,-44],[172,-41],[174,-37]],
  [[-24,64],[-14,64],[-15,66],[-22,66]],
];

const CITIES = {
  newYork: [-74, 40.7], toronto: [-79.4, 43.7], saoPaulo: [-46.6, -23.5], london: [-0.1, 51.5], frankfurt: [8.7, 50.1],
  dubai: [55.3, 25.2], mumbai: [72.9, 19.1], singapore: [103.8, 1.35], hongKong: [114.2, 22.3], tokyo: [139.7, 35.7],
  sydney: [151.2, -33.9], johannesburg: [28, -26.2],
};
const LINKS = [
  ['newYork', 'london'], ['london', 'frankfurt'], ['london', 'dubai'], ['dubai', 'mumbai'], ['mumbai', 'singapore'],
  ['singapore', 'hongKong'], ['hongKong', 'tokyo'], ['tokyo', 'newYork'], ['newYork', 'saoPaulo'], ['toronto', 'london'],
  ['singapore', 'sydney'], ['london', 'johannesburg'], ['frankfurt', 'singapore'],
];

const RAD = Math.PI / 180;
const inPoly = (lon, lat, poly) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const toVec = (lon, lat) => [Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lon * RAD)];

function buildLandDots() {
  const dots = [];
  const step = 2.1;
  for (let lat = -58; lat <= 82; lat += step) {
    const lonStep = step / Math.max(Math.cos(lat * RAD), 0.2);
    for (let lon = -180; lon < 180; lon += lonStep) {
      if (LAND.some((p) => inPoly(lon, lat, p))) dots.push(toVec(lon, lat));
    }
  }
  return dots;
}

// Great-circle arc between two unit vectors, lifted above the surface.
function arcPoints(a, b, n = 48) {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const pts = [];
  for (let i = 0; i <= n; i += 1) {
    const t = i / n;
    const s1 = Math.sin((1 - t) * omega) / Math.sin(omega);
    const s2 = Math.sin(t * omega) / Math.sin(omega);
    const lift = 1 + Math.sin(Math.PI * t) * 0.12 * omega;
    pts.push([(a[0] * s1 + b[0] * s2) * lift, (a[1] * s1 + b[1] * s2) * lift, (a[2] * s1 + b[2] * s2) * lift]);
  }
  return pts;
}

export function GlobeVisual() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dots = buildLandDots();
    const cityVecs = Object.fromEntries(Object.entries(CITIES).map(([k, [lon, lat]]) => [k, toVec(lon, lat)]));
    const arcs = LINKS.map(([a, b]) => arcPoints(cityVecs[a], cityVecs[b]));
    const styles = getComputedStyle(canvas);
    const gold = `hsl(${styles.getPropertyValue('--primary').trim()})`;
    const goldA = (a) => `hsl(${styles.getPropertyValue('--primary').trim()} / ${a})`;
    const ink = (a) => `hsl(${styles.getPropertyValue('--chart-2').trim()} / ${a})`;

    let size = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    };
    resize();

    const tilt = 18 * RAD;
    let rot = -40 * RAD;
    const project = ([x, y, z]) => {
      const cr = Math.cos(rot);
      const sr = Math.sin(rot);
      const x1 = x * cr + z * sr;
      const z1 = -x * sr + z * cr;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const y2 = y * ct - z1 * st;
      const z2 = y * st + z1 * ct;
      return [x1, y2, z2];
    };

    const draw = (time) => {
      const R = size * 0.42;
      const cx = size / 2;
      const cy = size / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      // Atmosphere and sphere body
      const halo = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.25);
      halo.addColorStop(0, goldA(0.12));
      halo.addColorStop(1, goldA(0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
      ctx.fill();
      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      body.addColorStop(0, 'hsl(222 40% 16%)');
      body.addColorStop(1, 'hsl(222 47% 7%)');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = goldA(0.35);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Graticule (equator and a few meridians)
      ctx.strokeStyle = ink(0.08);
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 6) {
          const [x, y, z] = project(toVec(lon, lat));
          if (z < 0) { started = false; continue; }
          if (!started) ctx.moveTo(cx + x * R, cy - y * R); else ctx.lineTo(cx + x * R, cy - y * R);
          started = true;
        }
        ctx.stroke();
      }

      // Land dots
      for (const d of dots) {
        const [x, y, z] = project(d);
        if (z <= 0) continue;
        ctx.fillStyle = ink(0.25 + z * 0.6);
        ctx.fillRect(cx + x * R - 0.9, cy - y * R - 0.9, 1.8, 1.8);
      }

      // Connections with travelling light
      const phase = (time / 4200) % 1;
      arcs.forEach((pts, i) => {
        const proj = pts.map(project);
        ctx.strokeStyle = goldA(0.45);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        let started = false;
        proj.forEach(([x, y, z]) => {
          if (z < 0.02) { started = false; return; }
          if (!started) ctx.moveTo(cx + x * R, cy - y * R); else ctx.lineTo(cx + x * R, cy - y * R);
          started = true;
        });
        ctx.stroke();
        if (!reduce) {
          const t = (phase + i * 0.17) % 1;
          const [x, y, z] = proj[Math.round(t * (proj.length - 1))];
          if (z > 0.02) {
            ctx.fillStyle = gold;
            ctx.beginPath();
            ctx.arc(cx + x * R, cy - y * R, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Financial centres
      Object.values(cityVecs).forEach((v, i) => {
        const [x, y, z] = project(v);
        if (z <= 0) return;
        const px = cx + x * R;
        const py = cy - y * R;
        const pulse = reduce ? 0.5 : (Math.sin(time / 700 + i) + 1) / 2;
        ctx.strokeStyle = goldA(0.25 + 0.3 * (1 - pulse));
        ctx.beginPath();
        ctx.arc(px, py, 3 + pulse * 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = gold;
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    let raf = 0;
    let last = 0;
    let visible = false;
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 33) return; // ~30 fps is plenty for a slow rotation
      rot += ((t - (last || t)) / 1000) * 0.12;
      last = t;
      draw(t);
    };
    const start = () => { if (!raf && !reduce) { last = 0; raf = requestAnimationFrame(loop); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    draw(0);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
    io.observe(canvas);
    const onResize = () => { resize(); draw(performance.now()); };
    window.addEventListener('resize', onResize);
    return () => { stop(); io.disconnect(); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <figure className="mx-auto w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[420px]">
      <canvas
        ref={canvasRef}
        className="aspect-square w-full"
        role="img"
        aria-label="Illustration: a slowly rotating globe with glowing connections between major financial centres such as New York, London, Frankfurt, Dubai, Mumbai, Singapore, Hong Kong, Tokyo and Sydney."
      />
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Illustrative. Lines link major financial centres; they do not represent market data.
      </figcaption>
    </figure>
  );
}
