"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useCallback, useState, forwardRef, useImperativeHandle } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { GITHUB, LINKEDIN, TWITTER } from "@/config";

const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

interface Neuron {
    x: number;
    y: number;
    z: number;
    size: number;
    opacity: number;
    targetOpacity: number;
    baseOpacity: number;
    originalX: number;
    originalY: number;
    originalZ: number;
}

interface Connection {
    from: Neuron;
    to: Neuron;
    opacity: number;
    targetOpacity: number;
    baseOpacity: number;
}

export interface NeuralNetworkCanvasRef {
    transitionToBackground: () => void;
    resetToHero: () => void;
}

const colorPalettes = {
    dark: {
        connection: { from: '#3b82f6', to: '#22d3ee' },
        glow: { pulse: '#22d3ee', mouse: '#3b82f6' },
        neuron: { gradFrom: '#22d3ee', gradVia: '#3b82f6', gradTo: '#1e40af' },
        innerGlow: { front: '#bfdbfe', back: '#93c5fd' },
        core: '#ffffff',
    },
    light: {
        connection: { from: '#2563eb', to: '#0d9488' },
        glow: { pulse: '#0d9488', mouse: '#2563eb' },
        neuron: { gradFrom: '#0ea5e9', gradVia: '#2563eb', gradTo: '#1e40af' },
        innerGlow: { front: '#60a5fa', back: '#3b82f6' },
        core: '#dbeafe',
    }
};


