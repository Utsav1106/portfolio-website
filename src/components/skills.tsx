"use client";

import { useRef, useEffect, useState, useCallback, ComponentType } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { 
  ReactOriginal, NextjsOriginal, TypescriptOriginal, 
  NodejsPlain, ExpressOriginal, PythonOriginal, PostgresqlOriginal, 
  MongodbOriginal, GraphqlPlain, TensorflowOriginal, PytorchOriginal, 
  SolidityOriginal, 
  GitOriginal, 
  TailwindcssOriginal,
  RustOriginal,
  NginxOriginal
} from 'devicons-react';

interface Skill {
  name: string;
  color: string;
  icon: ComponentType<{ className?: string, size?: string | number }>;
}


const skills: Skill[] = [
  { name: 'React', color: '#61DAFB', icon: ReactOriginal },
  { name: 'Next.js', color: '#000000', icon: NextjsOriginal },
  { name: 'TypeScript', color: '#3178C6', icon: TypescriptOriginal },
  { name: 'Tailwind CSS', color: '#06B6D4', icon: TailwindcssOriginal },
  { name: 'Node.js', color: '#5FA04E', icon: NodejsPlain },
  { name: 'Express.js', color: '#404d59', icon: ExpressOriginal },
  { name: 'Python', color: '#3776AB', icon: PythonOriginal },
  { name: 'PostgreSQL', color: '#336791', icon: PostgresqlOriginal },
  { name: 'MongoDB', color: '#47A248', icon: MongodbOriginal },
  { name: 'GraphQL', color: '#E10098', icon: GraphqlPlain },
  { name: 'TensorFlow', color: '#FF6F00', icon: TensorflowOriginal },
  { name: 'PyTorch', color: '#EE4C2C', icon: PytorchOriginal },
  { name: 'Solidity', color: '#363636', icon: SolidityOriginal },
  { name: 'Rust', color: '#DE5233', icon: RustOriginal },
  { name: 'Nginx', color: '#009639', icon: NginxOriginal },
  { name: 'Git', color: '#F05032', icon: GitOriginal },
];

export const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
  }, []);

  useEffect(() => {
    let throttleTimer: number | null = null;
    const throttledMouseMove = (e: MouseEvent) => {
      if (throttleTimer === null) {
        throttleTimer = window.requestAnimationFrame(() => {
          handleMouseMove(e);
          throttleTimer = null;
        });
      }
    };
    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', throttledMouseMove, { passive: true });
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: headerRef.current, start: "top 85%" } }
      );
      gsap.fromTo('.skill-card',
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: { amount: 0.8, from: "random" }, ease: "power2.out", scrollTrigger: { trigger: '.skills-grid', start: "top 80%" } }
      );
    }, sectionRef);

    return () => {
      if (section) {
        section.removeEventListener('mousemove', throttledMouseMove);
      }
      ctx.revert();
    };
  }, [handleMouseMove]);

  return (
    <section ref={sectionRef} id="skills" className="relative overflow-hidden py-20 bg-gray-50 dark:bg-black">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transition-all duration-1000"
          style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
        />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div ref={headerRef} className="text-center mb-12">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
            My Tech Stack
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            The primary languages, frameworks, and tools I use to build modern, high-performance applications.
          </p>
        </div>
        <div className="skills-grid grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-4">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.name}
                className="skill-card group relative flex flex-col items-center justify-center p-3 aspect-square rounded-xl border transition-all duration-300 cursor-pointer bg-white/60 border-gray-200 hover:border-gray-300 dark:bg-gray-900/50 dark:border-gray-800 dark:hover:border-gray-600 backdrop-blur-sm hover:scale-105 hover:!bg-white dark:hover:!bg-gray-800"
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPosition({
                    x: e.clientX,
                    y: rect.top,
                  });
                }}
                whileHover={{ y: -4 }}
                style={{ background: hoveredSkill === skill.name ? skill.color + '15' : '' }}
              >
                <Icon size="56" className="transition-transform duration-300 group-hover:scale-110" />
                                
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: `0 0 25px -5px ${skill.color}` }}
                />
              </motion.div>
            );
          })}
        </div>
        {hoveredSkill && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed px-3 py-1.5 rounded-md shadow-lg z-50 pointer-events-none bg-white/80 text-gray-900 border border-gray-200 dark:bg-gray-800/80 dark:text-white dark:border-gray-700 backdrop-blur-md"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <span className="text-sm font-medium">{hoveredSkill}</span>
          </motion.div>
        )}
      </div>
    </section>
  );
};