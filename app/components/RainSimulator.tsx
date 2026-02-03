"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ConfigPanel from "@/app/components/ConfigPanel";

export type RainAngle = "vertical" | "left" | "right";

export interface RainConfig {
  dropSize: number;
  color: string;
  quantity: number;
  speed: number;
  angle: RainAngle;
}

const STORAGE_KEY = "lluvia-config";

const NEON_COLORS = [
  { name: "Amarillo", value: "#EFFF00" },
  { name: "Verde", value: "#39FF14" },
  { name: "Cian", value: "#00FFFF" },
  { name: "Azul", value: "#00BFFF" },
  { name: "Violeta", value: "#BF00FF" },
  { name: "Rosa", value: "#FF10F0" },
  { name: "Rojo", value: "#FF073A" },
  { name: "Naranja", value: "#FF6600" },
];

const ANGLE_OPTIONS: RainAngle[] = ["vertical", "left", "right"];

const DEFAULT_CONFIG: RainConfig = {
  dropSize: 2,
  color: NEON_COLORS[0].value,
  quantity: 150,
  speed: 8,
  angle: "vertical",
};

function loadConfigFromStorage(): RainConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return DEFAULT_CONFIG;
    const c = parsed as Record<string, unknown>;
    const colorValues = NEON_COLORS.map((x) => x.value);
    const angle =
      typeof c.angle === "string" && ANGLE_OPTIONS.includes(c.angle as RainAngle)
        ? (c.angle as RainAngle)
        : DEFAULT_CONFIG.angle;
    return {
      dropSize: clamp(Number(c.dropSize), 1, 8) || DEFAULT_CONFIG.dropSize,
      color: typeof c.color === "string" && colorValues.includes(c.color)
        ? c.color
        : DEFAULT_CONFIG.color,
      quantity: clamp(Number(c.quantity), 20, 400) || DEFAULT_CONFIG.quantity,
      speed: clamp(Number(c.speed), 1, 15) || DEFAULT_CONFIG.speed,
      angle,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
}

export default function RainSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<RainConfig>(DEFAULT_CONFIG);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    setConfig(loadConfigFromStorage());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore quota / private mode
    }
  }, [config]);
  const dropsRef = useRef<Drop[]>([]);
  const animationRef = useRef<number>(0);

  const initDrops = useCallback(
    (width: number, height: number) => {
      const extend = height * Math.tan((30 * Math.PI) / 180);
      let xMin = 0;
      let xMax = width;
      if (config.angle === "left") {
        xMax = width + extend;
      } else if (config.angle === "right") {
        xMin = -extend;
      }
      const drops: Drop[] = [];
      const len = Math.min(config.quantity, 500);
      for (let i = 0; i < len; i++) {
        drops.push({
          x: xMin + Math.random() * (xMax - xMin),
          y: Math.random() * height,
          length: 8 + config.dropSize * 4,
          speed: 4 + config.speed * 2,
        });
      }
      return drops;
    },
    [config.quantity, config.dropSize, config.speed, config.angle]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dropsRef.current = initDrops(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, [initDrops, config.quantity, config.dropSize, config.speed, config.angle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    const angleRad = (30 * Math.PI) / 180;
    const cos30 = Math.cos(angleRad);
    const sin30 = Math.sin(angleRad);

    const animate = () => {
      if (cancelled) return;

      const dropLen = 8 + config.dropSize * 4;
      const dropSpeed = 4 + config.speed * 2;
      const lineWidth = Math.max(1, config.dropSize);
      const w = canvas.width;
      const h = canvas.height;

      let dx = 0;
      let dy = dropSpeed;
      let endDx = 0;
      let endDy = dropLen;
      if (config.angle === "left") {
        dx = -dropSpeed * sin30;
        dy = dropSpeed * cos30;
        endDx = -dropLen * sin30;
        endDy = dropLen * cos30;
      } else if (config.angle === "right") {
        dx = dropSpeed * sin30;
        dy = dropSpeed * cos30;
        endDx = dropLen * sin30;
        endDy = dropLen * cos30;
      }

      ctx.fillStyle = "rgba(10, 10, 10, 0.12)";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = config.color;
      ctx.lineWidth = lineWidth;
      ctx.shadowBlur = 15;
      ctx.shadowColor = config.color;

      const extend = h * sin30 / cos30;
      let respawnXMin = 0;
      let respawnXMax = w;
      if (config.angle === "left") {
        respawnXMax = w + extend;
      } else if (config.angle === "right") {
        respawnXMin = -extend;
      }

      const drops = dropsRef.current;
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.x += dx;
        d.y += dy;
        const offTop = d.y < -30;
        const offBottom = d.y > h + 20;
        const offLeft = d.x < respawnXMin - 20;
        const offRight = d.x > respawnXMax + 20;
        if (offTop || offBottom || offLeft || offRight) {
          d.y = -20 - Math.random() * 40;
          d.x = respawnXMin + Math.random() * (respawnXMax - respawnXMin);
        }

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + endDx, d.y + endDy);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelled = true;
      cancelAnimationFrame(animationRef.current);
    };
  }, [config.color, config.dropSize, config.speed, config.angle]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />

      <button
        type="button"
        onClick={() => setPanelOpen((o) => !o)}
        className="fixed top-4 right-4 z-20 px-4 py-2 rounded-lg bg-black/80 border border-cyan-500/50 text-cyan-400 text-sm font-medium shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] transition-shadow"
        aria-label={panelOpen ? "Cerrar configuración" : "Abrir configuración"}
      >
        {panelOpen ? "Cerrar panel" : "Configuración"}
      </button>

      <ConfigPanel
        open={panelOpen}
        config={config}
        setConfig={setConfig}
        colors={NEON_COLORS}
        angleOptions={ANGLE_OPTIONS}
      />
    </div>
  );
}
