import { useEffect, useRef } from 'react';

interface MeshNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  phase: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface MeshBackgroundProps {
  circleRef?: React.RefObject<HTMLDivElement | null>;
}

export function MeshBackground({ circleRef }: MeshBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let nodes: MeshNode[] = [];

    const connectionDistance = 150;
    const maxSpeed = 0.2;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      const calculatedNodeCount = Math.min(180, Math.max(40, Math.floor(width * height * 0.00025)));
      for (let i = 0; i < calculatedNodeCount; i++) {
        const baseOpacity = 0.4 + Math.random() * 0.4;
        let x = Math.random() * width;
        let y = Math.random() * height;
        if (Math.random() < 0.4) {
          x = width / 2 + (Math.random() - 0.5) * (Math.min(width, 500));
          y = height / 2 + (Math.random() - 0.5) * (Math.min(height, 500));
        }
        nodes.push({
          x, y,
          vx: (Math.random() - 0.5) * maxSpeed,
          vy: (Math.random() - 0.5) * maxSpeed,
          size: 4 + Math.random() * 3,
          baseOpacity,
          opacity: baseOpacity,
          phase: Math.random() * Math.PI * 2,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      let cx = -1000;
      let cy = -1000;
      let radius = 0;

      if (circleRef?.current) {
        const canvasRect = canvas.getBoundingClientRect();
        const circleRect = circleRef.current.getBoundingClientRect();
        cx = (circleRect.left + circleRect.width / 2) - canvasRect.left;
        cy = (circleRect.top + circleRect.height / 2) - canvasRect.top;
        radius = circleRect.width / 2;
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.phase += 0.005;
        node.opacity = node.baseOpacity + Math.sin(node.phase) * 0.05;
        node.pulsePhase += node.pulseSpeed;
        node.x += node.vx;
        node.y += node.vy;
        node.vx += (Math.random() - 0.5) * 0.01;
        node.vy += (Math.random() - 0.5) * 0.01;
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > maxSpeed) {
          node.vx = (node.vx / speed) * maxSpeed;
          node.vy = (node.vy / speed) * maxSpeed;
        }
        const pad = 20;
        if (node.x < pad) { node.x = pad; node.vx *= -1; }
        if (node.x > width - pad) { node.x = width - pad; node.vx *= -1; }
        if (node.y < pad) { node.y = pad; node.vy *= -1; }
        if (node.y > height - pad) { node.y = height - pad; node.vy *= -1; }
        if (radius > 0) {
          const dx = node.x - cx;
          const dy = node.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < radius + 2) {
            const nx = dx / dist;
            const ny = dy / dist;
            const dot = node.vx * nx + node.vy * ny;
            if (dot < 0) {
              node.vx -= 2 * dot * nx;
              node.vy -= 2 * dot * ny;
            }
            node.x = cx + nx * (radius + 2);
            node.y = cy + ny * (radius + 2);
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const nodePulse = (Math.sin(node.pulsePhase) + 1) / 2;
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const otherPulse = (Math.sin(other.pulsePhase) + 1) / 2;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            let crossesCircle = false;
            if (radius > 0) {
              const vx = other.x - node.x;
              const vy = other.y - node.y;
              const cxn = cx - node.x;
              const cyn = cy - node.y;
              const t = (cxn * vx + cyn * vy) / (vx * vx + vy * vy);
              if (t >= 0 && t <= 1) {
                const closestX = node.x + t * vx;
                const closestY = node.y + t * vy;
                const d2c = Math.sqrt((closestX - cx) ** 2 + (closestY - cy) ** 2);
                if (d2c < radius - 2) crossesCircle = true;
              }
            }
            if (!crossesCircle) {
              const lineOpacity = (1 - dist / connectionDistance) * Math.min(node.opacity, other.opacity);
              const avgPulse = (nodePulse + otherPulse) / 2;
              let intensityBoost = 1.0;
              if (radius > 0) {
                const dA = Math.sqrt((node.x - cx) ** 2 + (node.y - cy) ** 2) - radius;
                const dB = Math.sqrt((other.x - cx) ** 2 + (other.y - cy) ** 2) - radius;
                const fA = (dA < 150 && dA > 0) ? 1.0 + (1.0 - dA / 150) * 0.6 : 1.0;
                const fB = (dB < 150 && dB > 0) ? 1.0 + (1.0 - dB / 150) * 0.6 : 1.0;
                intensityBoost = (fA + fB) / 2;
              }
              const colorVal = Math.floor(Math.min(255, (64 + avgPulse * 191) * intensityBoost));
              const finalOpacity = Math.min(1.0, lineOpacity * (0.1 + avgPulse * 0.5) * intensityBoost) * 0.6;
              ctx.strokeStyle = `rgba(${colorVal},${colorVal},${colorVal},${finalOpacity})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulseFactor = (Math.sin(node.pulsePhase) + 1) / 2;
        let nodeIntensity = 1.0;
        let nodeDepthFade = 1.0;
        if (radius > 0) {
          const d2c = Math.sqrt((node.x - cx) ** 2 + (node.y - cy) ** 2);
          const edgeDist = d2c - radius;
          if (edgeDist < 150 && edgeDist > 0) nodeIntensity = 1.0 + (1.0 - edgeDist / 150) * 0.6;
          nodeDepthFade = 1.0 - Math.min(0.12, Math.max(0, edgeDist) / 1200 * 0.12);
        }
        const colorVal = Math.floor(Math.min(255, (64 + pulseFactor * 191) * nodeIntensity));
        const finalOpacity = Math.min(1.0, (0.2 + pulseFactor * 0.5) * nodeIntensity * nodeDepthFade);
        ctx.fillStyle = `rgba(${colorVal},${colorVal},${colorVal},${finalOpacity})`;
        ctx.fillRect(node.x - node.size / 2, node.y - node.size / 2, node.size, node.size);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      ro.disconnect();
    };
  }, [circleRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', userSelect: 'none' }}
    />
  );
}
