import * as THREE from "three";
const finePointer = matchMedia("(pointer: fine)").matches;
const params = new URLSearchParams(location.search);
const reduce = params.get("motion") === "reduce";
const SHAPES = {
  arrow: { hot: [0, 0], rows: [
    "X...........",
    "XX..........",
    "X.X.........",
    "X..X........",
    "X...X.......",
    "X....X......",
    "X.....X.....",
    "X......X....",
    "X.......X...",
    "X........X..",
    "X.........X.",
    "X......XXXXX",
    "X...X..X....",
    "X..XX..X....",
    "X.X..X..X...",
    "XX...X..X...",
    "X.....X..X..",
    "......X..X..",
    ".......XX..."
  ] },
  hand: { hot: [4.5, 0], rows: [
    "....XX..........",
    "...X..X.........",
    "...X..X.........",
    "...X..X.........",
    "...X..XXX.......",
    "...X..X..XXX....",
    "...X..X..X..XX..",
    "...X..X..X..X.X.",
    "XXXX..X..X..X..X",
    "X..X...........X",
    "X..X...........X",
    ".X.............X",
    "..X............X",
    "..X...........X.",
    "...X..........X.",
    "...X.........X..",
    "....X........X..",
    "....X........X..",
    "....XXXXXXXXXX.."
  ] }
};
function cells(rows) {
  const h = rows.length, w = Math.max(...rows.map((r) => r.length));
  const g = rows.map((r) => r.padEnd(w, ".").split(""));
  const outside = g.map((r) => r.map(() => false));
  const stack = [];
  for (let x = 0; x < w; x++) stack.push([x, 0], [x, h - 1]);
  for (let y = 0; y < h; y++) stack.push([0, y], [w - 1, y]);
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= w || y >= h || outside[y][x] || g[y][x] === "X") continue;
    outside[y][x] = true;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  const ink = [], fill = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (g[y][x] === "X") ink.push([x, y]);
    else if (!outside[y][x]) fill.push([x, y]);
  }
  return { ink, fill };
}
if (finePointer) {
  const PX = 2.8;
  const SIZE = 128, HOT = 36;
  const canvas = document.createElement("canvas");
  canvas.className = "cursor-3d";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  document.documentElement.classList.add("has-3d-cursor");
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(SIZE, SIZE, false);
  renderer.toneMapping = THREE.NoToneMapping;
  const scene = new THREE.Scene();
  const half = SIZE / PX / 2;
  const cam = new THREE.OrthographicCamera(-half, half, half, -half, -50, 50);
  scene.add(new THREE.AmbientLight("#ffffff", 1.6));
  const key = new THREE.DirectionalLight("#fff3e2", 2.4);
  key.position.set(-4, 6, 9);
  scene.add(key);
  const rim = new THREE.DirectionalLight("#8fb0ff", 1.4);
  rim.position.set(6, -3, 2);
  scene.add(rim);
  const box = new THREE.BoxGeometry(1, 1, 1);
  const inkMat = new THREE.MeshStandardMaterial({ color: "#051727", roughness: 0.4, metalness: 0.1 });
  const fillMat = new THREE.MeshStandardMaterial({ color: "#f6f1e7", roughness: 0.45 });
  const pivot = new THREE.Group();
  scene.add(pivot);
  const models = {};
  for (const [name, s] of Object.entries(SHAPES)) {
    const { ink, fill } = cells(s.rows);
    const g = new THREE.Group();
    const add = (list, mat, depth, z) => {
      const m = new THREE.InstancedMesh(box, mat, list.length);
      const o = new THREE.Object3D();
      list.forEach(([x2, y2], i) => {
        o.position.set(x2 - s.hot[0] + 0.5, -(y2 - s.hot[1]) - 0.5, z);
        o.scale.set(1, 1, depth);
        o.updateMatrix();
        m.setMatrixAt(i, o.matrix);
      });
      g.add(m);
    };
    add(ink, inkMat, 3.2, 0);
    add(fill, fillMat, 1.4, -0.4);
    g.visible = false;
    pivot.add(g);
    models[name] = g;
  }
  const offset = (SIZE / 2 - HOT) / PX;
  pivot.position.set(-offset, offset, 0);
  let shape = "arrow";
  models.arrow.visible = true;
  let x = -200, y = -200, px = x, py = y, vx = 0, vy = 0, tiltX = 0, tiltY = 0, press = 1, pop = 1, shown = false;
  addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
    if (!shown) {
      px = x;
      py = y;
      shown = true;
      canvas.style.opacity = "1";
    }
    const hc = document.documentElement.classList;
    const want = e.target.closest && e.target.closest("a, button, [role=button], label, select") || hc.contains("hand") || hc.contains("grab") ? "hand" : "arrow";
    if (want !== shape) {
      models[shape].visible = false;
      shape = want;
      models[shape].visible = true;
      pop = 0.75;
    }
  }, { passive: true });
  document.addEventListener("pointerleave", () => {
    canvas.style.opacity = "0";
    shown = false;
  });
  if (params.get("cursor")) {
    x = px = Number(params.get("cx") || 400);
    y = py = Number(params.get("cy") || 300);
    shown = true;
    canvas.style.opacity = "1";
    models.arrow.visible = false;
    shape = params.get("cursor");
    models[shape].visible = true;
  }
  addEventListener("pointerdown", () => press = 0.8);
  addEventListener("pointerup", () => press = 1);
  let last = performance.now(), lastSig = "";
  (function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1e3);
    last = now;
    vx += ((x - px) / Math.max(dt, 1e-3) - vx) * 0.25;
    vy += ((y - py) / Math.max(dt, 1e-3) - vy) * 0.25;
    px = x;
    py = y;
    const k = reduce ? 0 : 1;
    const tx = THREE.MathUtils.clamp(vy * 9e-4, -0.7, 0.7) * k + 0.3;
    const ty = THREE.MathUtils.clamp(vx * 11e-4, -0.8, 0.8) * k - 0.36;
    tiltX += (tx - tiltX) * (1 - Math.exp(-dt * 12));
    tiltY += (ty - tiltY) * (1 - Math.exp(-dt * 12));
    pivot.rotation.set(tiltX, tiltY, 0);
    pop += (1 - pop) * (1 - Math.exp(-dt * 14));
    const s = pop * (press < 1 ? 0.88 : 1);
    pivot.scale.setScalar(s);
    canvas.style.transform = `translate3d(${x - HOT}px, ${y - HOT}px, 0)`;
    const sig = `${tiltX.toFixed(3)}|${tiltY.toFixed(3)}|${s.toFixed(3)}|${shape}`;
    if (sig !== lastSig) {
      renderer.render(scene, cam);
      lastSig = sig;
    }
    requestAnimationFrame(tick);
  })(last);
}
