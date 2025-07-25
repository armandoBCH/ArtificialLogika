import React, { useRef, useEffect } from 'react';

export const PlexusBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let animationFrameId: number;
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles: Particle[] = [];
        // Adjust particle count based on screen size for better performance/density
        let particleCount = Math.floor(width * height / 28000);
        const mouse = { x: -1000, y: -1000, radius: 200 };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = Math.random() * 0.4 - 0.2;
                this.vy = Math.random() * 0.4 - 0.2;
                this.radius = Math.random() * 1.5 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx!.fillStyle = 'hsla(160, 55%, 55%, 0.7)';
                ctx!.fill();
            }
        }
        
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles.length = 0; // Reset particles
            // Recalculate particle count on resize
            particleCount = Math.floor(width * height / 28000);
            init(particleCount); // Re-initialize particles for new size
        };
        
        function init(count: number) {
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function connect() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const opacity = 1 - (distance / 120);
                        ctx!.strokeStyle = `hsla(160, 55%, 55%, ${opacity})`;
                        ctx!.lineWidth = 0.5;
                        ctx!.beginPath();
                        ctx!.moveTo(particles[a].x, particles[a].y);
                        ctx!.lineTo(particles[b].x, particles[b].y);
                        ctx!.stroke();
                    }
                }
            }

            // Connect to mouse
            for (let i = 0; i < particles.length; i++) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const opacity = 1 - (distance / mouse.radius);
                    ctx!.strokeStyle = `hsla(160, 55%, 55%, ${opacity * 0.7})`;
                    ctx!.lineWidth = 1;
                    ctx!.beginPath();
                    ctx!.moveTo(particles[i].x, particles[i].y);
                    ctx!.lineTo(mouse.x, mouse.y);
                    ctx!.stroke();
                }
            }
        }

        function animate() {
            ctx!.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connect();
            animationFrameId = requestAnimationFrame(animate);
        }

        const mouseMoveHandler = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const mouseOutHandler = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };
        
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseout', mouseOutHandler);
        
        init(particleCount);
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', mouseMoveHandler);
            window.removeEventListener('mouseout', mouseOutHandler);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full z-0"
        />
    );
};