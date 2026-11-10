const content = document.getElementById("content");
if (content) init();
function colourAt(x, y) {
  let el = document.elementFromPoint(x, y);
  if (el && el.closest(".nums-stage, .sw-formcard")) return "#3e5ff2";
  if (el && el.closest(".works")) return "#051727";
  for (; el; el = el.parentElement) {
    const b = getComputedStyle(el).backgroundColor;
    if (b && b !== "transparent" && !/rgba\(.*, 0\)$/.test(b)) return b;
  }
  return "#ffffff";
}
function init() {
  const html = document.documentElement;
  const still = () => html.classList.contains("reduce-motion");
  content.classList.add("js-motion");
  for (const el of content.querySelectorAll("[data-split]")) {
    const targets = el.querySelectorAll(".ln").length ? el.querySelectorAll(".ln") : [el];
    let i = 0, tiles = 0;
    const word = (text) => {
      const o = document.createElement("span");
      o.className = "w";
      const n = document.createElement("span");
      n.textContent = text;
      n.style.setProperty("--i", i++);
      o.appendChild(n);
      return o;
    };
    const split = (node) => {
      for (const ch of [...node.childNodes]) {
        if (ch.nodeType === 3) {
          const parts = ch.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          for (const part of parts) {
            if (!part) continue;
            frag.appendChild(/^\s+$/.test(part) ? document.createTextNode(" ") : word(part));
          }
          node.replaceChild(frag, ch);
        } else if (ch.classList && ch.classList.contains("tile")) {
          const o = document.createElement("span");
          o.className = "w w-tile";
          ch.style.setProperty("--i", i++);
          ch.style.setProperty("--r", ["-7deg", "5deg", "-3deg", "8deg"][tiles++ % 4]);
          node.replaceChild(o, ch);
          o.appendChild(ch);
        } else if (ch.nodeType === 1) split(ch);
      }
    };
    for (const t of targets) {
      t.normalize();
      split(t);
    }
  }
  for (const list of content.querySelectorAll(".sw-stats, .sw-list, .sw-nums, .sw-links")) {
    [...list.querySelectorAll("[data-reveal]")].forEach((el, i) => el.style.setProperty("--i", i % 8));
  }
  const count = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const to = Number(el.dataset.count), from = Number(el.dataset.from || 0), suf = el.dataset.suffix || "";
    if (still()) {
      el.textContent = to + suf;
      return;
    }
    const t0 = performance.now(), dur = 1500;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(2, -10 * t);
      el.textContent = Math.round(from + (to - from) * (t >= 1 ? 1 : e)) + (t >= 1 ? suf : "");
      if (t < 1) requestAnimationFrame(step);
    };
    el.textContent = from;
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("in");
      e.target.querySelectorAll("[data-count]").forEach(count);
      if (e.target.dataset.count) count(e.target);
      io.unobserve(e.target);
    }
  }, { rootMargin: "0px 0px -4% 0px", threshold: 0.05 });
  content.querySelectorAll("[data-split]:not([data-early]), [data-reveal], .num").forEach((el) => io.observe(el));
  const ioEarly = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) {
      e.target.classList.add("in");
      ioEarly.unobserve(e.target);
    }
  }, { rootMargin: "0px 0px 8% 0px", threshold: 0 });
  content.querySelectorAll("[data-early]").forEach((el) => ioEarly.observe(el));
  content.querySelectorAll("[data-count]").forEach((el) => {
    if (!el.closest("[data-reveal], [data-split]")) io.observe(el);
  });
  const drifters = [...content.querySelectorAll(".ln[data-drift], .sw-word .ln")];
  const pathList = content.querySelector(".sw-path");
  const stops = pathList ? [...pathList.querySelectorAll(".stop")] : [];
  const nums = content.querySelector(".sw-numbers"), numStage = nums && nums.querySelector(".nums-stage"), numTrack = nums && nums.querySelector(".nums-track");
  const top = document.querySelector(".top"), meshes = [...content.querySelectorAll("[data-mesh]")];
  const smooth = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  let raf = 0;
  const frame = () => {
    raf = 0;
    const vh = innerHeight, cr = content.getBoundingClientRect();
    if (cr.top > vh || cr.bottom < 0) return;
    if (!still()) {
      for (const el of drifters) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const p = (r.top + r.height / 2) / vh - 0.5;
        const k = Number(el.dataset.drift || (el.closest(".sw-word") ? 1.4 : 0));
        el.style.transform = `translate3d(${(-p * k * 7).toFixed(2)}vw, 0, 0)`;
      }
    }
    if (top) {
      const on = meshes.some((m) => {
        const q = m.getBoundingClientRect();
        return q.top <= 30 && q.bottom >= 30;
      });
      if (on !== top.classList.contains("on-color")) top.classList.toggle("on-color", on);
    }
    if (nums) {
      const r = nums.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const open = smooth(vh, 0, r.top);
        numStage.style.setProperty("--ins", `${((1 - open) * 7).toFixed(2)}vw`);
        numStage.style.setProperty("--rad", `${((1 - open) * 36).toFixed(1)}px`);
        const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
        const run = Math.max(0, numTrack.scrollWidth - innerWidth);
        const x = smooth(0.02, 0.56, p);
        numTrack.style.setProperty("--tx", `${(-run * x).toFixed(1)}px`);
        numStage.style.setProperty("--fade", smooth(0.56, 0.68, p).toFixed(3));
      }
    }
    if (pathList) {
      const r = pathList.getBoundingClientRect(), pen = vh * 0.62;
      const draw = Math.max(0, Math.min(r.height, pen - r.top));
      pathList.style.setProperty("--draw", `${draw.toFixed(1)}px`);
      const pad = parseFloat(getComputedStyle(stops[0]).paddingTop) || 60;
      for (const s of stops) s.classList.toggle("on", s.getBoundingClientRect().top + pad + 8 < pen);
    }
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  if (matchMedia("(hover: none), (pointer: coarse)").matches) setInterval(() => {
    if (document.hidden || !window.__setBarColor || content.getBoundingClientRect().top > 0) return;
    window.__setBarColor(colourAt(innerWidth / 2, 2));
  }, 300);
  footerWord(still);
  fitLines();
  briefForm();
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", kick);
  kick();
}
function footerWord(still) {
  const el = document.querySelector(".sw-word");
  if (!el) return;
  const text = el.textContent.trim();
  el.textContent = "";
  const chars = [...text].map((c) => {
    const s = document.createElement("span");
    s.className = c === "_" ? "ch us" : "ch";
    s.textContent = c;
    el.appendChild(s);
    return s;
  });
  const fit = () => {
    el.style.setProperty("--fs", "100px");
    const pad = parseFloat(getComputedStyle(el).paddingLeft) * 2;
    const lines = /* @__PURE__ */ new Map();
    for (const ch of chars) {
      if (!ch.offsetWidth) continue;
      const k2 = ch.offsetTop, l = lines.get(k2) || [Infinity, -Infinity];
      lines.set(k2, [Math.min(l[0], ch.offsetLeft), Math.max(l[1], ch.offsetLeft + ch.offsetWidth)]);
    }
    const w = Math.max(...[...lines.values()].map(([a, b]) => b - a));
    el.style.setProperty("--fs", `${(100 * (el.clientWidth - pad) / w * 0.995).toFixed(2)}px`);
  };
  let fitW = 0;
  const refit = () => {
    if (el.clientWidth !== fitW) {
      fitW = el.clientWidth;
      fit();
    }
  };
  document.fonts.ready.then(() => {
    fitW = 0;
    refit();
  });
  addEventListener("resize", refit);
  refit();
  const NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  const maps = [], noises = [];
  chars.forEach((c, i) => {
    const f = document.createElementNS(NS, "filter");
    f.id = `sw-warp-${i}`;
    f.setAttribute("x", "-20%");
    f.setAttribute("y", "-20%");
    f.setAttribute("width", "140%");
    f.setAttribute("height", "140%");
    const tu = document.createElementNS(NS, "feTurbulence");
    tu.setAttribute("type", "fractalNoise");
    tu.setAttribute("baseFrequency", "0.006 0.016");
    tu.setAttribute("numOctaves", "1");
    tu.setAttribute("seed", String(i * 7 + 3));
    tu.setAttribute("result", "n");
    const dm = document.createElementNS(NS, "feDisplacementMap");
    dm.setAttribute("in", "SourceGraphic");
    dm.setAttribute("in2", "n");
    dm.setAttribute("scale", "0");
    dm.setAttribute("xChannelSelector", "R");
    dm.setAttribute("yChannelSelector", "G");
    f.append(tu, dm);
    svg.appendChild(f);
    maps.push(dm);
    noises.push(tu);
  });
  document.body.appendChild(svg);
  const k = chars.map(() => 0), want = chars.map(() => 0);
  let mx = -1e4, my = -1e4, over = false, raf = 0, energy = 0, lx = 0, ly = 0, gain = 1;
  const tick = () => {
    raf = 0;
    const r = el.getBoundingClientRect(), R = r.height * 0.9;
    let moving = false;
    energy = energy * 0.92 + Math.min(1, Math.hypot(mx - lx, my - ly) / 30) * 0.35;
    lx = mx;
    ly = my;
    chars.forEach((c, i) => {
      const cr = c.getBoundingClientRect(), cx = cr.left + cr.width / 2, cy = cr.top + cr.height / 2;
      const d = Math.hypot(cx - mx, (cy - my) * 0.6);
      want[i] = over ? Math.exp(-(d * d) / (R * R)) : 0;
      k[i] += (want[i] - k[i]) * 0.18;
      if (Math.abs(want[i] - k[i]) > 2e-3) moving = true;
      const side = Math.max(-1, Math.min(1, (cx - mx) / R));
      const f = k[i] * gain;
      c.style.transform = `scale(${(1 - 0.12 * f).toFixed(3)}, ${(1 + 0.42 * f).toFixed(3)}) skewX(${(-side * 10 * f).toFixed(2)}deg)`;
      c.style.setProperty("--k", k[i].toFixed(3));
      const amt = k[i] * gain * Math.min(1, energy) * 85;
      maps[i].setAttribute("scale", amt.toFixed(1));
      if (amt > 0.3) {
        const t = performance.now() / 1e3;
        noises[i].setAttribute("baseFrequency", `${(6e-3 + Math.sin(t * 1.1 + i) * 15e-4).toFixed(4)} ${(0.016 + Math.cos(t * 0.9 + i) * 4e-3).toFixed(4)}`);
      }
      c.style.filter = amt > 0.3 ? `url(#sw-warp-${i})` : "";
    });
    if (moving || energy > 0.01) raf = requestAnimationFrame(tick);
  };
  const go = () => {
    if (!raf && !still()) raf = requestAnimationFrame(tick);
  };
  el.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    mx = e.clientX;
    my = e.clientY;
    over = true;
    go();
  });
  if (matchMedia("(hover: none), (pointer: coarse)").matches) {
    gain = 0.4;
    let seen = false, t0 = performance.now();
    new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      if (seen) auto();
    }).observe(el);
    const auto = () => {
      if (!seen || still()) return;
      const r = el.getBoundingClientRect(), t = (performance.now() - t0) / 1e3;
      mx = r.left + r.width * (0.5 + 0.48 * Math.sin(t * 0.7));
      my = r.top + r.height * (0.5 + 0.35 * Math.sin(t * 1.3));
      over = true;
      go();
      requestAnimationFrame(auto);
    };
  }
  el.addEventListener("pointerleave", () => {
    over = false;
    go();
  });
}
function fitLines() {
  const els = [...document.querySelectorAll("[data-fit]")];
  const fit = () => els.forEach((el) => {
    const w = el.clientWidth;
    const cs = getComputedStyle(el), w0 = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    el.querySelectorAll(".ln").forEach((ln) => {
      const parts = [...ln.querySelectorAll(".w2")];
      if (parts.length && getComputedStyle(parts[0]).display === "block") {
        ln.style.removeProperty("--fs");
        parts.forEach((p) => p.style.fontSize = "");
        return;
      }
      parts.forEach((p) => p.style.fontSize = "");
      ln.style.setProperty("--fs", "100px");
      const r = document.createRange();
      r.selectNodeContents(ln);
      const tw = r.getBoundingClientRect().width || 1;
      const cap = parseFloat(cs.fontSize) || Infinity;
      ln.style.setProperty("--fs", `${Math.min(cap, 100 * w / tw * 0.995).toFixed(2)}px`);
    });
  });
  let lastW = 0;
  const refit = () => {
    if (innerWidth !== lastW) {
      lastW = innerWidth;
      fit();
    }
  };
  document.fonts.ready.then(fit);
  addEventListener("resize", refit);
  fit();
}
function briefForm() {
  const form = document.getElementById("brief");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const note = form.querySelector(".f-note");
    note.textContent = (window.HW_LANG === "zh" ? "留言预览（尚未发送）：" : "Message preview (not sent): ") + d.get("name") + " — " + d.get("contact") + " — " + (d.get("task") || "");
  });
}
