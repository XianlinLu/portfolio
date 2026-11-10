const btn = document.getElementById("snd");
if (btn) {
  const KEY = "hw-music", VOL = 0.32;
  let off = false;
  try {
    off = localStorage.getItem(KEY) === "off";
  } catch {
  }
  const audio = new Audio("/assets/audio/ambient.mp3");
  audio.loop = true;
  audio.preload = "none";
  audio.crossOrigin = "anonymous";
  let ctx = null, gain = null, on = false, want = false, primed = false, started = false;
  try {
    if (navigator.audioSession) navigator.audioSession.type = "playback";
  } catch {
  }
  const graph = () => {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    gain = ctx.createGain();
    gain.gain.value = 0;
    ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
    if (!audio.paused) {
      gain.gain.value = VOL;
      audio.volume = 1;
    }
  };
  const fade = (to, sec) => {
    if (!gain) {
      audio.volume = to;
      return;
    }
    const t = ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.linearRampToValueAtTime(to, t + sec);
  };
  const show = () => {
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", on ? L("", "Turn the music off") : L("", "Turn the music on"));
  };
  const fadeIn = () => {
    on = true;
    started = true;
    show();
    fade(VOL, 2.5);
  };
  const play = () => {
    if (started && !audio.paused) return;
    graph();
    if (ctx && ctx.state === "suspended") ctx.resume();
    if (gain) audio.volume = 1;
    audio.play().then(fadeIn).catch(() => {
    });
  };
  const stop = () => {
    on = false;
    show();
    fade(0, 0.6);
    setTimeout(() => {
      if (!on) audio.pause();
    }, 650);
  };
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (on) {
      stop();
      off = true;
    } else {
      play();
      off = false;
    }
    try {
      localStorage.setItem(KEY, off ? "off" : "on");
    } catch {
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (!on || !started) return;
    if (document.hidden) audio.pause();
    else audio.play().catch(() => {
    });
  });
  window.hwMusic = {
    play() {
      off = false;
      try {
        localStorage.setItem(KEY, "on");
      } catch {
      }
      play();
    },
    start() {
      if (!off) {
        want = true;
        play();
      }
    },
    // plugging the PC in: on, unless the visitor muted it
    mute() {
      off = true;
      try {
        localStorage.setItem(KEY, "off");
      } catch {
      }
      if (on) stop();
      else {
        on = false;
        show();
      }
    }
  };
  on = !off;
  show();
  const SFX = ["click", "start", "next", "error", "done", "riser"], bufs = {};
  // Small, local Web Audio cues keep every interaction audible without external requests.
  const load = (name) => {
    const duration = name === "riser" ? 5 : name === "click" ? .06 : .42;
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
    const samples = buffer.getChannelData(0);
    const tones = {click:800,start:440,next:660,error:180,done:880,riser:220};
    for (let i=0;i<samples.length;i++) {
      const t=i/ctx.sampleRate, progress=t/duration;
      const phase=2*Math.PI*(tones[name]*t+(name==="riser"?160*t*t:0));
      const envelope=Math.min(t/.008,1)*(name==="riser"?.22:Math.pow(1-progress,3)*.45);
      samples[i]=Math.sin(phase)*envelope;
    }
    bufs[name]=buffer;
    return Promise.resolve(buffer);
  };
  let loading = null;
  window.hwSfx = (name, vol = 0.3) => {
    if (off) return;
    graph();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    if (!loading) loading = Promise.all(SFX.map(load));
    const go = () => {
      const b = bufs[name];
      if (!b) return;
      const src = ctx.createBufferSource(), g = ctx.createGain();
      g.gain.value = vol;
      src.buffer = b;
      src.connect(g).connect(ctx.destination);
      src.start();
    };
    bufs[name] ? go() : loading.then(go);
  };
  let rsrc = null, rgain = null;
  window.hwRiser = {
    start(frac = 0) {
      if (off) return;
      graph();
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();
      if (!loading) loading = Promise.all(SFX.map(load));
      const go = () => {
        const b = bufs.riser;
        if (!b) return;
        this.stop(0.05);
        rsrc = ctx.createBufferSource();
        rgain = ctx.createGain();
        rsrc.buffer = b;
        rgain.gain.setValueAtTime(0, ctx.currentTime);
        rgain.gain.linearRampToValueAtTime(0.42, ctx.currentTime + 0.12);
        rsrc.connect(rgain).connect(ctx.destination);
        rsrc.start(0, Math.min(b.duration - 0.05, frac * b.duration));
      };
      bufs.riser ? go() : loading.then(go);
    },
    stop(sec = 0.35) {
      if (!rsrc) return;
      const s = rsrc, g = rgain, t = ctx.currentTime;
      rsrc = null;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0, t + sec);
      s.stop(t + sec + 0.02);
    }
  };
  const unlock = () => {
    if (off) return;
    graph();
    if (!ctx) return;
    if (ctx.state !== "running") ctx.resume().catch(() => {
    });
    if (!loading) loading = Promise.all(SFX.map(load));
    if (want) {
      if (audio.paused) play();
    } else if (!primed && audio.paused) {
      primed = true;
      audio.play().then(() => {
        if (want) {
          if (!started) fadeIn();
        } else audio.pause();
      }).catch(() => primed = false);
    }
  };
  ["pointerdown", "pointerup", "click", "keydown"].forEach((t) => addEventListener(t, unlock, { capture: true, passive: true }));
  addEventListener("pointerdown", () => {
    if (!off) {
      graph();
      if (ctx && !loading) loading = Promise.all(SFX.map(load));
    }
  }, { once: true, capture: true });
}
