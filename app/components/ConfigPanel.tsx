"use client";

import type { RainConfig, RainAngle } from "./RainSimulator";

interface ColorOption {
  name: string;
  value: string;
}

interface ConfigPanelProps {
  open: boolean;
  config: RainConfig;
  setConfig: React.Dispatch<React.SetStateAction<RainConfig>>;
  colors: ColorOption[];
  angleOptions: RainAngle[];
}

const ANGLE_LABELS: Record<RainAngle, string> = {
  vertical: "Vertical",
  left: "30° izquierda",
  right: "30° derecha",
};

function AngleIcon({ angle }: { angle: RainAngle }) {
  if (angle === "vertical") {
    return (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" stroke="currentColor" strokeWidth={2}>
        <line x1="12" y1="2" x2="12" y2="22" />
      </svg>
    );
  }
  if (angle === "left") {
    return (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" stroke="currentColor" strokeWidth={2}>
        <line x1="18" y1="4" x2="6" y2="20" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" stroke="currentColor" strokeWidth={2}>
      <line x1="6" y1="4" x2="18" y2="20" />
    </svg>
  );
}

export default function ConfigPanel({
  open,
  config,
  setConfig,
  colors,
  angleOptions,
}: ConfigPanelProps) {
  return (
    <div
      className={`fixed top-0 right-0 z-10 h-full w-80 max-w-[90vw] bg-black/95 border-l border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.15)] flex flex-col transition-transform duration-300 ease-out ${
        open ? "translate-x-0" : "translate-x-full pointer-events-none"
      }`}
      role="dialog"
      aria-label="Panel de configuración de lluvia"
    >
      <div className="p-4 border-b border-cyan-500/30">
        <h2 className="text-lg font-semibold text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]">
          Configuración
        </h2>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-cyan-300/90 mb-2">
            Ángulo de caída
          </label>
          <div className="flex gap-2">
            {(["left", "vertical", "right"] as const).map((angle) => (
              <button
                key={angle}
                type="button"
                onClick={() => setConfig((c) => ({ ...c, angle }))}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg border-2 transition-all ${
                  config.angle === angle
                    ? "border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.5)]"
                    : "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                }`}
                title={ANGLE_LABELS[angle]}
                aria-label={ANGLE_LABELS[angle]}
              >
                <AngleIcon angle={angle} />
                <span className="text-xs">{ANGLE_LABELS[angle].replace("30° ", "")}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300/90 mb-2">
            Tamaño de gotas
          </label>
          <input
            type="range"
            min={1}
            max={8}
            value={config.dropSize}
            onChange={(e) =>
              setConfig((c) => ({ ...c, dropSize: Number(e.target.value) }))
            }
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-800 accent-cyan-500"
          />
          <span className="block text-right text-cyan-400/80 text-sm mt-1">
            {config.dropSize}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300/90 mb-2">
            Color (neón)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {colors.map(({ name, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setConfig((c) => ({ ...c, color: value }))}
                className={`h-9 rounded-md border-2 transition-all ${
                  config.color === value
                    ? "border-cyan-400 shadow-[0_0_12px] scale-105"
                    : "border-gray-600 hover:border-gray-500"
                }`}
                style={{
                  backgroundColor: value,
                  boxShadow: config.color === value ? `0 0 12px ${value}` : undefined,
                }}
                title={name}
                aria-label={`Color ${name}`}
              />
            ))}
          </div>
          <p className="text-cyan-400/70 text-xs mt-2">
            {colors.find((c) => c.value === config.color)?.name ?? "Amarillo"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300/90 mb-2">
            Cantidad de gotas
          </label>
          <input
            type="range"
            min={20}
            max={400}
            step={10}
            value={config.quantity}
            onChange={(e) =>
              setConfig((c) => ({ ...c, quantity: Number(e.target.value) }))
            }
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-800 accent-cyan-500"
          />
          <span className="block text-right text-cyan-400/80 text-sm mt-1">
            {config.quantity}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-300/90 mb-2">
            Velocidad
          </label>
          <input
            type="range"
            min={1}
            max={15}
            value={config.speed}
            onChange={(e) =>
              setConfig((c) => ({ ...c, speed: Number(e.target.value) }))
            }
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-800 accent-cyan-500"
          />
          <span className="block text-right text-cyan-400/80 text-sm mt-1">
            {config.speed}
          </span>
        </div>
      </div>
    </div>
  );
}
