"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { FaEnvelope, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { EMAIL, GITHUB, LINKEDIN, TWITTER } from '@/config';


interface TerminalCommand {
    command: string;
    output: string;
    type: 'info' | 'success' | 'error' | 'warning';
}

const initialCommands: TerminalCommand[] = [
    {
        command: 'whoami',
        output: 'Utsav Saini - Full Stack Developer & AI Enthusiast',
        type: 'info'
    },
    {
        command: 'ls skills/',
        output: 'TypeScript  Node.js  Python  AI/ML  NextJS  GraphQL',
        type: 'success'
    },
    {
        command: 'cat contact.txt',
        output: 'Ready to collaborate on your next project!',
        type: 'info'
    }
];

export const Contact = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [commands, setCommands] = useState<TerminalCommand[]>(initialCommands);
    const [currentInput, setCurrentInput] = useState('');

    useEffect(() => {
        if (terminalRef.current) {
            const terminalBody = terminalRef.current.querySelector('.terminal-body');
            if (terminalBody) {
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        }
    }, [commands]);

    const contactCommands: { [key: string]: TerminalCommand } = {
        'help': { command: 'help', output: 'Available commands: email, linkedin, github, skills, hire, clear', type: 'info' },
        'email': { command: 'email', output: `Opening mail client... ${EMAIL}`, type: 'success' },
        'linkedin': { command: 'linkedin', output: `Opening LinkedIn... https://linkedin.com/in/${LINKEDIN}`, type: 'success' },
        'github': { command: 'github', output: `Opening GitHub... https://github.com/${GITHUB}`, type: 'success' },
        'skills': { command: 'skills', output: 'Frontend: React, Next.js, TypeScript\nBackend: Node.js, Python, PostgreSQL\nAI/ML: TensorFlow, PyTorch\nWeb3: Solidity, Rust', type: 'success' },
        'hire': { command: 'hire', output: `Excellent choice! Please send an email to ${EMAIL}.`, type: 'success' },
        'clear': { command: 'clear', output: '', type: 'info' }
    };

    const executeCommand = useCallback((input: string) => {
        const trimmedInput = input.trim().toLowerCase();

        if (trimmedInput === 'clear') {
            setCommands([]);
            return;
        }

        const userCommand: TerminalCommand = { command: `$ ${input}`, output: '', type: 'info' };
        setCommands(prev => [...prev, userCommand]);

        setTimeout(() => {
            const response = contactCommands[trimmedInput];
            if (response) {
                setCommands(prev => [...prev, response]);

                if (trimmedInput === 'linkedin') setTimeout(() => window.open(`https://linkedin.com/in/${LINKEDIN}`, '_blank'), 500);
                else if (trimmedInput === 'github') setTimeout(() => window.open(`https://github.com/${GITHUB}`, '_blank'), 500);
                else if (trimmedInput === 'email') setTimeout(() => window.location.href = `mailto:${EMAIL}`, 500);

            } else {
                const errorResponse: TerminalCommand = { command: '', output: `Command not found: ${input}. Type 'help' for a list of commands.`, type: 'error' };
                setCommands(prev => [...prev, errorResponse]);
            }
        }, 300);
    }, [contactCommands, EMAIL, LINKEDIN, GITHUB]);


    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentInput.trim()) {
            executeCommand(currentInput);
            setCurrentInput('');
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(sectionRef.current,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 90%' } }
            );

            gsap.fromTo('.contact-header',
                { autoAlpha: 0, y: -50 },
                { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.contact-header', start: 'top 90%' } }
            );

            gsap.fromTo('.interactive-column',
                { autoAlpha: 0, x: -50 },
                { autoAlpha: 1, x: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.interactive-column', start: 'top 85%' } }
            );

            gsap.fromTo('.direct-contact-column',
                { autoAlpha: 0, x: 50 },
                { autoAlpha: 1, x: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.direct-contact-column', start: 'top 85%' } }
            );

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="contact" className="relative py-24 bg-gray-50 dark:bg-black">
            <div className="absolute inset-0 z-0 opacity-20 dark:opacity-5" style={{ backgroundImage: `radial-gradient(circle, rgba(0, 128, 255, 0.1) 1px, transparent 1px)`, backgroundSize: '2rem 2rem' }} />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="contact-header text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
                        Let's Connect
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
                        Have a project in mind or just want to say hello? Feel free to reach out.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="interactive-column">
                        <div ref={terminalRef} className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-sm">
                            <div className="bg-gray-100 dark:bg-gray-800/80 px-4 py-2 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700/50">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="terminal-body h-80 overflow-y-auto p-4 font-mono text-sm" onClick={() => inputRef.current?.focus()}>
                                <div className="space-y-2">
                                    {commands.map((cmd, index) => (
                                        <div key={index}>
                                            {cmd.command && <p><span className="text-green-600 dark:text-green-400">$</span> <span className="text-gray-800 dark:text-gray-200">{cmd.command.replace('$ ', '')}</span></p>}
                                            {cmd.output && <p className={`whitespace-pre-wrap ${cmd.type === 'error' ? 'text-red-500' : cmd.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>{cmd.output}</p>}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-green-600 dark:text-green-400">$</span>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={currentInput}
                                        onChange={(e) => setCurrentInput(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className="bg-transparent text-gray-800 dark:text-white outline-none w-full"
                                        placeholder="Type 'help'..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Get in Touch</h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, icon: FaEnvelope },
                                { title: 'LinkedIn', value: LINKEDIN, href: `https://linkedin.com/in/${LINKEDIN}`, icon: FaLinkedin },
                                { title: 'GitHub', value: GITHUB, href: `https://github.com/${GITHUB}`, icon: FaGithub },
                                { title: 'Twitter', value: TWITTER, href: `https://twitter.com/${TWITTER}`, icon: FaTwitter },
                            ].map((contact, index) => {
                                const Icon = contact.icon;
                                return (
                                    <a key={index} href={contact.href} target="_blank" rel="noopener noreferrer" className="group block">
                                        <div className="p-4 flex items-center gap-4 rounded-lg border border-gray-200 bg-white/80 dark:border-gray-800 dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg">
                                            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 group-hover:text-blue-500">
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white"> {contact.title}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{contact.value}</p>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                        <div className="mt-6 p-4 rounded-lg border border-green-500/30 bg-green-500/10 text-sm">
                            <p className="flex items-center gap-2 font-medium text-green-800 dark:text-green-300">
                                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                                Status: Available for new opportunities
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};