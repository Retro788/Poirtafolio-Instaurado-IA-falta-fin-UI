import { useMemo } from 'react';

interface Options { 
  defaultWidth:  number; 
  defaultHeight: number; 
  maxWidth?:     number; 
  maxHeight?:    number; 
}

/** 
 * Calcula un tamaño inicial que: 
 *  • respeta un mínimo de 380×320 px, 
 *  • no supera el 90 % del viewport, 
 *  • ni los maxWidth/maxHeight indicados. 
 */ 
export function useInitialWindowSize({ 
  defaultWidth, 
  defaultHeight, 
  maxWidth = Number.POSITIVE_INFINITY, 
  maxHeight = Number.POSITIVE_INFINITY, 
}: Options) { 
  return useMemo(() => { 
    const vw = window.innerWidth; 
    const vh = window.innerHeight; 

    const width = Math.max( 
      380, 
      Math.min(defaultWidth, vw * 0.9, maxWidth), 
    ); 

    const height = Math.max( 
      320, 
      Math.min(defaultHeight, vh * 0.9, maxHeight), 
    ); 

    return { width, height }; 
  }, [defaultWidth, defaultHeight, maxWidth, maxHeight]); 
}
