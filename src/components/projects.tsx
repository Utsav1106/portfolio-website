"use client";

import { useRef, useState, MouseEvent, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { cn } from "@/utils/helpers";

type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  liveUrl?: string;
};

const Spotlight = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <div
      ref={divRef}
      className={cn("group relative flex overflow-hidden", className)}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 hidden dark:block"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
        }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 block dark:hidden"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(0,0,0,0.05),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const ProjectCard = ({
  project,
  onImageClick
}: {
  project: Project;
  onImageClick: (img: string) => void
}) => {

  const [[page, direction], setPage] = useState([0, 0]);

  const imageIndex = Math.abs(page % project.images.length);
  const hasMultipleImages = project.images.length > 1;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <Spotlight className="rounded-3xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-black/50 py-6 h-full shadow-sm hover:shadow-md dark:shadow-none transition-shadow flex flex-col">
      <div className="relative z-10 flex h-full flex-col justify-between gap-6">


        <div className="flex px-6 items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{project.title}</h3>
          <div className="flex gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                aria-label="View Live Project"
                className="text-gray-500 hover:text-black dark:text-neutral-500 dark:hover:text-white transition-colors"
              >
                <FaExternalLinkAlt size={12} />
              </a>
            )}
          </div>
        </div>


        <div className="space-y-4 px-6 flex-grow">
          <p className="text-gray-600 dark:text-neutral-400 text-sm leading-relaxed">
            {project.description}
          </p>
        </div>


        <div className="mt-auto">

          <div className="relative h-48 w-full overflow-hidden group/slider">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={page}

                src={project.images[imageIndex]}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                onClick={() => onImageClick(project.images[imageIndex])}
                className="absolute inset-0 h-full w-full object-cover cursor-zoom-in"
                alt={project.title}
              />
            </AnimatePresence>


            {hasMultipleImages && (
              <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 pointer-events-none">
                <button
                  onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                  className="pointer-events-auto rounded-full bg-white/80 dark:bg-black/50 p-2 text-gray-900 dark:text-white backdrop-blur-sm hover:bg-white dark:hover:bg-black/80 shadow-sm transition-colors z-20 cursor-pointer"
                  aria-label="Previous Image"
                >
                  <FaChevronLeft size={12} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); paginate(1); }}
                  className="pointer-events-auto rounded-full bg-white/80 dark:bg-black/50 p-2 text-gray-900 dark:text-white backdrop-blur-sm hover:bg-white dark:hover:bg-black/80 shadow-sm transition-colors z-20 cursor-pointer"
                  aria-label="Next Image"
                >
                  <FaChevronRight size={12} />
                </button>


                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                  {project.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${idx === imageIndex
                          ? 'bg-gray-800 dark:bg-white'
                          : 'bg-gray-300 dark:bg-white/20'
                        }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>


          <div className="mt-4 px-6 flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="rounded-full border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900/50 px-3 py-1 text-[10px] font-medium text-gray-600 dark:text-neutral-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Spotlight>
  );
};

