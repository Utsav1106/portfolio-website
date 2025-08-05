"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaGithub, FaTimes } from "react-icons/fa";
import { createPortal } from "react-dom";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  color: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Rise Vaults",
    description: "Advanced token staking platform with flexible reward systems, customizable lock periods, and timed vaults.",
    tags: ["SPL-TOKENs", "Rust", "MongoDB", "Express"],
    images: ["/project-previews/rise-vaults/1.png", "/project-previews/rise-vaults/2.png"],
    liveUrl: "https://vaults.mobcollective.io",
    color: "#6366f1"
  },
  {
    id: 2,
    title: "ETAKit",
    description: "A pioneering force in the NFT ecosystem. Originating as a revitalized project, we've evolved into a comprehensive NFT platform offering services.",
    tags: ["Next.js", "Toolkit", "Metaplex"],
    images: ["/project-previews/etakit/1.png", "/project-previews/etakit/2.png"],
    liveUrl: "https://lab.etakit.in",
    color: "#10b981"
  },
  {
    id: 3,
    title: "KEK Minting",
    description: "1610 Lizards created to spread Kindness and Art.",
    tags: ["Metaplex", "Solana", "Typescript", "Next.js"],
    images: ["/project-previews/kek-mint/1.png"],
    liveUrl: "https://kekmint.xyz",
    color: "#10b981"
  },
  {
    id: 4,
    title: "Raffle Platform",
    description: "Engaging raffle system with multiple prize types, fair winner selection, and automated distribution.",
    tags: ["Express", "Next.js", "Tailwind CSS", "MongoDB"],
    images: ["/project-previews/raffle-platform/1.png", "/project-previews/raffle-platform/2.png"],
    liveUrl: "https://raffle.mobcollective.io",
    color: "#10b981"
  },
  {
    id: 5,
    title: "Seicred NFT Marketplace",
    description: "A decentralized NFT marketplace for trading and showcasing digital assets on SEI blockchain.",
    tags: ["NFTs", "MongoDB", "Express", "React.js", "Solidity", "GraphQL"],
    images: ["/project-previews/seicred-marketplace/1.png", "/project-previews/seicred-marketplace/2.png"],
    liveUrl: "https://seicred-marketplace.vercel.app",
    color: "#8b5cf6"
  },
  {
    id: 6,
    title: "Multi Collection Mints",
    description: "Highly customizable platform for minting multiple Solana NFT projects.",
    tags: ["Metaplex", "Express", "Next.js"],
    images: ["/project-previews/multi-mint/1.png"],
    liveUrl: "https://multi-mints.vercel.app/",
    githubUrl: "https://github.com/Utsav1106/multi-candy-machine-mints",
    color: "#06b6d4"
  },
  {
    id: 7,
    title: "dyo | Do your own",
    description: "Empowering Creators, Building Communities, Pioneering the Future on Solana",
    tags: ["Next.js", "Staking", "Solana"],
    images: ["/project-previews/dyo/1.png", "/project-previews/dyo/2.png", "/project-previews/dyo/3.png"],
    liveUrl: "https://www.dyosolana.xyz/",
    color: "#10b981"
  },
  {
    id: 8,
    title: "MOB Tools",
    description: "I created a no code solution providing tools on Solana like Rise Vaults, NFT Staking and Raffle with a user friendly dashboard for projects to setup",
    tags: ["Next.js", "Express", "Rust", "MongoDB", "Typescript"],
    images: ["/project-previews/mobtools/1.png", "/project-previews/mobtools/2.png", "/project-previews/mobtools/3.png"],
    liveUrl: "https://mobtools.in",
    color: "#10b981"
  },
  {
    id: 9,
    title: "Discord Mafia Bot",
    description: "Clone of OG Mafia Bot which was shut down. This bot is a recreation of the original Mafia Bot with additional features and improvements.",
    tags: ["Discord API", "Typescript", "MongoDB"],
    images: ["/project-previews/mafia-clone/1.png", "/project-previews/mafia-clone/2.png", "/project-previews/mafia-clone/3.png"],
    color: "#10b981",
    githubUrl: "https://github.com/Utsav1106/discord-mafia-bot"
  },
  {
    id: 10,
    title: "Zalez Expeditions",
    description: "An engaging platform for Zalez NFT holders to explore and participate in expeditions, enhancing community interaction.",
    tags: ["Express", "Next.js", "Tailwind CSS", "MongoDB"],
    images: ["/project-previews/zalez/1.png", "/project-previews/zalez/2.png"],
    color: "#10b981"
  },
];

