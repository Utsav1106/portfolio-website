"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useEffect, useRef, useCallback, forwardRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import { Button } from "./ui/button";
import { GITHUB, LINKEDIN, TWITTER } from "@/config";

gsap.registerPlugin(TextPlugin);

interface Particle {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    size: number;
    screenX?: number;
    screenY?: number;
    scale?: number;
    alpha?: number;
    isHovered?: boolean;
}

export const NetworkCloudCanvas = forwardRef<HTMLCanvasElement, { className?: string }>((props, ref) => {
    const { className = "" } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isInView = useInView(containerRef);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const rotationRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const CONFIG = {
        particleCount: 150,
        connectionDist: 110,
        baseSpeed: 0.15,
        rotationSpeed: 0.001,
        baseOpacity: 0.2,
        hoverOpacity: 1,
        colors: {
            node: "rgba(148, 163, 184, 1)",
            nodeActive: "rgba(56, 189, 248, 1)",
            line: "rgba(148, 163, 184, 1)",
            lineActive: "rgba(14, 165, 233, 1)",
        }
    };

    const initCloud = useCallback(() => {
        const particles: Particle[] = [];
        const isSmallScreen = window.innerWidth < 768;
        const count = isSmallScreen ? 70 : CONFIG.particleCount;
        const spread = isSmallScreen ? 250 : 450;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: (Math.random() - 0.5) * spread,
                y: (Math.random() - 0.5) * spread,
                z: (Math.random() - 0.5) * spread,
                vx: (Math.random() - 0.5) * CONFIG.baseSpeed,
                vy: (Math.random() - 0.5) * CONFIG.baseSpeed,
                vz: (Math.random() - 0.5) * CONFIG.baseSpeed,
                size: Math.random() * 1.2 + 0.8,
            });
        }
        particlesRef.current = particles;
    }, [CONFIG.particleCount, CONFIG.baseSpeed]);

    const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);

        const centerX = width * 0.75;
        const centerY = height * 0.5;
        const particles = particlesRef.current;
        const mouse = mouseRef.current;

        rotationRef.current.x += CONFIG.rotationSpeed;
        rotationRef.current.y += CONFIG.rotationSpeed;

        const tiltX = (mouse.y - centerY) * 0.00005;
        const tiltY = (mouse.x - centerX) * 0.00005;

        const rx = rotationRef.current.x + tiltX;
        const ry = rotationRef.current.y + tiltY;

        const projectedPoints = particles.map(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;

            const limit = 350;
            if (p.x > limit || p.x < -limit) p.vx *= -1;
            if (p.y > limit || p.y < -limit) p.vy *= -1;
            if (p.z > limit || p.z < -limit) p.vz *= -1;

            let { x, y, z } = p;

            let tx = x * Math.cos(ry) - z * Math.sin(ry);
            let tz = x * Math.sin(ry) + z * Math.cos(ry);
            x = tx; z = tz;

            let ty = y * Math.cos(rx) - z * Math.sin(rx);
            tz = y * Math.sin(rx) + z * Math.cos(rx);
            y = ty; z = tz;

            const fov = 500;
            const scale = Math.max(0, fov / (fov + z));

            const screenX = centerX + x * scale;
            const screenY = centerY + y * scale;

            const alpha = Math.max(0.05, (scale - 0.2));

            return { ...p, x, y, z, screenX, screenY, scale, alpha };
        });

        const pointsWithHover = projectedPoints
            .filter(p => p.scale! > 0)
            .map(p => {
                const dxMouse = p.screenX! - mouse.x;
                const dyMouse = p.screenY! - mouse.y;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                return { ...p, isHovered: distMouse < 120, distMouse };
            });

        ctx.lineWidth = 0.5;

        for (let i = 0; i < pointsWithHover.length; i++) {
            const p1 = pointsWithHover[i];

            for (let j = i + 1; j < pointsWithHover.length; j++) {
                const p2 = pointsWithHover[j];

                const dx = p1.screenX! - p2.screenX!;
                const dy = p1.screenY! - p2.screenY!;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const allowedDist = CONFIG.connectionDist * ((p1.scale! + p2.scale!) * 0.6);

                if (dist < allowedDist) {
                    ctx.beginPath();

                    const isActive = p1.isHovered || p2.isHovered;

                    let opacity = isActive ? 0.6 : CONFIG.baseOpacity;
                    opacity *= (1 - dist / allowedDist);
                    opacity *= Math.min(p1.alpha!, p2.alpha!);

                    if (opacity > 0) {
                        ctx.strokeStyle = isActive ? CONFIG.colors.lineActive : CONFIG.colors.line;
                        ctx.globalAlpha = opacity;
                        ctx.moveTo(p1.screenX!, p1.screenY!);
                        ctx.lineTo(p2.screenX!, p2.screenY!);
                        ctx.stroke();
                    }
                }
            }
        }

        pointsWithHover.forEach(p => {
            const hoverScale = p.isHovered ? 1.4 : 1;
            const finalSize = Math.max(0.1, p.size * p.scale! * hoverScale);

            ctx.beginPath();
            ctx.arc(p.screenX!, p.screenY!, finalSize, 0, Math.PI * 2);
            ctx.fillStyle = p.isHovered ? CONFIG.colors.nodeActive : CONFIG.colors.node;
            ctx.globalAlpha = p.isHovered ? 1 : p.alpha!;

            if (p.isHovered) {
                ctx.shadowBlur = 10 * p.scale!;
                ctx.shadowColor = CONFIG.colors.nodeActive;
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.fill();
            ctx.shadowBlur = 0;
        });

    }, [CONFIG]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `100%`;
            canvas.style.height = `100%`;
            initCloud();
        };

        const animate = () => {
            if (isInView) {
                draw(ctx, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        animate();

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [initCloud, draw, isInView]);

    return (
        <div ref={containerRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} aria-hidden="true">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
        </div>
    );
});
NetworkCloudCanvas.displayName = 'NetworkCloudCanvas';
export const Hero = () => {
    const heroRef = useRef<HTMLElement>(null);
    const greetingRef = useRef<HTMLParagraphElement>(null);
    const firstNameRef = useRef<HTMLSpanElement>(null);
    const lastNameRef = useRef<HTMLSpanElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const cursorTimeline = gsap.timeline({ repeat: -1 });
        cursorTimeline.fromTo(cursorRef.current,
            { opacity: 1 },
            { opacity: 0, duration: 0.5, ease: 'steps(1)' }
        );

        const masterTimeline = gsap.timeline({ delay: 0.2 });

        masterTimeline
            .to(greetingRef.current, {
                duration: 0.8,
                text: "Hi, I'm",
                ease: "none",
            })
            .to(firstNameRef.current, {
                duration: 0.6,
                text: "Utsav",
                ease: "none",
            })
            .to(lastNameRef.current, {
                duration: 0.7,
                text: " Saini",
                ease: "none",
                onComplete: () => {
                    gsap.to(cursorRef.current, { opacity: 0, duration: 0.3 });
                    cursorTimeline.kill();
                }
            })
            .fromTo(subtitleRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                "-=0.8"
            )
            .fromTo(ctaRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                "-=0.5"
            );

    }, { scope: heroRef });

    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative w-full overflow-hidden min-h-screen transition-colors duration-500 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-black"
        >
            <div className="absolute inset-0">
                <NetworkCloudCanvas />

                <div className="absolute top-1/4 left-0 w-96 h-96 opacity-20 pointer-events-none dark:opacity-30">
                    <div className="w-full h-full bg-gradient-to-r from-blue-500/40 via-blue-400/20 to-transparent dark:from-blue-600/30 dark:via-blue-500/10 rounded-full blur-3xl" />
                </div>
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 opacity-15 pointer-events-none dark:opacity-20">
                    <div className="w-full h-full bg-gradient-to-r from-cyan-400/30 via-cyan-300/15 to-transparent dark:from-blue-600/20 dark:via-blue-500/5 rounded-full blur-3xl" />
                </div>
            </div>

            <div className="relative z-10 flex w-full min-h-screen items-center">
                <div className="max-w-7xl mx-auto w-full px-10 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col items-center justify-center space-y-8 pt-24 pb-16 text-center md:items-start md:pl-10 md:text-left">
                            <div>
                                <p ref={greetingRef} className="text-2xl font-medium text-gray-700 dark:text-gray-300 md:text-3xl h-10">
                                </p>
                                <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl lg:text-7xl xl:text-8xl">
                                    <span ref={firstNameRef} className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 bg-clip-text text-transparent"></span>
                                    <span ref={lastNameRef} className="font-black text-gray-800 dark:text-white"></span>
                                    <span ref={cursorRef} className="inline-block w-1 h-[0.8em] ml-2 bg-gray-800 dark:bg-white"></span>
                                </h1>
                            </div>

                            <div ref={subtitleRef} className="space-y-6 opacity-0">
                                <div className="relative pl-6 border-l-2 border-blue-500/30 dark:border-blue-500/50">
                                    <p className="text-lg lg:text-xl text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
                                        Full Stack Developer building <span className="font-medium text-black dark:text-white">digital ecosystems</span>.
                                        I build scalable, high-performance applications with a focus on intelligence and minimal latency.
                                    </p>
                                </div>

                            </div>

                            <div ref={ctaRef} className="flex flex-col items-center gap-8 lg:items-start opacity-0">
                                <div className="flex flex-row flex-wrap justify-center sm:justify-start sm:flex-row gap-6">
                                    <motion.div whileTap={{ scale: 0.95 }}>
                                        <Button
                                            id="view-projects"
                                            leftIcon={TiLocationArrow}
                                            containerClass="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-4 text-lg font-semibold transition-all duration-300 border-0"
                                            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                                        >
                                            View Projects
                                        </Button>
                                    </motion.div>
                                    <motion.div whileTap={{ scale: 0.95 }}>
                                        <Button
                                            id="contact-button"
                                            containerClass="bg-transparent border-2 border-gray-800 text-gray-800 hover:bg-gray-900 hover:text-white dark:border-gray-400 dark:text-gray-300 dark:hover:bg-white dark:hover:text-black px-10 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/25"
                                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                        >
                                            Let's Connect
                                        </Button>
                                    </motion.div>
                                </div>
                                <div className="flex gap-8">
                                    <motion.a href={`https://github.com/${GITHUB}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300" whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }}><FaGithub size={32} /></motion.a>
                                    <motion.a href={`https://linkedin.com/in/${LINKEDIN}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300" whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }}><FaLinkedin size={32} /></motion.a>
                                    <motion.a href={`https://twitter.com/${TWITTER}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-400 hover:text-sky-500 dark:hover:text-cyan-400 transition-all duration-300" whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }}><FaTwitter size={32} /></motion.a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block pointer-events-none">
                <div className="w-full h-full bg-gradient-to-l from-blue-500/10 via-cyan-500/10 to-transparent dark:from-blue-500/10 dark:via-blue-500/10" />
            </div>
        </section >
    );
};
