import * as THREE from "three";
const LW = 360, LH = 270, K = 4;
const NAVY = "#051727", INK = "#d0e8ff", DIM = "#3d5a78", BLUE = "#0a8cff", WHITE = "#ffffff";
const MONITOR = [
  "..XXXXXXXXXXXXXXXXXX..",
  ".X..................X.",
  ".X.SSSSSSSSSSSSSSSS.X.",
  ".X.SSSSSSSSSSSSSSSS.X.",
  ".X.SSSSSSSSSSSSSSSS.X.",
  ".X.SSSSSSSSSSSSSSSS.X.",
  ".X.SSSSSSSSSSSSSSSS.X.",
  ".X.SSSSSSSSSSSSSSSS.X.",
  ".X.SSSSSSSSSSSSSSSS.X.",
  ".X.SSSSSSSSSSSSSSSS.X.",
  ".X.SSSSSSSSSSSSSSSS.X.",
  ".X..................X.",
  ".X...............XX.X.",
  "..XXXXXXXXXXXXXXXXXX..",
  "........X....X........",
  "........X....X........",
  ".....XXXXXXXXXXXX.....",
  "....XXXXXXXXXXXXXX...."
];
const GLOBE = [
  ".......XXXXXX.......",
  ".....XX..X..XX......",
  "....X...X.X...X.....",
  "...X...X...X...X....",
  "..XXXXXXXXXXXXXXX...",
  "..X...X.....X...X...",
  ".X....X.....X....X..",
  ".X....X.....X....X..",
  ".XXXXXXXXXXXXXXXXX..",
  ".X....X.....X....X..",
  ".X....X.....X....X..",
  "..X...X.....X...X...",
  "..XXXXXXXXXXXXXXX...",
  "...X...X...X...X....",
  "....X...X.X...X.....",
  ".....XX..X..XX......",
  ".......XXXXXX......."
];
const PLUG = [
  // ethernet plug, pointing right
  "XXXXXXX..",
  "XBBBBBXXX",
  "XBBBBBX.X",
  "XBBBBBXXX",
  "XXXXXXX.."
];
const P = 3;
const FONT = {
  "B": [
    "#####.",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#####.",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#####."
  ],
  "D": [
    "####..",
    "#...#.",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#...#.",
    "####.."
  ],
  "G": [
    ".####.",
    "#....#",
    "#.....",
    "#.....",
    "#.....",
    "#..###",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    ".####."
  ],
  "L": [
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "######"
  ],
  "N": [
    "#....#",
    "##...#",
    "##...#",
    "#.#..#",
    "#.#..#",
    "#..#.#",
    "#..#.#",
    "#...##",
    "#...##",
    "#....#",
    "#....#"
  ],
  "R": [
    "#####.",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#####.",
    "#.#...",
    "#..#..",
    "#...#.",
    "#....#",
    "#....#"
  ],
  "A": [
    ".####.",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "######",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#....#"
  ],
  "C": [
    ".####.",
    "#....#",
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "#....#",
    ".####."
  ],
  "E": [
    "######",
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "#####.",
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "######"
  ],
  "H": [
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "######",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#....#"
  ],
  "I": [
    ".###..",
    "..#...",
    "..#...",
    "..#...",
    "..#...",
    "..#...",
    "..#...",
    "..#...",
    "..#...",
    "..#...",
    ".###.."
  ],
  "O": [
    ".####.",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    ".####."
  ],
  "T": [
    "#####.",
    "..#...",
    "..#...",
    "..#...",
    "..#...",
    "..#...",
    "..#...",
    "..#...",
    "..#...",
    "..#...",
    "..#..."
  ],
  "P": [
    "#####.",
    "#....#",
    "#....#",
    "#....#",
    "#....#",
    "#####.",
    "#.....",
    "#.....",
    "#.....",
    "#.....",
    "#....."
  ],
  "K": [
    "#....#",
    "#...#.",
    "#..#..",
    "#.#...",
    "##....",
    "##....",
    "#.#...",
    "#..#..",
    "#...#.",
    "#....#",
    "#....#"
  ]
};
function pixelString(h, text, cx, y, u, color) {
  if (window.PORTFOLIO_LANG === "zh") {
    h.save();
    h.font = `${u * 10}px sans-serif`;
    h.textAlign = "center";
    h.fillStyle = color;
    h.fillText(text, cx, y + u * 9);
    h.restore();
    return;
  }
  const narrow = (c) => c === "I";
  const adv = (c) => (c === " " ? 4 : narrow(c) ? 5 : 7) * u;
  const w = [...text].reduce((t, c) => t + adv(c), 0) - u;
  let x = Math.round(cx - w / 2);
  h.fillStyle = color;
  for (const c of text) {
    const gl = FONT[c];
    const ox = narrow(c) ? x - u : x;
    if (gl) gl.forEach((row, j) => [...row].forEach((p, i) => {
      if (p === "#") h.fillRect(ox + i * u, y + j * u, u, u);
    }));
    x += adv(c);
  }
}
function sprite(g, rows, x, y, colors) {
  rows.forEach((r, j) => [...r].forEach((c, i) => {
    if (colors[c]) {
      g.fillStyle = colors[c];
      g.fillRect(x + i * P, y + j * P, P, P);
    }
  }));
}
function cable(g, a, b, sag, color) {
  const mx = (a.x + b.x) / 2, my = Math.max(a.y, b.y) + sag;
  const n = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) * 1.4) + 8;
  g.fillStyle = color;
  for (let k = 0; k <= n; k++) {
    const t = k / n, u = 1 - t;
    const x = u * u * a.x + 2 * u * t * mx + t * t * b.x, y = u * u * a.y + 2 * u * t * my + t * t * b.y;
    g.fillRect(Math.round(x), Math.round(y), 2, 2);
  }
}
const CONNECT = {
  mon: { x: 58, y: 86 },
  port: { x: 58 + 22 * P, y: 86 + 6 * P },
  // cable leaves the monitor's right side
  globe: { x: 228, y: 92 },
  socket: { x: 222, y: 92 + 8 * P + 1 },
  // socket on the globe's left
  rest: { x: 112, y: 168 }
  // where the plug hangs before it is taken
};
function makeConnectScreen() {
  const lo = document.createElement("canvas");
  lo.width = LW;
  lo.height = LH;
  const g = lo.getContext("2d");
  const hi = document.createElement("canvas");
  hi.width = LW * K;
  hi.height = LH * K;
  const h = hi.getContext("2d");
  h.imageSmoothingEnabled = false;
  const tex = new THREE.CanvasTexture(hi);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;
  tex.anisotropy = 8;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  const cap = document.createElement("canvas");
  cap.width = hi.width;
  cap.height = hi.height;
  const ch = cap.getContext("2d");
  pixelString(ch, L("", "DRAG THE CABLE"), LW * K / 2, 752, 8, "#cfe3f7");
  pixelString(ch, L("", "TO GO ONLINE"), LW * K / 2, 880, L(5, 6), "#a9c6e4");
  let lastKey = "";
  function draw({ plug = CONNECT.rest, near = 0, done = false, time = 0 } = {}) {
    const key = done ? "" : Math.round(plug.x) + "," + Math.round(plug.y) + "," + (near > 0.15) + (near > 0.6);
    if (key && key === lastKey && near <= 0.15) return;
    lastKey = key;
    g.fillStyle = NAVY;
    g.fillRect(0, 0, LW, LH);
    sprite(g, MONITOR, CONNECT.mon.x, CONNECT.mon.y, { X: INK, S: done ? BLUE : "#0b2a48" });
    if (!done) {
      g.fillStyle = near > 0.15 ? INK : DIM;
      for (let x = 140; x < 202; x += 8) g.fillRect(x, 116, 4, 2);
      for (let k = 0; k < 6; k++) {
        g.fillRect(202 + k, 110 + k, 2, 2);
        g.fillRect(202 + k, 122 - k, 2, 2);
      }
    }
    const gc = done ? WHITE : near > 0.15 ? INK : DIM;
    if (done) {
      g.fillStyle = "#0a3f7a";
      g.fillRect(CONNECT.globe.x + 2 * P, CONNECT.globe.y + 2 * P, 15 * P, 13 * P);
    }
    sprite(g, GLOBE, CONNECT.globe.x, CONNECT.globe.y, { X: gc });
    if (!done && near > 0.15) {
      const r = 34 + Math.sin(time * 6) * 3, cx = CONNECT.globe.x + 10 * P, cy = CONNECT.globe.y + 8.5 * P;
      g.fillStyle = BLUE;
      for (let a = 0; a < Math.PI * 2; a += 0.09) g.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), 2, 2);
    }
    g.fillStyle = done || near > 0.6 ? BLUE : NAVY;
    g.fillRect(CONNECT.socket.x - 4, CONNECT.socket.y - 6, 8, 12);
    g.fillStyle = gc;
    g.fillRect(CONNECT.socket.x - 6, CONNECT.socket.y - 8, 12, 2);
    g.fillRect(CONNECT.socket.x - 6, CONNECT.socket.y + 6, 12, 2);
    g.fillRect(CONNECT.socket.x - 6, CONNECT.socket.y - 8, 2, 16);
    g.fillRect(CONNECT.socket.x + 4, CONNECT.socket.y - 8, 2, 16);
    const end = done ? { x: CONNECT.socket.x - 27, y: CONNECT.socket.y - 7 } : plug;
    cable(g, CONNECT.port, { x: end.x, y: end.y + 7 }, done ? 6 : 26 - near * 14, done ? BLUE : INK);
    sprite(g, PLUG, end.x, end.y, { X: INK, B: BLUE });
    if (done) {
      g.fillStyle = WHITE;
      for (let k = 0; k < 3; k++) {
        const t = (time * 0.8 + k / 3) % 1;
        g.fillRect(Math.round(CONNECT.port.x + (end.x - CONNECT.port.x) * t), Math.round(CONNECT.port.y + 6 + 8 * Math.sin(t * Math.PI)), 3, 3);
      }
    }
    h.clearRect(0, 0, hi.width, hi.height);
    h.drawImage(lo, 0, 0, hi.width, hi.height);
    h.drawImage(cap, 0, 0);
    tex.needsUpdate = true;
  }
  draw();
  return { tex, draw, size: { w: LW, h: LH } };
}
export {
  CONNECT,
  makeConnectScreen
};
