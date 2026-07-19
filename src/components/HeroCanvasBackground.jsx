'use client';

import { useEffect, useRef } from 'react';

export default function HeroCanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // 3D Projection parameters
    const fov = 400; // Field of view
    const particleCount = 85;
    const particles = [];
    
    // Mouse interaction states
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    
    // Rotation angles
    let angleY = 0.001; // Auto rotation Y
    let angleX = 0.0005; // Auto rotation X

    // Helper to initialize particles
    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        // Distribute particles in a 3D sphere/box volume
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const distance = 100 + Math.random() * 250; // Radius range

        // Spherical to Cartesian coordinates
        const x = distance * Math.sin(phi) * Math.cos(theta);
        const y = distance * Math.sin(phi) * Math.sin(theta);
        const z = distance * Math.cos(phi);

        // Subtle random velocities in 3D
        const speedMultiplier = 0.2;
        const vx = (Math.random() - 0.5) * speedMultiplier;
        const vy = (Math.random() - 0.5) * speedMultiplier;
        const vz = (Math.random() - 0.5) * speedMultiplier;

        // Color selection: 80% indigo/blue, 20% amber/gold
        const isGold = Math.random() > 0.8;
        const color = isGold ? '245, 158, 11' : '99, 102, 241'; // Amber vs Indigo/Cyan

        particles.push({
          x,
          y,
          z,
          vx,
          vy,
          vz,
          color,
          radius: 1 + Math.random() * 2,
        });
      }
    };

    initParticles();

    // Mouse movement listener
    const handleMouseMove = (e) => {
      // Calculate mouse offset from center of screen normalized between -1 and 1
      mouse.targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouse.targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // 3D rotation math helper
    const rotateY = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = point.x * cos - point.z * sin;
      const z = point.x * sin + point.z * cos;
      return { ...point, x, z };
    };

    const rotateX = (point, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y = point.y * cos - point.z * sin;
      const z = point.y * sin + point.z * cos;
      return { ...point, y, z };
    };

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate current camera angle based on mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Combine auto rotation and mouse movement
      const rotY = angleY + mouse.x * 0.01;
      const rotX = angleX + mouse.y * 0.005;

      // Project particles to 2D canvas
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply movement/velocity
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Keep particles within bound sphere
        const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
        if (dist > 350) {
          // Bounce back towards origin
          p.vx -= (p.x / dist) * 0.02;
          p.vy -= (p.y / dist) * 0.02;
          p.vz -= (p.z / dist) * 0.02;
        }

        // Apply rotation
        let rotated = rotateY(p, rotY);
        rotated = rotateX(rotated, rotX);

        // Update the coordinates on the original particle to persist state
        p.x = rotated.x;
        p.y = rotated.y;
        p.z = rotated.z;

        // Project onto 2D viewport
        const scale = fov / (fov + rotated.z);
        const projX = (rotated.x * scale) + width / 2;
        const projY = (rotated.y * scale) + height / 2;

        projected.push({
          x: projX,
          y: projY,
          z: rotated.z,
          color: p.color,
          radius: p.radius * scale,
        });
      }

      // Draw connection lines between close particles in 3D
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dz = particles[i].z - particles[j].z;
          const distance3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Only draw if close enough
          if (distance3D < 120) {
            const alpha = (1 - distance3D / 120) * 0.15;
            
            // Project coordinates for lines
            const scaleI = fov / (fov + particles[i].z);
            const xI = (particles[i].x * scaleI) + width / 2;
            const yI = (particles[i].y * scaleI) + height / 2;

            const scaleJ = fov / (fov + particles[j].z);
            const xJ = (particles[j].x * scaleJ) + width / 2;
            const yJ = (particles[j].y * scaleJ) + height / 2;

            ctx.beginPath();
            ctx.moveTo(xI, yI);
            ctx.lineTo(xJ, yJ);
            ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`; // Soft blue line glow
            ctx.stroke();
          }
        }
      }

      // Draw projected particles (drawn after lines to stay on top)
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        
        // Skip drawing if particle falls behind viewer
        if (p.z <= -fov) continue;

        // Calculate opacity based on depth (closer = brighter)
        const alpha = Math.max(0.1, Math.min(1.0, (fov - p.z) / (fov * 2))) * 0.65;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        
        // Add subtle shadow glow for amber/gold particles
        if (p.color === '245, 158, 11') {
          ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
          ctx.shadowBlur = 4;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 3,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  );
}