const HoverPreview = ({ project, position }: { project: Project | null, position: { x: number, y: number } }) => (
  <AnimatePresence>
    {project && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ ease: "easeOut", duration: 0.2 }}
        className="fixed z-[99] pointer-events-none hidden md:block"
        style={{ left: position.x + 20, top: position.y - 100 }}
      >
        <div className="w-72 h-44 rounded-lg overflow-hidden shadow-2xl border-2 relative border-white/20 bg-gray-900">
          <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const MultiItemCarousel = ({ images }: { images: string[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full flex-shrink-0 bg-gray-100 dark:bg-black/20">
      <div
        ref={scrollRef}
        className="flex h-full overflow-x-auto px-8 py-4"
      >
        <div className="flex h-full items-center gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="w-auto h-56 md:h-96 flex-shrink-0 snap-center overflow-hidden rounded-3xl border-6 border-white dark:border-zinc-900 shadow-md"
            >
              <img
                src={img}
                alt={`${index} screenshot ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-sm transition hover:bg-white"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-sm transition hover:bg-white"
          >
            <FaChevronRight />
          </button>
        </>
      )}
    </div>
  );
};

const ProjectDetailDialog = ({ project, onClose }: { project: Project | null, onClose: () => void }) => {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [project]);

  if (!project) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full overflow-auto max-w-4xl h-full max-h-[90vh] bg-white dark:bg-[#18181B] rounded-2xl shadow-2xl flex flex-col"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-black/30 hover:text-white hover:scale-110"
          >
            <FaTimes size={20} />
          </button>

          <MultiItemCarousel images={project.images} />

          <div className="flex-grow p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div className="flex-grow">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full transition-colors bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                    <FaGithub size={18} />
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors" style={{ backgroundColor: `${project.color}20`, color: project.color }}>
                    <FaExternalLinkAlt /> View Live
                  </a>
                )}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 my-6">{project.description}</p>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tech) => (
                  <span key={tech} className="px-3 py-1 text-sm font-medium rounded-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body // Render directly to the body
  );
};
export const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleMouseMove = (e: React.MouseEvent, project: Project) => {
    setHoveredProject(project);
    setPreviewPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.projects-header',
        { autoAlpha: 0, x: -50 },
        { autoAlpha: 1, x: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } }
      );

      gsap.utils.toArray<HTMLElement>('.project-row').forEach((row) => {
        gsap.fromTo(row,
          { autoAlpha: 0, y: 50 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 95%' } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <HoverPreview project={hoveredProject} position={previewPosition} />
      <ProjectDetailDialog project={selectedProject} onClose={() => setSelectedProject(null)} />

      <section ref={sectionRef} id="projects" className="relative py-24 bg-gray-50 dark:bg-black">
        <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10" style={{ backgroundImage: `radial-gradient(circle, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`, backgroundSize: '2rem 2rem' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="projects-header mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
              Project Showcase
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
              A curated collection of my projects, showcasing my skills in design, development, and problem-solving.
            </p>
          </div>
        </div>
        <div className="projects-container max-w-6xl px-6 mx-auto space-y-4">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-row group relative p-4 rounded-xl border transition-all duration-300 bg-white/70 border-gray-200 hover:border-blue-500/50 dark:bg-gray-900/50 dark:border-gray-800 dark:hover:border-blue-500/50 backdrop-blur-md hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
              onMouseMove={(e) => handleMouseMove(e, project)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => setSelectedProject(project)}
            >
              <div className="grid grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[auto_1fr_auto]">
                <div className="text-xl font-bold opacity-20 text-gray-500 dark:text-gray-400 hidden md:block">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="w-full">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white md:text-xl">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((tech) => (
                      <span key={tech} className="px-2 py-1 text-xs font-medium rounded-md bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center self-start gap-3">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full transition-colors duration-200 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white">
                      <FaGithub />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full transition-colors duration-200 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white">
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};