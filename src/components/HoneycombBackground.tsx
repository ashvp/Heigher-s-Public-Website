import React, { useEffect, useRef, useState } from 'react';
import './HoneycombBackground.css';

interface Hexagon {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  glow: number;
  targetGlow: number;
  pulsePhase: number;
  scanline: number;
  glitchOffset: number;
  glitchTimer: number;
}

interface MousePosition {
  x: number;
  y: number;
}

const HoneycombBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const hexagons = useRef<Hexagon[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Hexagon configuration
  const hexRadius = 30;
  const hexHeight = Math.sqrt(3) * hexRadius;
  const hexWidth = 2 * hexRadius;
  const vertDistance = hexHeight;
  const horizDistance = hexWidth * 3/4;

  // Create hexagon path
  const createHexagonPath = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number): void => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const hx = x + radius * Math.cos(angle);
      const hy = y + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(hx, hy);
      } else {
        ctx.lineTo(hx, hy);
      }
    }
    ctx.closePath();
  };

  // Initialize hexagons
  const initHexagons = (width: number, height: number): Hexagon[] => {
    const hexes: Hexagon[] = [];
    const cols = Math.ceil(width / horizDistance) + 2;
    const rows = Math.ceil(height / vertDistance) + 2;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const x = col * horizDistance;
        const y = row * vertDistance + (col % 2 === 0 ? 0 : vertDistance / 2);
        
        hexes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          glow: 0,
          targetGlow: 0,
          pulsePhase: Math.random() * Math.PI * 2,
          scanline: Math.random(),
          glitchOffset: 0,
          glitchTimer: 0
        });
      }
    }
    return hexes;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = (): void => {
      if (!canvas || !ctx) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Set actual canvas resolution
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // Set display size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // Scale context to match DPR
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      
      // Initialize hexagons with display dimensions
      hexagons.current = initHexagons(width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse move handler - use page coordinates
    const handleMouseMove = (e: MouseEvent): void => {
      setMousePos({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = (): void => {
      if (!canvas || !ctx) return;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      
      ctx.clearRect(0, 0, width, height);

      hexagons.current.forEach((hex: Hexagon) => {
        // Calculate distance from mouse
        const dx = hex.x - mousePos.x;
        const dy = hex.y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        // Mouse proximity glow with smoother falloff
        if (distance < maxDistance) {
          hex.targetGlow = 1 - (distance / maxDistance);
        } else {
          hex.targetGlow = 0;
        }

        // Very smooth glow transition for trail effect
        hex.glow += (hex.targetGlow - hex.glow) * 0.08;

        // Cap the glow to prevent over-brightening when cursor stays in one place
        hex.glow = Math.min(hex.glow, hex.targetGlow * 0.8);

        // Draw hexagon
        const intensity = hex.glow;
        
        ctx.save();

        // Base hexagon (subtle red tint)
        createHexagonPath(ctx, hex.x, hex.y, hexRadius);
        ctx.strokeStyle = `rgba(241, 12, 9, 0.25)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Glowing hexagon with gradient color based on distance
        if (hex.glow > 0.05) {
          // Calculate gradient color from red (close) to darker red (far)
          const red = 220;
          const green = Math.floor(38 * (1 - intensity * 0.5));
          const blue = Math.floor(38 * (1 - intensity * 0.5));
          
          // Outer glow effect - reduced intensity
          ctx.shadowBlur = 14 * intensity;
          ctx.shadowColor = `rgba(${red}, ${green}, ${blue}, ${intensity * 0.6})`;
          
          // Main glowing stroke
          createHexagonPath(ctx, hex.x, hex.y, hexRadius);
          ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${intensity * 0.8})`;
          ctx.lineWidth = 1.5 + (intensity * 1.5);
          ctx.stroke();
          
          // Reset shadow for inner glow
          ctx.shadowBlur = 0;
          
          // Inner bright core for close hexagons
          if (intensity > 0.8) {
            createHexagonPath(ctx, hex.x, hex.y, hexRadius * 0.85);
            ctx.strokeStyle = `rgba(255, 100, 100, ${intensity * 0.5})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        ctx.restore();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [mousePos.x, mousePos.y]);

  return (
    <div className="honeycomb-container">
      <canvas ref={canvasRef} className="honeycomb-canvas" />
      <div className="honeycomb-overlay" />
    </div>
  );
};

export default HoneycombBackground;