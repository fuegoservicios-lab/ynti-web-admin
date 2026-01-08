import { useEffect, useRef } from 'react';

export default function BioNetworkBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Configuration - Tuned for performance and visual
        // Responsive connection distance prevents "long spiderwebs" on mobile
        let connectionDistance = width < 768 ? 100 : 160;
        let connectionDistanceSq = connectionDistance * connectionDistance;
        const PARTICLE_SPEED = 0.3; // Slower, more elegant movement

        // Palette from index.css 
        const COLORS = [
            '#00D9FF', // Cyan Neon
            '#00FF88', // Bio Green
            '#D946EF', // Fuchsia
            '#3B82F6'  // Brighter Blue
        ];

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Re-calc responsive params
            connectionDistance = width < 768 ? 100 : 160;
            connectionDistanceSq = connectionDistance * connectionDistance;

            initParticles();
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
                this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
                // Smaller, finer particles on mobile
                this.size = width < 768 ? Math.random() * 1.5 + 0.5 : Math.random() * 2 + 1;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.glow = 10;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = this.glow;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        const initParticles = () => {
            particles = [];
            // Balanced count: 45 mobile, 70 desktop
            const count = width < 768 ? 45 : 70;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connections - Optimized loop
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < connectionDistanceSq) {
                        ctx.beginPath();
                        const distance = Math.sqrt(distSq);
                        // Softer opacity on mobile
                        const maxOpacity = width < 768 ? 0.3 : 0.5;
                        const opacity = maxOpacity - (distance / connectionDistance) * maxOpacity;

                        ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
                        ctx.lineWidth = width < 768 ? 0.8 : 1; // Thinner lines on mobile
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            // Update and draw particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.8, pointerEvents: 'none' }}
        />
    );
}