const NeuralNetworkCanvas = forwardRef<NeuralNetworkCanvasRef, {
    className?: string;
    backgroundMode?: boolean;
}>((props, ref) => {
    const { className = "", backgroundMode = false } = props;
    const theme = "light";
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const neuronsRef = useRef<Neuron[]>([]);
    const connectionsRef = useRef<Connection[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const rotationRef = useRef({ x: 0, y: 0 });
    const targetRotationRef = useRef({ x: 0, y: 0 });

    const transitionStateRef = useRef({
        isTransitioning: false,
        targetCenterX: 0.75,
        targetCenterY: 0.5,
        targetFov: 350,
        currentCenterX: 0.75,
        currentCenterY: 0.5,
        currentFov: 350,
        mouseReactivity: 1.0,
        colorSaturation: 1.0
    });

    const [isMobile, setIsMobile] = useState(false);
    const pulseNeuronRef = useRef<Neuron | null>(null);
    const pulseStartTimeRef = useRef<number>(0);
    const pulseNeighborsRef = useRef<Set<Neuron>>(new Set());

    useImperativeHandle(ref, () => ({
        transitionToBackground: () => {
            const state = transitionStateRef.current;
            state.isTransitioning = true;
            state.targetCenterX = 0.5;
            state.targetCenterY = 0.5;
            state.targetFov = 200;
            state.mouseReactivity = 0.2;
            state.colorSaturation = 0.6;
        },
        resetToHero: () => {
            const state = transitionStateRef.current;
            state.isTransitioning = false;
            state.targetCenterX = isMobile ? 0.5 : 0.75;
            state.targetCenterY = isMobile ? 0.3 : 0.5;
            state.targetFov = isMobile ? 120 : 350;
            state.mouseReactivity = 1.0;
            state.colorSaturation = 1.0;
        }
    }));

    const initNeuralNetwork = useCallback((canvas: HTMLCanvasElement) => {
        const neurons: Neuron[] = [];
        const connections: Connection[] = [];
        const isMobileDevice = window.innerWidth < 768;
        const sphereRadius = isMobileDevice ? 80 : 280;
        const neuronCount = isMobileDevice ? 40 : 120;

        for (let i = 0; i < neuronCount; i++) {
            let phi = Math.acos(1 - 2 * i / neuronCount);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            phi = phi * 0.6 + (Math.PI * 0.2);

            const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
            const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
            const z = sphereRadius * Math.cos(phi);

            const baseOpacity = Math.random() * 0.3 + 0.4;
            const neuron: Neuron = {
                x, y, z, originalX: x, originalY: y, originalZ: z,
                size: Math.random() * 1.5 + (isMobileDevice ? 2.5 : 2),
                opacity: baseOpacity, targetOpacity: baseOpacity, baseOpacity
            };
            neurons.push(neuron);
        }

        neurons.forEach((from) => {
            const distances = neurons
                .map((to) => ({
                    neuron: to,
                    distance: Math.sqrt(
                        (from.originalX - to.originalX) ** 2 +
                        (from.originalY - to.originalY) ** 2 +
                        (from.originalZ - to.originalZ) ** 2
                    )
                }))
                .filter(({ neuron }) => neuron !== from)
                .sort((a, b) => a.distance - b.distance);

            const connectionsToMake = Math.floor(Math.random() * 2) + (isMobileDevice ? 2 : 3);
            distances.slice(0, connectionsToMake).forEach(({ neuron: to, distance }) => {
                if (distance < sphereRadius * 0.8 && Math.random() < 0.7) {
                    const baseOpacity = Math.random() * 0.1 + 0.05;
                    connections.push({ from, to, opacity: baseOpacity, targetOpacity: baseOpacity, baseOpacity });
                }
            });
        });

        neuronsRef.current = neurons;
        connectionsRef.current = connections;
    }, []);

    const drawNeuralNetwork = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const neurons = neuronsRef.current;
        const connections = connectionsRef.current;
        const mouse = mouseRef.current;
        const rotation = rotationRef.current;
        const state = transitionStateRef.current;
        const colors = colorPalettes[theme];

        const lerpFactor = 0.02;
        state.currentCenterX += (state.targetCenterX - state.currentCenterX) * lerpFactor;
        state.currentCenterY += (state.targetCenterY - state.currentCenterY) * lerpFactor;
        state.currentFov += (state.targetFov - state.currentFov) * lerpFactor;

        const centerX = state.currentCenterX * canvas.width;
        const centerY = state.currentCenterY * canvas.height;
        const fov = state.currentFov;
        const sphereRadiusForDepth = isMobile ? 80 : 280;

        const targetRotation = targetRotationRef.current;
        const reactivity = state.mouseReactivity;
        rotation.x += (targetRotation.x * reactivity - rotation.x) * 0.08;
        rotation.y += (targetRotation.y * reactivity - rotation.y) * 0.08;

        const time = Date.now() * 0.0005;
        const ambientRotationY = time * (backgroundMode ? 0.1 : 0.2);
        const ambientRotationX = Math.sin(time * 0.5) * 0.05;

        const now = Date.now();
        const SHOCK_DURATION = 800;
        const SHOCK_COOLDOWN = backgroundMode ? 3000 : 1500;
        if (!pulseNeuronRef.current && now - pulseStartTimeRef.current > SHOCK_COOLDOWN && Math.random() > 0.97) {
            const randomIndex = Math.floor(Math.random() * neurons.length);
            const pNeuron = neurons[randomIndex];
            pulseNeuronRef.current = pNeuron;
            pulseStartTimeRef.current = now;
            const neighbors = new Set<Neuron>();
            connections.forEach(conn => {
                if (conn.from === pNeuron) neighbors.add(conn.to);
                if (conn.to === pNeuron) neighbors.add(conn.from);
            });
            pulseNeighborsRef.current = neighbors;
        }
        let pulseForce = 0;
        const pulseNeuron = pulseNeuronRef.current;
        if (pulseNeuron) {
            const elapsed = now - pulseStartTimeRef.current;
            if (elapsed < SHOCK_DURATION) {
                const progress = elapsed / SHOCK_DURATION;
                pulseForce = progress < 0.2 ? progress / 0.2 : Math.exp(-((progress - 0.2) * 8));
            } else {
                pulseNeuronRef.current = null;
                pulseNeighborsRef.current.clear();
            }
        }

        const projectedNeurons = neurons.map(neuron => {
            let { originalX: x, originalY: y, originalZ: z } = neuron;
            const initialRotationY = Math.PI * 0.3;
            let tempInitialX = x * Math.cos(initialRotationY) - z * Math.sin(initialRotationY);
            let tempInitialZ = x * Math.sin(initialRotationY) + z * Math.cos(initialRotationY);
            x = tempInitialX; z = tempInitialZ;
            const rotY = rotation.y + ambientRotationY;
            let tempX = x * Math.cos(rotY) - z * Math.sin(rotY);
            let tempZ = x * Math.sin(rotY) + z * Math.cos(rotY);
            x = tempX; z = tempZ;
            const rotX = rotation.x + ambientRotationX;
            let tempY = y * Math.cos(rotX) - z * Math.sin(rotX);
            z = y * Math.sin(rotX) + z * Math.cos(rotX);
            y = tempY;
            const scale = fov / (fov + z);
            const screenX = centerX + x * scale;
            const screenY = centerY + y * scale;
            const depthFactor = (z + sphereRadiusForDepth) / (sphereRadiusForDepth * 2);
            const depthOpacity = Math.max(0.15, Math.min(1, depthFactor));
            neuron.x = x; neuron.y = y; neuron.z = z;
            return { neuron, screenX, screenY, scale, depthOpacity, distance3D: z };
        });
        projectedNeurons.sort((a, b) => a.distance3D - b.distance3D);

        connections.forEach(connection => {
            const fromProjected = projectedNeurons.find(p => p.neuron === connection.from);
            const toProjected = projectedNeurons.find(p => p.neuron === connection.to);
            if (!fromProjected || !toProjected) return;

            const avgDepth = (fromProjected.distance3D + toProjected.distance3D) / 2;
            const depthOpacity = Math.max(0.05, Math.min(0.6, (avgDepth + sphereRadiusForDepth) / (sphereRadiusForDepth * 2)));
            const midX = (fromProjected.screenX + toProjected.screenX) / 2;
            const midY = (fromProjected.screenY + toProjected.screenY) / 2;
            const dpr = window.devicePixelRatio || 1;
            const cssX = midX / dpr, cssY = midY / dpr;
            const dx = cssX - mouse.x, dy = cssY - mouse.y;
            const distance2D = Math.sqrt(dx * dx + dy * dy);
            let mouseForce = 0;
            if (distance2D < 100) mouseForce = (100 - distance2D) / 100 * state.mouseReactivity;
            let localPulseForce = 0;
            if (pulseForce > 0 && pulseNeuron && (connection.from === pulseNeuron || connection.to === pulseNeuron)) {
                localPulseForce = pulseForce * 0.9;
            }
            const baseTarget = connection.baseOpacity * depthOpacity;
            const mouseTarget = connection.baseOpacity + mouseForce * 0.5;
            connection.targetOpacity = Math.min(0.8, Math.max(baseTarget, mouseTarget, localPulseForce));
            connection.opacity += (connection.targetOpacity - connection.opacity) * 0.08;

            ctx.save();
            ctx.globalAlpha = connection.opacity;

            const gradient = ctx.createLinearGradient(fromProjected.screenX, fromProjected.screenY, toProjected.screenX, toProjected.screenY);
            const saturation = state.colorSaturation;
            const fromRgb = hexToRgb(colors.connection.from);
            const toRgb = hexToRgb(colors.connection.to);

            if (fromRgb && toRgb) {
                gradient.addColorStop(0, saturation < 1.0 ? `rgba(${fromRgb.r}, ${fromRgb.g}, ${fromRgb.b}, ${saturation})` : colors.connection.from);
                gradient.addColorStop(1, saturation < 1.0 ? `rgba(${toRgb.r}, ${toRgb.g}, ${toRgb.b}, ${saturation})` : colors.connection.to);
            }

            ctx.strokeStyle = gradient;
            ctx.lineWidth = Math.max(0.5, depthOpacity * 1.5);
            ctx.beginPath();
            ctx.moveTo(fromProjected.screenX, fromProjected.screenY);
            ctx.lineTo(toProjected.screenX, toProjected.screenY);
            ctx.stroke();
            ctx.restore();
        });

        projectedNeurons.reverse().forEach(({ neuron, screenX, screenY, scale, depthOpacity }) => {
            const dpr = window.devicePixelRatio || 1;
            const cssX = screenX / dpr, cssY = screenY / dpr;
            const dx = cssX - mouse.x, dy = cssY - mouse.y;
            const distance2D = Math.sqrt(dx * dx + dy * dy);
            let mouseForce = 0;
            if (distance2D < 80) mouseForce = (80 - distance2D) / 80 * state.mouseReactivity;
            let localPulseForce = 0;
            if (pulseForce > 0 && pulseNeuron) {
                if (neuron === pulseNeuron) {
                    localPulseForce = pulseForce;
                } else if (pulseNeighborsRef.current.has(neuron)) {
                    const elapsed = now - pulseStartTimeRef.current;
                    const neighborDelay = 50;
                    if (elapsed > neighborDelay) {
                        const progress = (elapsed - neighborDelay) / (SHOCK_DURATION - neighborDelay);
                        localPulseForce = Math.max(0, 1 - progress * 2) * 0.8;
                    }
                }
            }

            const shockForce = Math.max(mouseForce, localPulseForce);
            if (shockForce > 0) {
                ctx.save();
                const glowColor = localPulseForce > mouseForce ? colors.glow.pulse : colors.glow.mouse;
                const intensity = shockForce > 0.8 ? 0.8 : (shockForce > 0.5 ? 0.6 : 0.4);
                ctx.shadowColor = glowColor;
                ctx.shadowBlur = 12 + shockForce * 8;
                ctx.globalAlpha = intensity;
                ctx.fillStyle = glowColor;
                ctx.beginPath();
                ctx.arc(screenX, screenY, neuron.size * scale + shockForce * 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            const baseTarget = neuron.baseOpacity * depthOpacity;
            const mouseTarget = neuron.baseOpacity + mouseForce * 0.6;
            neuron.targetOpacity = Math.min(1, Math.max(baseTarget, mouseTarget, localPulseForce));
            neuron.opacity += (neuron.targetOpacity - neuron.opacity) * 0.06;
            const pulseOffset = Math.sin(now * 0.001 * 2 + neuron.originalX * 0.01) * 0.1;
            const currentSize = (neuron.size + pulseOffset) * scale;

            ctx.save();
            ctx.globalAlpha = neuron.opacity;

            const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, currentSize);
            const saturation = state.colorSaturation;
            const fromRgb = hexToRgb(colors.neuron.gradFrom);
            const viaRgb = hexToRgb(colors.neuron.gradVia);
            const toRgb = hexToRgb(colors.neuron.gradTo);
            if (fromRgb && viaRgb && toRgb) {
                gradient.addColorStop(0, saturation < 1.0 ? `rgba(${fromRgb.r}, ${fromRgb.g}, ${fromRgb.b}, ${saturation})` : colors.neuron.gradFrom);
                gradient.addColorStop(0.7, saturation < 1.0 ? `rgba(${viaRgb.r}, ${viaRgb.g}, ${viaRgb.b}, ${saturation})` : colors.neuron.gradVia);
                gradient.addColorStop(1, saturation < 1.0 ? `rgba(${toRgb.r}, ${toRgb.g}, ${toRgb.b}, ${saturation * 0.8})` : colors.neuron.gradTo);
            }

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(screenX, screenY, currentSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = neuron.opacity * 0.9;
            ctx.fillStyle = depthOpacity > 0.7 ? colors.innerGlow.front : colors.innerGlow.back;
            ctx.beginPath();
            ctx.arc(screenX, screenY, currentSize * 0.6, 0, Math.PI * 2);
            ctx.fill();

            if (depthOpacity > 0.5) {
                ctx.globalAlpha = neuron.opacity * depthOpacity;
                ctx.fillStyle = colors.core;
                ctx.beginPath();
                ctx.arc(screenX, screenY, currentSize * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });
    }, [backgroundMode, isMobile, theme]);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        drawNeuralNetwork(ctx, canvas);
        animationRef.current = requestAnimationFrame(animate);
    }, [drawNeuralNetwork]);

    const handleResize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(dpr, dpr);
        }
        initNeuralNetwork(canvas);
    }, [initNeuralNetwork]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        mouseRef.current = { x: mouseX, y: mouseY };
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (mouseX - centerX) / centerX;
        const deltaY = (mouseY - centerY) / centerY;
        targetRotationRef.current = { x: deltaY * 0.3, y: deltaX * 0.4 };
    }, []);

    const handleMouseLeave = useCallback(() => {
        targetRotationRef.current = { x: 0, y: 0 };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setIsMobile(window.innerWidth < 768);
        handleResize();
        animate();

        const resizeObserver = new ResizeObserver(() => {
            setIsMobile(window.innerWidth < 768);
            setTimeout(handleResize, 10);
        });
        resizeObserver.observe(canvas);

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
            resizeObserver.disconnect();
            if (canvas) {
                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [handleResize, animate, handleMouseMove, handleMouseLeave]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full ${className}`}
            style={{ zIndex: backgroundMode ? -1 : 1 }}
        />
    );
});
NeuralNetworkCanvas.displayName = 'NeuralNetworkCanvas';

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
                <NeuralNetworkCanvas />
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
                                <p className="text-2xl font-medium md:text-3xl lg:text-4xl">
                                    <span className="bg-gradient-to-r from-slate-600 to-slate-800 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                                        Full Stack Developer
                                    </span>
                                </p>
                                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed md:text-xl mx-auto lg:mx-0">
                                    Building the next generation of web applications. I architect full-stack solutions with a passion for integrating cutting-edge AI and Web3 technologies to solve complex challenges.
                                </p>
                            </div>

                            <div ref={ctaRef} className="flex flex-col items-center gap-8 lg:items-start opacity-0">
                                <div className="flex flex-row flex-wrap justify-center sm:justify-start sm:flex-row gap-6">
                                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            id="view-projects"
                                            leftIcon={TiLocationArrow}
                                            containerClass="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 border-0"
                                            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                                        >
                                            View My Projects
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
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

            <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-blue-500/60 dark:border-blue-600/40 hidden md:block" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-blue-500/60 dark:border-blue-600/40 hidden md:block" />
            <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block pointer-events-none">
                <div className="w-full h-full bg-gradient-to-l from-blue-500/10 via-cyan-500/10 to-transparent dark:from-blue-500/10 dark:via-blue-500/10" />
            </div>
        </section>
    );
};

export { NeuralNetworkCanvas };