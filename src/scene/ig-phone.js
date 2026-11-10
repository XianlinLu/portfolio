import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
const TILES = ["/assets/works/static-1.png","/assets/works/static-2.png","/assets/works/static-3.png","/assets/works/static-4.png","/assets/works/web-1.png","/assets/works/web-2.png","/assets/works/web-3.png","/assets/works/web-4.png","/assets/works/motion-1.png","/assets/works/motion-2.png","/assets/works/motion-3.png","/assets/works/motion-4.png","/assets/works/brand-1.png","/assets/works/brand-2.png","/assets/works/brand-3.png","/assets/works/brand-4.png"];
const still = () => document.documentElement.classList.contains("reduce-motion");
const load = (src) => new Promise((ok) => {
  const im = new Image();
  im.onload = () => ok(im);
  im.onerror = () => ok(null);
  im.src = src;
});
async function profileCanvas() {
  const W = 600, TW = (W - 4) / 3, TH = TW * 4 / 3, H = Math.ceil(436 + Math.ceil(TILES.length / 3) * (TH + 2));
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  await document.fonts.ready;
  const [avatar, ...tiles] = await Promise.all([load("/images/xianlin-lu.png"), ...TILES.map(load)]);
  const sans = (w, px) => `${w} ${px}px "Inter", "Segoe UI", sans-serif`;
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#0b0f19";
  g.font = sans(600, 22);
  g.fillText("9:41", 40, 44);
  g.font = sans(700, 30);
  g.fillText("xianlinlu", 40, 112);
  const ring = g.createLinearGradient(40, 150, 200, 310);
  ring.addColorStop(0, "#1989fe");
  ring.addColorStop(1, "#3b0de7");
  g.fillStyle = ring;
  g.beginPath();
  g.arc(112, 228, 76, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(112, 228, 69, 0, Math.PI * 2);
  g.fill();
  if (avatar) {
    g.save();
    g.beginPath();
    g.arc(112, 228, 64, 0, Math.PI * 2);
    g.clip();
    g.drawImage(avatar, 48, 164, 128, 128);
    g.restore();
  }
  g.fillStyle = "#0b0f19";
  g.font = sans(700, 26);
  g.fillText("Xianlin Lu", 220, 210);
  g.font = sans(400, 22);
  g.fillStyle = "#3b4352";
  g.fillText(L("", "AIGC & interaction design"), 220, 246);
  g.fillText(L("", "AI · interfaces · interaction"), 220, 276);
  const btn = (x, w, fill, text, color) => {
    g.fillStyle = fill;
    g.beginPath();
    g.roundRect(x, 330, w, 58, 14);
    g.fill();
    g.fillStyle = color;
    g.font = sans(600, 22);
    g.textAlign = "center";
    g.fillText(text, x + w / 2, 367);
    g.textAlign = "left";
  };
  const bg = g.createLinearGradient(40, 330, 300, 388);
  bg.addColorStop(0, "#1f52f6");
  bg.addColorStop(1, "#3b0de7");
  btn(40, 254, bg, L("", "Follow"), "#fff");
  btn(306, 254, "#eef1f6", L("", "Message"), "#0b0f19");
  g.fillStyle = "#e6e9ef";
  g.fillRect(0, 430, W, 2);
  g.fillStyle = "#0b0f19";
  g.fillRect(0, 428, W / 3, 4);
  const tw = TW, th = TH;
  tiles.forEach((im, i) => {
    const x = i % 3 * (tw + 2), y = 436 + Math.floor(i / 3) * (th + 2);
    if (im) g.drawImage(im, x, y, tw, th);
    else {
      g.fillStyle = "#dfe5f2";
      g.fillRect(x, y, tw, th);
    }
  });
  return { canvas: c, tiles: tiles.filter(Boolean), viewH: Math.min(1, W * 2.95 / 1.37 / H) };
}
function roundedRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ShapeGeometry(s, 8), p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - x) / w, (p.getY(i) - y) / h);
  return geo;
}
async function init(stage2) {
  const canvas = stage2.querySelector(".ig-gl"), tag = stage2.querySelector(".ig-tag");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 800 ? 1.25 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(28, 3 / 4, 0.1, 50);
  camera.position.set(0, 0, 7.2);
  const key = new THREE.DirectionalLight("#ffffff", 1.6);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const rig = new THREE.Group();
  scene.add(rig);
  const phone = new THREE.Group();
  rig.add(phone);
  const frameShape = new THREE.Shape();
  {
    const w = 1.42, h = 3, r = 0.25, x = -w / 2, y = -h / 2;
    frameShape.moveTo(x + r, y);
    frameShape.lineTo(x + w - r, y);
    frameShape.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
    frameShape.lineTo(x + w, y + h - r);
    frameShape.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
    frameShape.lineTo(x + r, y + h);
    frameShape.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
    frameShape.lineTo(x, y + r);
    frameShape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  }
  const frameGeo = new THREE.ExtrudeGeometry(frameShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.026, bevelSize: 0.026, bevelSegments: 6, curveSegments: 32 });
  frameGeo.translate(0, 0, -0.05);
  const titanium = new THREE.MeshPhysicalMaterial({ color: "#2a4269", metalness: 0.92, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  phone.add(new THREE.Mesh(frameGeo, titanium));
  const glass = new THREE.Mesh(roundedRect(1.44, 3.02, 0.26), new THREE.MeshPhysicalMaterial({ color: "#04060a", roughness: 0.08, metalness: 0, clearcoat: 1 }));
  glass.position.z = 0.08;
  phone.add(glass);
  const prof = await profileCanvas();
  const tex = new THREE.CanvasTexture(prof.canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.repeat.set(1, prof.viewH);
  tex.offset.set(0, 1 - prof.viewH);
  const screen = new THREE.Mesh(roundedRect(1.37, 2.95, 0.22), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  screen.position.z = 0.092;
  phone.add(screen);
  screen.renderOrder = 1;
  const island = new THREE.Mesh(roundedRect(0.4, 0.115, 0.0575), new THREE.MeshBasicMaterial({ color: "#020305" }));
  island.position.set(0, 1.33, 0.1);
  phone.add(island);
  island.renderOrder = 2;
  const btn = (x, y, h) => {
    const m = new THREE.Mesh(new RoundedBoxGeometry(0.035, h, 0.06, 3, 0.015), titanium);
    m.position.set(x, y, 0);
    phone.add(m);
  };
  btn(-0.742, 0.95, 0.12);
  btn(-0.742, 0.66, 0.26);
  btn(-0.742, 0.33, 0.26);
  btn(0.742, 0.6, 0.38);
  btn(0.742, -0.38, 0.24);
  const loader = new THREE.TextureLoader(), floats = [];
  [[-0.72, 0.85, 0.75, -0.32, 2], [0.74, -0.3, 0.95, 0.28, 0], [-0.66, -1.08, 0.55, 0.18, 6]].forEach(([x, y, z, ry, ti], k) => {
    const t = loader.load(TILES[ti], () => dirty = true);
    t.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(roundedRect(0.66, 0.88, 0.06), new THREE.MeshBasicMaterial({ map: t, toneMapped: false, side: THREE.DoubleSide }));
    const narrow = stage2.clientWidth / Math.max(1, stage2.clientHeight) < 0.8;
    m.position.set(x * (narrow ? 0.8 : 1), y, z);
    m.rotation.set(0.08, ry, (k - 1) * 0.08);
    if (narrow) m.scale.setScalar(0.8);
    rig.add(m);
    floats.push({ m, base: m.position.clone(), ph: k * 2.1 });
  });
  let visible = false, dirty = true, raf = 0, mx = 0, my = 0, tx = 0, ty = 0;
  const resize = () => {
    const r = stage2.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / Math.max(1, r.height);
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), halfW = camera.aspect < 0.8 ? 0.98 : 1.3, halfH = 1.68;
    camera.position.z = Math.max(halfH / t, halfW / (t * camera.aspect)) + 1;
    camera.updateProjectionMatrix();
    dirty = true;
    if (visible) {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      frame(performance.now());
    }
  };
  new ResizeObserver(resize).observe(stage2);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    kick();
  }).observe(stage2);
  stage2.addEventListener("pointermove", (e) => {
    const r = stage2.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5;
    my = (e.clientY - r.top) / r.height - 0.5;
    kick();
  });
  stage2.addEventListener("pointerleave", () => {
    mx = 0;
    my = 0;
    kick();
  });
  addEventListener("scroll", () => kick(), { passive: true });
  const t0 = performance.now();
  function frame(now) {
    raf = 0;
    if (!visible) return;
    const t = (now - t0) / 1e3, calm = still();
    const r = stage2.getBoundingClientRect(), p = (r.top + r.height / 2) / innerHeight - 0.5;
    tx += (mx - tx) * 0.08;
    ty += (my - ty) * 0.08;
    rig.rotation.y = (calm ? 0 : p * -0.7) + tx * 0.6 - 0.18;
    rig.rotation.x = ty * 0.35 + (calm ? 0 : Math.sin(t * 0.6) * 0.03);
    phone.position.y = calm ? 0 : Math.sin(t * 0.9) * 0.05;
    if (tag) tag.style.transform = `translate3d(${(tx * 26).toFixed(1)}px, ${((calm ? 0 : p * -90) + ty * 18 + (calm ? 0 : Math.sin(t * 1.1) * 6)).toFixed(1)}px, 0) rotate(${(-3 + tx * 4).toFixed(2)}deg)`;
    for (const f of floats) {
      f.m.position.y = f.base.y + (calm ? 0 : Math.sin(t * 0.8 + f.ph) * 0.08);
      if (f.spin) f.m.rotation.y = calm ? 0.3 : Math.sin(t * 0.7) * 0.6;
    }
    const k = calm ? 0 : (1 - Math.cos(Math.min(1, Math.max(0, (Math.sin(t * 0.22) + 0.75) / 1.5)) * Math.PI)) / 2;
    tex.offset.y = (1 - prof.viewH) * (1 - k);
    renderer.render(scene, camera);
    dirty = false;
    if (!calm) raf = requestAnimationFrame(frame);
  }
  function kick() {
    if (visible && !raf) raf = requestAnimationFrame(frame);
  }
  resize();
  renderer.compileAsync(scene, camera).catch(() => {
  });
}
const stage = document.querySelector(".ig-stage");
if (stage) {
  let go = () => {
    go = null;
    io.disconnect();
    init(stage);
  };
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) go?.();
  }, { rootMargin: "100% 0px" });
  io.observe(stage);
  window.hwWarm?.(() => go?.());
}
