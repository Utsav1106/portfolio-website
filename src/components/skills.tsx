"use client";

import { useRef, useCallback, ComponentType } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ReactOriginal, NextjsOriginal, TypescriptOriginal, TailwindcssOriginal,
  ReduxOriginal, FigmaOriginal,
  NodejsPlain, ExpressOriginal, PostgresqlOriginal, MongodbOriginal,
  PrismaOriginal, RedisOriginal, GraphqlPlain,
  PythonOriginal, TensorflowOriginal, PytorchOriginal, RustOriginal, SolidityOriginal,
  GitOriginal, DockerOriginal, AmazonwebservicesOriginalWordmark, NginxOriginal,
  LinuxOriginal, PostmanOriginal
} from 'devicons-react';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  desc: string;

  icon: ComponentType<{ className?: string, size?: string | number }>;
}

interface Category {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
  color: string;
}

const SKILL_CATEGORIES: Category[] = [
  {
    id: "frontend",
    title: "Frontend & Design",
    description: "Creating responsive, interactive UIs with modern state management.",
    color: "from-cyan-400 to-blue-500",
    skills: [
      { name: 'React', desc: 'UI Library', icon: ReactOriginal },
      { name: 'Next.js', desc: 'React Framework', icon: NextjsOriginal },
      { name: 'TypeScript', desc: 'Static Typing', icon: TypescriptOriginal },
      { name: 'Tailwind', desc: 'CSS Framework', icon: TailwindcssOriginal },
      { name: 'Redux', desc: 'State Management', icon: ReduxOriginal },
      { name: 'Figma', desc: 'UI/UX Design', icon: FigmaOriginal },
    ]
  },
  {
    id: "backend",
    title: "Backend & Database",
    description: "Robust server-side logic, API architecture, and data modeling.",
    color: "from-emerald-400 to-green-600",
    skills: [
      { name: 'Node.js', desc: 'JS Runtime', icon: NodejsPlain },
      { name: 'Express', desc: 'Web Framework', icon: ExpressOriginal },
      { name: 'PostgreSQL', desc: 'Relational DB', icon: PostgresqlOriginal },
      { name: 'MongoDB', desc: 'NoSQL DB', icon: MongodbOriginal },
      { name: 'Redis', desc: 'Caching Store', icon: RedisOriginal },
      { name: 'Prisma', desc: 'Modern ORM', icon: PrismaOriginal },
      { name: 'GraphQL', desc: 'Query Language', icon: GraphqlPlain },
    ]
  },
  {
    id: "intelligence",
    title: "AI & Core Tech",
    description: "Machine learning integration, low-level logic, and Web3 protocols.",
    color: "from-orange-400 to-red-500",
    skills: [
      { name: 'Python', desc: 'AI & Scripting', icon: PythonOriginal },
      { name: 'TensorFlow', desc: 'ML Library', icon: TensorflowOriginal },
      { name: 'PyTorch', desc: 'Deep Learning', icon: PytorchOriginal },
      { name: 'Rust', desc: 'Systems Prog', icon: RustOriginal },
      { name: 'Solidity', desc: 'Smart Contracts', icon: SolidityOriginal },
    ]
  },
  {
    id: "devops",
    title: "DevOps & Tools",
    description: "Deployment pipelines, containerization, and system management.",
    color: "from-purple-400 to-indigo-500",
    skills: [
      { name: 'Git', desc: 'Version Control', icon: GitOriginal },
      { name: 'Docker', desc: 'Containerization', icon: DockerOriginal },
      { name: 'AWS', desc: 'Cloud Services', icon: AmazonwebservicesOriginalWordmark },
      { name: 'Nginx', desc: 'Web Server', icon: NginxOriginal },
      { name: 'Linux', desc: 'OS Architecture', icon: LinuxOriginal },
      { name: 'Postman', desc: 'API Testing', icon: PostmanOriginal },
    ]
  }
];

const SkillItem = ({ skill }: { skill: Skill }) => {
  return (
    <motion.div
      className="relative flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 dark:bg-white/2 transition-all duration-300 group/item cursor-default"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex-shrink-0 p-2 rounded-lg bg-white dark:bg-black/20 shadow-sm group-hover/item:shadow-md transition-all duration-300">
        <skill.icon size={24} className="filter opacity-70 transition-all duration-300 group-hover/item:opacity-100" />
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight leading-none mb-1">
          {skill.name}
        </span>
        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {skill.desc}
        </span>
      </div>


      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover/item:from-blue-500/5 group-hover/item:to-purple-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

const BentoCard = ({ category, index }: { category: Category, index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/5 dark:border-none p-6 sm:p-8 hover:shadow-xl dark:hover:shadow-blue-900/10 transition-shadow duration-500 h-full flex flex-col"
    >

      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.10),
              transparent 80%
            )
          `,
        }}
      />


      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-6">
          <div className={`w-10 h-1 rounded-full bg-gradient-to-r ${category.color} mb-4 opacity-80`} />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{category.title}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            {category.description}
          </p>
        </div>


        <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
          {category.skills.map((skill) => (
            <SkillItem key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const Skills = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(headingRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="skills"
      className="relative py-16 md:py-32 overflow-hidden bg-gray-50 dark:bg-black"
    >
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] mix-blend-multiply dark:bg-blue-900/10" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[100px] mix-blend-multiply dark:bg-cyan-900/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={headingRef} className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <h2 className="text-sm sm:text-base font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase mb-3">
            Technical Proficiency
          </h2>
          <p className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            A digital toolkit for <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              intelligent solutions.
            </span>
          </p>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            I architect ecosystems using a modern, scalable stack.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SKILL_CATEGORIES.map((category, index) => (
            <BentoCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};