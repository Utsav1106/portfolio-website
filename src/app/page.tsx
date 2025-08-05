"use client";

import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Contact } from "@/components/contact";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function Home() {
  return (
    <>
      <ThemeSwitcher />
      <Hero />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}
