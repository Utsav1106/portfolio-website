"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaTerminal, FaEnvelope, FaGithub, FaLinkedin, FaTwitter, FaCircle } from "react-icons/fa";

const EMAIL = "utsavsaini1106@gmail.com";
const SOCIALS = [
    { name: "github", url: "https://github.com/Utsav1106" },
    { name: "linkedin", url: "https://linkedin.com/in/utsav-saini" },
    { name: "twitter", url: "https://twitter.com/Utsav_256" },
];

const TerminalDisplay = () => {
    const [lines, setLines] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [lines]);

    useEffect(() => {
        const bootSequence = [
            "guest@portfolio:~$ initiate_handshake --secure",
            "> Resolving host: utsav.dev...",
            "> [SUCCESS] Connection established (24ms)",
            "> Fetching developer profile...",
            "> [SUCCESS] Name: Utsav Saini",
            "> [SUCCESS] Role: Full-Stack Developer",
            "> [INFO] Status: OPEN_TO_WORK",
            "----------------------------------------",
            "> Session ready. Waiting for input..._"
        ];

        let delay = 0;
        setLines([]);

        bootSequence.forEach((line, index) => {

            const typingTime = Math.random() * 400 + 300;

            setTimeout(() => {
                setLines(prev => [...prev, line]);
            }, delay);

            delay += typingTime;
        });

    }, []);

    return (
        <div className="h-full w-full overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] shadow-xl flex flex-col font-mono text-xs sm:text-sm transition-colors duration-300">

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-400" />
                        <div className="h-3 w-3 rounded-full bg-yellow-400" />
                        <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 dark:text-neutral-500 text-xs select-none">
                    <FaTerminal />
                    <span>bash — 80x24</span>
                </div>
                <div className="w-10" />
            </div>

            <div
                ref={containerRef}
                className="flex-1 p-4 md:p-6 overflow-y-auto bg-white dark:bg-black/50 font-mono"
            >
                <div className="flex flex-col gap-1.5">
                    {lines.map((line, i) => (
                        <div key={i} className="break-words leading-relaxed">
                            <span className={`${line.startsWith("guest") ? "text-purple-600 dark:text-purple-400 font-bold" :
                                    line.includes("[SUCCESS]") ? "text-green-600 dark:text-green-400" :
                                        line.includes("[INFO]") ? "text-blue-600 dark:text-blue-400" :
                                            line.startsWith(">") ? "text-gray-500 dark:text-gray-400" :
                                                "text-gray-800 dark:text-gray-300"
                                }`}>
                                {line}
                            </span>

                            {i === lines.length - 1 && line.endsWith("_") && (
                                <motion.span
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className="inline-block w-2 h-4 bg-gray-800 dark:bg-gray-200 ml-1 align-middle"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const Contact = () => {
    return (
        <section id="contact" className="relative min-h-screen lg:min-h-[650px] w-full flex items-center justify-center bg-gray-50 dark:bg-black overflow-hidden py-16 lg:py-20 transition-colors duration-300">

            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl px-6">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">

                    <div className="flex flex-col justify-center space-y-8">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-6">
                                Let's <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-gradient">
                                    connect.
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-neutral-400 leading-relaxed max-w-md">
                                Ready to build something extraordinary? Whether it's a Web3 protocol or a high-performance platform, let's turn your vision into reality.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <a href={`mailto:${EMAIL}`} className="group flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 transition-all hover:border-gray-300 dark:hover:border-white/20 hover:shadow-lg dark:hover:bg-white/10">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-white text-gray-900 dark:text-black transition-transform group-hover:scale-110">
                                    <FaEnvelope size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-neutral-400 font-bold uppercase tracking-wider">Email Me</p>
                                    <p className="text-base font-semibold text-gray-900 dark:text-white">{EMAIL}</p>
                                </div>
                            </a>

                            <div className="flex gap-4 pt-2">
                                {SOCIALS.map((social, idx) => (
                                    <a
                                        key={idx}
                                        href={social.url}
                                        target="_blank"
                                        className="h-12 w-12 flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-white hover:text-black dark:hover:text-black hover:scale-110 transition-all duration-300"
                                        aria-label={`Visit my ${social.name} profile`}
                                    >
                                        {social.name === 'github' && <FaGithub size={22} />}
                                        {social.name === 'linkedin' && <FaLinkedin size={22} />}
                                        {social.name === 'twitter' && <FaTwitter size={22} />}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] md:h-[400px] w-full relative">
                        <TerminalDisplay />
                    </div>

                </div>
            </div>
        </section>
    );
};