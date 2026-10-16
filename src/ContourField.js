import React, { useEffect, useRef } from "react";

// Interactive topographic contour map drawn with a WebGL fragment shader.
// The pointer raises a peak in the terrain; a click or tap drops a ripple.
// Colors follow the active theme. Respects prefers-reduced-motion.

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseAmp;
uniform vec4 uRipples[4];
uniform vec3 uBg;
uniform vec3 uInk;
uniform float uIntro;
uniform float uStrength;
uniform float uNarrow;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float gnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i), f), dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) { v += a * gnoise(p); p = m * p; a *= 0.42; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.y;
  vec2 n = gl_FragCoord.xy / uRes;
  float t = uTime * 0.025;
  vec2 p = uv * 0.9;
  float h = fbm(p + vec2(t, -0.6 * t)) + 0.14 * fbm(p * 1.7 - vec2(1.3 * t, t) + 7.0);

  vec2 m = uMouse / uRes.y;
  float d = length(uv - m);
  h += uMouseAmp * 0.5 * exp(-d * d / 0.04);

  for (int i = 0; i < 4; i++) {
    vec4 r = uRipples[i];
    float age = uTime - r.z;
    if (r.w > 0.0 && age > 0.0 && age < 3.5) {
      float dr = length(uv - r.xy / uRes.y);
      float front = dr - age * 0.32;
      h += 0.07 * r.w * sin(front * 46.0) * exp(-front * front * 60.0) * (1.0 - age / 3.5);
    }
  }

  h *= uIntro;
  float lv = h * 13.0;
  float w = fwidth(lv);
  float fl = fract(lv);
  float minor = 1.0 - smoothstep(0.0, w * 1.3, min(fl, 1.0 - fl));
  float l5 = lv / 5.0;
  float f5 = fract(l5);
  float major = 1.0 - smoothstep(0.0, fwidth(l5) * 2.2, min(f5, 1.0 - f5));
  float ink = max(minor * 0.45, major * 0.95);

  // Quiet the lines behind the text: left side on wide screens, top on narrow ones.
  float wide = smoothstep(0.08, 0.62, n.x);
  float tall = smoothstep(0.92, 0.42, n.y);
  float zone = mix(wide, tall, uNarrow);
  float fade = mix(0.28, 1.0, zone);
  float glow = 1.0 + 0.9 * uMouseAmp * exp(-d * d / 0.05);
  ink *= fade * glow * uStrength;

  gl_FragColor = vec4(mix(uBg, uInk, clamp(ink, 0.0, 1.0)), 1.0);
}
`;

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  return [0, 2, 4].map(i => parseInt(v.slice(i, i + 2), 16) / 255);
}

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    // eslint-disable-next-line no-console
    console.warn(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

export default function ContourField({ bg, ink, dark, onInteract }) {
  const canvasRef = useRef(null);
  const colorRef = useRef({ bg, ink, dark });
  colorRef.current = { bg, ink, dark };
  const interactRef = useRef(onInteract);
  interactRef.current = onInteract;

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas.parentElement;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false, alpha: false });
    if (!gl || !gl.getExtension("OES_standard_derivatives")) {
      canvas.style.display = "none";
      return undefined;
    }
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.style.display = "none"; return undefined; }
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = name => gl.getUniformLocation(prog, name);
    const u = {
      res: U("uRes"), time: U("uTime"), mouse: U("uMouse"), amp: U("uMouseAmp"),
      ripples: U("uRipples"), bg: U("uBg"), ink: U("uInk"), intro: U("uIntro"),
      strength: U("uStrength"), narrow: U("uNarrow"),
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = {
      w: 1, h: 1, dpr: 1,
      mouse: [0, 0], target: [0, 0], amp: 0, ampTarget: 0,
      ripples: new Float32Array(16), nextRipple: 0,
      start: performance.now(), visible: true, raf: 0, dirty: true,
    };

    const resize = () => {
      const r = host.getBoundingClientRect();
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      state.dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
      state.w = Math.max(1, Math.round(r.width * state.dpr));
      state.h = Math.max(1, Math.round(r.height * state.dpr));
      canvas.width = state.w;
      canvas.height = state.h;
      gl.viewport(0, 0, state.w, state.h);
      if (state.mouse[0] === 0 && state.mouse[1] === 0) {
        state.mouse = [state.w * 0.72, state.h * 0.5];
        state.target = [...state.mouse];
      }
      state.dirty = true;
    };

    const toLocal = e => {
      const r = canvas.getBoundingClientRect();
      return [(e.clientX - r.left) * state.dpr, (r.bottom - e.clientY) * state.dpr];
    };
    const onMove = e => {
      state.target = toLocal(e);
      state.ampTarget = 1;
      state.dirty = true;
      if (interactRef.current) interactRef.current();
    };
    const onLeave = () => { state.ampTarget = 0; state.dirty = true; };
    const onDown = e => {
      if (reduce || (e.target.closest && e.target.closest("a,button"))) return;
      const [x, y] = toLocal(e);
      const i = state.nextRipple * 4;
      state.ripples[i] = x; state.ripples[i + 1] = y;
      state.ripples[i + 2] = (performance.now() - state.start) / 1000;
      state.ripples[i + 3] = 1;
      state.nextRipple = (state.nextRipple + 1) % 4;
      if (interactRef.current) interactRef.current();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    const onTheme = () => { state.dirty = true; };
    canvas.addEventListener("themechange", onTheme);
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible) loop();
    });
    io.observe(host);
    const onVis = () => { if (!document.hidden) loop(); };
    document.addEventListener("visibilitychange", onVis);

    function draw(now) {
      const t = reduce ? 12.0 : (now - state.start) / 1000;
      const introT = reduce ? 1 : Math.min(1, (now - state.start) / 1800);
      const intro = 1 - Math.pow(1 - introT, 3);
      const k = reduce ? 1 : 0.08;
      state.mouse[0] += (state.target[0] - state.mouse[0]) * k;
      state.mouse[1] += (state.target[1] - state.mouse[1]) * k;
      state.amp += (state.ampTarget - state.amp) * (reduce ? 1 : 0.05);
      const { bg: b, ink: c, dark: dk } = colorRef.current;
      gl.uniform2f(u.res, state.w, state.h);
      gl.uniform1f(u.time, t);
      gl.uniform2f(u.mouse, state.mouse[0], state.mouse[1]);
      gl.uniform1f(u.amp, state.amp);
      gl.uniform4fv(u.ripples, state.ripples);
      gl.uniform3fv(u.bg, hexToRgb(b));
      gl.uniform3fv(u.ink, hexToRgb(c));
      gl.uniform1f(u.intro, 0.25 + 0.75 * intro);
      gl.uniform1f(u.strength, dk ? 0.5 : 0.42);
      gl.uniform1f(u.narrow, state.w / state.h < 0.9 ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      state.dirty = false;
    }

    function loop() {
      cancelAnimationFrame(state.raf);
      const tick = now => {
        if (!state.visible || document.hidden) return;
        if (!reduce || state.dirty) draw(now);
        state.raf = requestAnimationFrame(tick);
      };
      state.raf = requestAnimationFrame(tick);
    }
    loop();

    return () => {
      cancelAnimationFrame(state.raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("themechange", onTheme);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      io.disconnect();
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, []);

  // Theme changes need a redraw even when reduced motion has paused the loop.
  useEffect(() => {
    const c = canvasRef.current;
    if (c) c.dispatchEvent(new Event("themechange"));
  }, [bg, ink, dark]);

  return <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />;
}
