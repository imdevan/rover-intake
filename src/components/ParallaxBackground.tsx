import { useEffect, useMemo, useRef } from "react";
import {
  faDog,
  faBone,
  faPaw,
  faBowlFood,
  faBaseball,
  faStar,
  faRainbow,
} from "@fortawesome/free-solid-svg-icons";
import { icon as renderIcon } from "@fortawesome/fontawesome-svg-core";

const ICONS = [faDog, faBone, faPaw, faBowlFood, faBaseball, faStar, faRainbow];

// Palette — pup-friendly, themed around the primary green.
const COLORS = [
  "#00bd70", // primary
  "#06d6a0",
  "#7ce0b0",
  "#ffd166",
  "#ef8354",
  "#4cc9f0",
  "#b388eb",
];

// Tunable ranges (no magic numbers in JSX)
const CFG = {
  cols: 6,
  rows: 12,
  jitter: 0.45, // 0..1 of a cell
  minScale: 0.5,
  maxScale: 2,
  scaleBias: 2.2, // > 1 weights toward smaller icons
  minRotation: -60,
  maxRotation: 60,
  minOpacity: 0.22,
  maxOpacity: 0.75,
  scrollMinMultiplier: 0.05,
  scrollMaxMultiplier: 0.35,
  scrollJitterMin: 0.8,
  scrollJitterMax: 1.1,
} as const;

// Deterministic PRNG so SSR and client agree
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

interface PlacedIcon {
  svg: string;
  xPct: string;
  yPct: string;
  scale: string;
  rotation: string;
  opacity: string;
  color: string;
  speed: number; // px per scroll px (kept as number for math, applied via JS only)
}

const fmt = (n: number, d = 3) => n.toFixed(d);

function generate(): PlacedIcon[] {
  const rng = mulberry32(0xb077e); // stable seed
  const out: PlacedIcon[] = [];
  const cellW = 100 / CFG.cols;
  const cellH = 100 / CFG.rows;
  for (let row = 0; row < CFG.rows; row++) {
    for (let col = 0; col < CFG.cols; col++) {
      const ic = ICONS[Math.floor(rng() * ICONS.length)];
      const color = COLORS[Math.floor(rng() * COLORS.length)];
      const baseX = (col + 0.5) * cellW;
      const baseY = (row + 0.5) * cellH;
      const jx = (rng() - 0.5) * cellW * CFG.jitter * 2;
      const jy = (rng() - 0.5) * cellH * CFG.jitter * 2;

      const t = Math.pow(rng(), CFG.scaleBias); // bias to small
      const scale = CFG.minScale + t * (CFG.maxScale - CFG.minScale);
      const rotation = CFG.minRotation + rng() * (CFG.maxRotation - CFG.minRotation);

      const scaleNorm = (scale - CFG.minScale) / (CFG.maxScale - CFG.minScale);
      const opacity = CFG.minOpacity + scaleNorm * (CFG.maxOpacity - CFG.minOpacity);
      const baseSpeed =
        CFG.scrollMinMultiplier + scaleNorm * (CFG.scrollMaxMultiplier - CFG.scrollMinMultiplier);
      const jitter = CFG.scrollJitterMin + rng() * (CFG.scrollJitterMax - CFG.scrollJitterMin);
      const speed = baseSpeed * jitter;

      const rendered = renderIcon(ic);
      if (!rendered) continue;
      out.push({
        svg: rendered.html.join(""),
        xPct: fmt(baseX + jx) + "%",
        yPct: fmt(baseY + jy) + "%",
        scale: fmt(scale),
        rotation: fmt(rotation, 2),
        opacity: fmt(opacity),
        color,
        speed,
      });
    }
  }
  return out;
}

export function ParallaxBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const items = useMemo(generate, []);

  useEffect(() => {
    let raf = 0;
    let lastY = -1;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;
      const nodes = itemRefs.current;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node) continue;
        const it = items[i];
        node.style.transform = `translate3d(0, ${-(y * it.speed).toFixed(1)}px, 0) rotate(${it.rotation}deg) scale(${it.scale})`;
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items]);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      data-testid="parallax-bg"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary-soft/30" />
      {items.map((it, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) itemRefs.current[i] = el;
          }}
          className="absolute flex h-12 w-12 items-center justify-center will-change-transform [&_svg]:h-full [&_svg]:w-full"
          style={{
            left: it.xPct,
            top: it.yPct,
            opacity: it.opacity,
            color: it.color,
            transform: `translate3d(0px, 0px, 0px) rotate(${it.rotation}deg) scale(${it.scale})`,
          }}
          dangerouslySetInnerHTML={{ __html: it.svg }}
        />
      ))}
    </div>
  );
}
