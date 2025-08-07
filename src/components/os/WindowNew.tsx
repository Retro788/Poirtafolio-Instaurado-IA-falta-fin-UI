import React, { 
  useState, 
  useRef, 
  useCallback, 
  ReactNode, 
  HTMLAttributes, 
} from 'react';
import type { MouseEvent } from 'react'; 
import './window.css'; 

interface Size  { width: number; height: number; } 
interface Props extends HTMLAttributes<HTMLDivElement> { 
  title:       string; 
  initialSize: Size; 
  minSize?:    Size; 
  children:    ReactNode; 
} 

/* pequeño helper para evitar los "undefined" */ 
const safe = (value: number | undefined) => value ?? 0; 

export const Window: React.FC<Props> = ({ 
  title, 
  initialSize, 
  minSize = { width: 300, height: 200 }, 
  children, 
  style, 
  ...rest 
}) => { 
  /* estado local para drag / resize */ 
  const [size, setSize] = useState<Size>(initialSize); 
  const [pos,  setPos]  = useState({ x: 0, y: 0 }); 
  const dragging   = useRef(false); 
  const resizing   = useRef(false); 
  const lastPoint  = useRef({ x: 0, y: 0 }); 

  /* ——— Drag ——— */ 
  const onMouseDownTitle = (e: MouseEvent) => { 
    dragging.current = true; 
    lastPoint.current = { x: e.clientX, y: e.clientY }; 
    window.addEventListener('mousemove', onMouseMoveTitle as unknown as EventListener); 
    window.addEventListener('mouseup',   onMouseUpGlobal as unknown as EventListener, { once: true }); 
  }; 

  const onMouseMoveTitle = useCallback((e: MouseEvent) => { 
    if (!dragging.current) return; 
    setPos((prev) => ({ 
      x: prev.x + (e.clientX - lastPoint.current.x), 
      y: prev.y + (e.clientY - lastPoint.current.y), 
    })); 
    lastPoint.current = { x: e.clientX, y: e.clientY }; 
  }, []); 

  /* ——— Resize ——— */ 
  const onMouseDownCorner = (e: MouseEvent) => { 
    resizing.current = true; 
    lastPoint.current = { x: e.clientX, y: e.clientY }; 
    window.addEventListener('mousemove', onMouseMoveCorner as unknown as EventListener); 
    window.addEventListener('mouseup',   onMouseUpGlobal as unknown as EventListener, { once: true }); 
  }; 

  const onMouseMoveCorner = useCallback((e: MouseEvent) => { 
    if (!resizing.current) return; 
    setSize((prev) => { 
      const rawW = prev.width  + (e.clientX - lastPoint.current.x); 
      const rawH = prev.height + (e.clientY - lastPoint.current.y); 

      /*  ⬇️  Aquí estaban los errores 2345 — ahora usamos "safe()"  */ 
      const width  = Math.max(rawW, safe(minSize.width)); 
      const height = Math.max(rawH, safe(minSize.height)); 

      return { width, height }; 
    }); 
    lastPoint.current = { x: e.clientX, y: e.clientY }; 
  }, [minSize]); 

  const onMouseUpGlobal = () => { 
    dragging.current = false; 
    resizing.current = false; 
    window.removeEventListener('mousemove', onMouseMoveTitle as unknown as EventListener); 
    window.removeEventListener('mousemove', onMouseMoveCorner as unknown as EventListener); 
  }; 

  /* ——— Render ——— */ 
  return ( 
    <div 
      className="window" 
      style={{ 
        width:       size.width, 
        height:      size.height, 
        minWidth:    minSize.width, 
        minHeight:   minSize.height, 
        transform:   `translate(${pos.x}px, ${pos.y}px)`, 
        ...style, 
      }} 
      {...rest} 
    > 
      <div className="title-bar" onMouseDown={onMouseDownTitle}> 
        <span className="title-bar-text">{title}</span> 
        <div className="title-bar-controls"> 
          <button aria-label="Minimize" /> 
          <button aria-label="Maximize" /> 
          <button aria-label="Close" /> 
        </div> 
      </div> 

      <div className="window-body">{children}</div> 

      {/* ─── Esquina de redimensión (típica Win 9x) ─── */} 
      <div 
        className="resize-corner" 
        onMouseDown={onMouseDownCorner} 
      /> 
    </div> 
  ); 
};