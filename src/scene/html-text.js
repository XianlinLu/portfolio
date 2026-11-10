import * as THREE from "three";
const BIG_M = 0.35, LEAD_M = 0.077;
const sc = () => document.getElementById("scene");
const SW = () => sc()?.clientWidth || innerWidth, SH = () => sc()?.clientHeight || innerHeight;
function makeHtmlText(lead, big) {
  const el = document.createElement("h2");
  el.className = "wall-copy";
  el.innerHTML = `<span><span class="lead">${lead}</span></span><span><span class="big">${big}</span></span>`;
  document.body.appendChild(el);
  const lines = [...el.querySelectorAll(":scope > span > span")];
  return { el, lines, base: 1, state: { tr: "", rise: [], vis: null } };
}
const v = new THREE.Vector3(), w = new THREE.Vector3();
function pxPerMetre(camera, anchor) {
  v.copy(anchor).project(camera);
  w.copy(anchor).add(new THREE.Vector3(1, 0, 0)).project(camera);
  return Math.abs(w.x - v.x) * 0.5 * SW();
}
function sizeHtmlText(t, camera, anchor, portraitScale = 1) {
  const ppm = pxPerMetre(camera, anchor) * portraitScale;
  t.base = ppm;
  t.el.style.setProperty("--big", `${(BIG_M * ppm).toFixed(1)}px`);
  t.el.style.setProperty("--lead", `${(LEAD_M * ppm).toFixed(1)}px`);
  t.h = 0;
}
function placeHtmlText(t, camera, anchor, inT, outT, portraitScale = 1, room = null) {
  const s = t.state;
  const vis = inT > 0 && outT < 1;
  if (vis !== s.vis) {
    t.el.style.visibility = vis ? "visible" : "hidden";
    t.el.classList.toggle("live", vis);
    s.vis = vis;
  }
  if (!vis) return;
  v.copy(anchor).project(camera);
  const x = Math.round((v.x * 0.5 + 0.5) * SW()), y = Math.round((-v.y * 0.5 + 0.5) * SH());
  let k = pxPerMetre(camera, anchor) * portraitScale / t.base, yc = y;
  if (room) {
    if (!t.h) t.h = t.el.offsetHeight;
    const h = t.h * k;
    if (y - h / 2 < room.min) {
      const s2 = Math.max(0.6, Math.min(1, (room.max - room.min) / h));
      k *= s2;
      yc = Math.min(room.min + h * s2 / 2, room.max - h * s2 / 2);
    }
  }
  const tr = `translate3d(${x}px, ${Math.round(yc)}px, 0) translate(-50%, -50%)${Math.abs(k - 1) > 4e-3 ? ` scale(${k.toFixed(3)})` : ""}`;
  if (tr !== s.tr) {
    t.el.style.transform = tr;
    s.tr = tr;
  }
  t.lines.forEach((el, i) => {
    const up = 1 - Math.min(1, Math.max(0, inT * 1.6 - i * 0.6));
    const away = Math.min(1, Math.max(0, outT * 1.6 - (1 - i) * 0.6));
    const r = (up > 0 ? up : -away) * 110;
    const val = `${r.toFixed(1)}%`;
    if (val !== s.rise[i]) {
      el.style.setProperty("--rise", val);
      s.rise[i] = val;
    }
  });
}
export {
  makeHtmlText,
  placeHtmlText,
  sizeHtmlText
};
