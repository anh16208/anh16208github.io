import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface ParticleTextProps {
  text: string | number;
  fontSize?: number;
  color?: string;
  className?: string;
}

const ParticleText: React.FC<ParticleTextProps> = ({ 
  text, 
  fontSize = 150, 
  color = '#FFB6C1',
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const phaseRef = useRef<'gather' | 'stable' | 'disperse'>('gather');
  const propsRef = useRef({ text, fontSize, color });
  const initParticlesRef = useRef<(str: string) => void>(() => {});

  useEffect(() => {
    propsRef.current = { text, fontSize, color };
  }, [text, fontSize, color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const getTextCoordinates = (str: string) => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return [];

      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      const currentFontSize = propsRef.current.fontSize;
      tempCtx.font = `bold ${currentFontSize}px monospace`;
      tempCtx.fillStyle = 'white';
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';

      // Handle multiline
      const lines = String(str).split('\n');
      const lineHeight = currentFontSize * 1.1;
      const totalHeight = lines.length * lineHeight;
      // Start Y so the block is centered vertically
      // If 1 line, startY is center. If 2 lines, startY is center - 0.5*lineHeight
      const startY = canvas.height / 2 - (totalHeight / 2) + (lineHeight / 2);

      lines.forEach((line, i) => {
        tempCtx.fillText(line, canvas.width / 2, startY + i * lineHeight);
      });

      const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const coords: {x: number, y: number}[] = [];

      const step = 3; 
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const index = (y * canvas.width + x) * 4;
          if (data[index + 3] > 128) {
            coords.push({ x, y });
          }
        }
      }
      return coords;
    };

    const initParticles = (str: string) => {
      const coords = getTextCoordinates(str);
      const newParticles: Particle[] = [];

      coords.forEach(coord => {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 800 + 200;
        
        newParticles.push({
          x: coord.x + Math.cos(angle) * dist,
          y: coord.y + Math.sin(angle) * dist,
          targetX: coord.x,
          targetY: coord.y,
          vx: 0,
          vy: 0,
          color: propsRef.current.color,
          size: Math.random() * 2 + 2 // Slightly smaller but denser
        });
      });

      particlesRef.current = newParticles;
      phaseRef.current = 'gather';
    };

    initParticlesRef.current = initParticles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      const phase = phaseRef.current;
      const ease = 0.08;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        if (phase === 'gather' || phase === 'stable') {
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          p.x += dx * ease;
          p.y += dy * ease;
        } else if (phase === 'disperse') {
          if (p.vx === 0 && p.vy === 0) {
             const angle = Math.random() * Math.PI * 2;
             const speed = Math.random() * 20 + 5;
             p.vx = Math.cos(angle) * speed;
             p.vy = Math.sin(angle) * speed;
          }
          p.x += p.vx;
          p.y += p.vy;
          p.size *= 0.9; 
        }

        if (p.size < 0.2) {
            particles.splice(i, 1);
        } else {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    initParticles(String(propsRef.current.text));

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    phaseRef.current = 'disperse';
    const timeout = setTimeout(() => {
        if (initParticlesRef.current) {
            initParticlesRef.current(String(text));
        }
    }, 800);
    return () => clearTimeout(timeout);
  }, [text]);

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className}`} />;
};

export default ParticleText;
