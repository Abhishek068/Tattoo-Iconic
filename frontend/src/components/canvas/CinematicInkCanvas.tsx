"use client";

import React, { useEffect, useRef } from "react";

interface InkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
  depth: number;
  isRibbon?: boolean;
}

export function CinematicInkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Background Dust / Ambient Embers
    const particles: InkParticle[] = [];
    const ribbonParticles: InkParticle[] = [];
    const MAX_AMBIENT = window.innerWidth < 768 ? 40 : 80;

    const goldColor = "rgba(212, 175, 55, ";
    const bronzeColor = "rgba(200, 120, 60, ";
    const whiteColor = "rgba(245, 240, 230, ";

    function createAmbientParticle(x?: number, y?: number): InkParticle {
      const isGold = Math.random() > 0.6;
      const colorBase = isGold ? goldColor : Math.random() > 0.5 ? bronzeColor : whiteColor;
      const maxLife = 200 + Math.random() * 260;
      const depth = Math.random();

      return {
        x: x !== undefined ? x : Math.random() * width,
        y: y !== undefined ? y : Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35 * (depth + 0.4),
        vy: -0.15 - Math.random() * 0.35 * (depth + 0.4),
        size: isGold ? 1.2 + Math.random() * 2.2 : 6 + Math.random() * 18 * depth,
        alpha: 0,
        maxAlpha: isGold ? 0.35 + Math.random() * 0.45 : 0.06 + Math.random() * 0.1,
        life: 0,
        maxLife,
        color: colorBase,
        depth,
      };
    }

    for (let i = 0; i < MAX_AMBIENT; i++) {
      const p = createAmbientParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    // Main 60FPS Lusion Render Loop
    let time = 0;
    const render = () => {
      time += 0.01;

      // Mouse velocity
      const vx = (targetMouseX - mouseX) * 0.08;
      const vy = (targetMouseY - mouseY) * 0.08;
      mouseX += vx;
      mouseY += vy;

      const mouseSpeed = Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY);
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      ctx.clearRect(0, 0, width, height);

      // Spawn Lusion-Style Cursor Particle Ribbons on fast movement
      if (mouseSpeed > 1.2 && ribbonParticles.length < 60) {
        for (let k = 0; k < Math.min(Math.floor(mouseSpeed / 2), 3); k++) {
          ribbonParticles.push({
            x: mouseX + (Math.random() - 0.5) * 16,
            y: mouseY + (Math.random() - 0.5) * 16,
            vx: (Math.random() - 0.5) * 1.5 - vx * 0.2,
            vy: (Math.random() - 0.5) * 1.5 - vy * 0.2,
            size: 1.5 + Math.random() * 3.5,
            alpha: 0.8,
            maxAlpha: 0.85,
            life: 0,
            maxLife: 45 + Math.random() * 30,
            color: Math.random() > 0.3 ? goldColor : whiteColor,
            depth: 1,
            isRibbon: true,
          });
        }
      }

      // Render & Update Ribbon Particles
      for (let i = ribbonParticles.length - 1; i >= 0; i--) {
        const rp = ribbonParticles[i];
        rp.life++;
        rp.x += rp.vx;
        rp.y += rp.vy;
        rp.size *= 0.97;
        rp.alpha = (1 - rp.life / rp.maxLife) * rp.maxAlpha;

        if (rp.alpha > 0.01) {
          ctx.beginPath();
          const grad = ctx.createRadialGradient(rp.x, rp.y, 0, rp.x, rp.y, rp.size * 2);
          grad.addColorStop(0, `${rp.color}${rp.alpha})`);
          grad.addColorStop(0.5, `${rp.color}${rp.alpha * 0.4})`);
          grad.addColorStop(1, `${rp.color}0)`);
          ctx.fillStyle = grad;
          ctx.arc(rp.x, rp.y, rp.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        if (rp.life >= rp.maxLife || rp.size < 0.2) {
          ribbonParticles.splice(i, 1);
        }
      }

      // Render & Update Ambient Particles
      const mouseNormalizedX = (mouseX / width - 0.5) * 2;
      const mouseNormalizedY = (mouseY / height - 0.5) * 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        const wave = Math.sin(time + p.x * 0.003 + p.depth * 2) * 0.25;
        p.x += p.vx + wave + mouseNormalizedX * 0.25 * p.depth;
        p.y += p.vy + mouseNormalizedY * 0.15 * p.depth;

        const halfLife = p.maxLife / 2;
        if (p.life < halfLife) {
          p.alpha = (p.life / halfLife) * p.maxAlpha;
        } else {
          p.alpha = (1 - (p.life - halfLife) / halfLife) * p.maxAlpha;
        }

        if (p.alpha > 0.001) {
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gradient.addColorStop(0, `${p.color}${p.alpha})`);
          gradient.addColorStop(0.6, `${p.color}${p.alpha * 0.4})`);
          gradient.addColorStop(1, `${p.color}0)`);

          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        if (p.life >= p.maxLife || p.y < -50 || p.x < -50 || p.x > width + 50) {
          particles[i] = createAmbientParticle(
            Math.random() * width,
            height + 20 + Math.random() * 40
          );
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-80 mix-blend-screen"
      aria-hidden="true"
    />
  );
}