export const Projects = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const GridPattern = () => (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-30 dark:opacity-20">
      <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-transparent to-gray-50 dark:from-black dark:via-transparent dark:to-black"></div>
    </div>
  );

  return (
    <section id="projects" className="relative min-h-screen bg-gray-50 dark:bg-black py-24 overflow-hidden transition-colors duration-300">


      <div className="absolute top-0 left-0 z-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 md:w-[800px] md:h-[800px] opacity-50 dark:opacity-25 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-tr from-blue-200 to-cyan-200 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
      </div>
      <div className="absolute bottom-0 right-0 z-0 translate-x-1/4 translate-y-1/4 w-96 h-96 md:w-[600px] md:h-[600px] opacity-50 dark:opacity-25 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-bl from-emerald-200 to-teal-200 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
      </div>

      <GridPattern />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-20 flex flex-col items-center text-center">
          <h2 className="text-sm sm:text-base font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase mb-3">
            Portfolio
          </h2>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white mb-6">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400">Projects</span>
          </h2>
          <p className="max-w-2xl text-gray-600 dark:text-neutral-400 md:text-lg">
            A curated collection of my projects, showcasing my skills in design, development, and problem-solving.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onImageClick={(img) => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>


      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}

            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 md:-right-12 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label="Close Preview"
              >
                <FaTimes size={24} />
              </button>

              <img
                src={selectedImage}
                alt="Project Preview"
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

const projects = [
  {
    id: 1,
    title: "Elly",
    description: "Web3 social feed aggregator that unifies discord, twitter, and on-chain signals for blockchain projects into a single, wallet-authenticated timeline.",
    tags: ["Web Scraping", "Solana Web3",],
    images: ["/project-previews/elly/1.png", "/project-previews/elly/2.png", "/project-previews/elly/3.png"],
    liveUrl: "https://elly-frontend-gamma.vercel.app",
  },
  {
    id: 2,
    title: "MonadGrid NFT Marketplace",
    description: "A decentralized NFT marketplace for trading and showcasing digital assets on Monad blockchain.",
    tags: ["NFT Marketplace", "EVM Blockchain", "Solidity Contract",],
    images: ["/project-previews/monadgrid-marketplace/1.png", "/project-previews/monadgrid-marketplace/2.png"],
    liveUrl: "https://marketplace.monadgrid.com",
  },
  {
    id: 3,
    title: "ETA Labs",
    description: "A pioneering force in the NFT ecosystem. Originating as a revitalized project, evolved into a comprehensive NFT platform offering services.",
    tags: ["NFT Toolkit", "Solana Web3",],
    images: ["/project-previews/etakit/1.png", "/project-previews/etakit/2.png"],
    liveUrl: "https://etalabs-landing.vercel.app",
  },
  {
    id: 4,
    title: "Collective NFT Staking",
    description: "Comprehensive NFT staking solution with multi-token rewards, flexible lock periods, and advanced mechanics for digital assets.",
    tags: ["NFT Staking", "Solana Web3",],
    images: ["/project-previews/nft-staking/1.png", "/project-previews/nft-staking/2.png", "/project-previews/nft-staking/3.png"],
    liveUrl: "https://stake.mobcollective.io",
  },
  {
    id: 5,
    title: "Rise Vaults",
    description: "Advanced token staking platform with flexible reward systems, customizable lock periods, and timed vaults.",
    tags: ["Rust Program", "Solana Web3",],
    images: ["/project-previews/rise-vaults/1.png", "/project-previews/rise-vaults/2.png"],
    liveUrl: "https://vaults.mobcollective.io",
  },
  {
    id: 6,
    title: "dyo | Do your own",
    description: "dyo is transforming into a vibrant community platform on Solana, focusing on utility, growth, and real-world opportunities.",
    tags: ["Staking Protocol", "Solana Web3",],
    images: ["/project-previews/dyo/1.png", "/project-previews/dyo/2.png", "/project-previews/dyo/3.png"],
    liveUrl: "https://dyosolana.vercel.app/",
  },

  {
    id: 7,
    title: "Win3",
    description: "Engaging raffle system with multiple prize types, fair winner selection, and automated distribution.",
    tags: ["Raffle System", "Solana Web3",],
    images: ["/project-previews/raffle-platform/1.png", "/project-previews/raffle-platform/2.png", "/project-previews/raffle-platform/3.png"],
    liveUrl: "https://win3.tech",
  },
  {
    id: 8,
    title: "StackFi",
    description: "StackFi is a decentralized leverage and credit layer that enables capital-efficient DeFi strategies across the Avalanche ecosystem.",
    tags: ["DeFi Protocol", "EVM"],
    images: ["/project-previews/stackfi/1.png", "/project-previews/stackfi/2.png", "/project-previews/stackfi/3.png"],
    liveUrl: "https://stackfi.net",
  },
  {
    id: 9,
    title: "MOB Tools",
    description: "I created a no code solution providing tools on Solana with a user friendly dashboard for projects to setup",
    tags: ["Solana Web3", "Toolkit"],
    images: ["/project-previews/mobtools/1.png", "/project-previews/mobtools/2.png", "/project-previews/mobtools/3.png", "/project-previews/mobtools/4.png"],
    liveUrl: "https://mobtools.in",
  },
  {
    id: 10,
    title: "Zalez Expeditions",
    description: "An engaging platform for Zalez NFT holders to explore and participate in expeditions, enhancing community interaction.",
    tags: ["NFT Gamification", "Solana Web3",],
    images: ["/project-previews/zalez/1.png", "/project-previews/zalez/2.png"],
  },
];