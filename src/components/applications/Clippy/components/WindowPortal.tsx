import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface WindowPortalProps {
  children: React.ReactNode;
  /** Alto > Ancho: portrait */
  width?: number;   // default 400
  height?: number;  // default 700
  /** Separación desde bordes del viewport */
  bottom?: number;  // default 40
  right?: number;   // default 20
  /** Controla sólo pointer-events, no desmontar */
  active?: boolean; // default false
}

export function WindowPortal({
  children,
  width = 400,
  height = 700,
  bottom = 40,
  right = 20,
  active = false,
}: WindowPortalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ── Crea el <div> UNA sola vez ──
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "clippy-portal";
    el.style.position = "fixed";
    el.style.bottom   = `${bottom}px`;
    el.style.right    = `${right}px`;
    el.style.width    = `${width}px`;
    el.style.height   = `${height}px`;
    el.style.zIndex   = "9999";
    document.body.appendChild(el);
    containerRef.current = el;
    return () => {
      if (containerRef.current) {
        document.body.removeChild(containerRef.current);
      }
    };
  }, [bottom, right, width, height]);  // OMITIMOS `active`

  // ── Sólo habilita/deshabilita interactividad ──
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.pointerEvents = active ? "auto" : "none";
    }
  }, [active]);

  if (!containerRef.current) return null;
  return createPortal(children, containerRef.current);
}
