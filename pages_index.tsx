import React, { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";

type Skill = { name: string; level: number };
type Experience = {
  title: string;
  company: string;
  date: string;
  description: string;
};
type Project = {
  title: string;
  description: string;
  tags: string[];
  category: "web" | "mobile" | "ai";
};

export default function HomePage(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "web" | "mobile" | "ai">("all");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");

  const heroRef = useRef<HTMLElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const skillsSectionRef = useRef<HTMLElement | null>(null);
  const skillRefs = useRef<HTMLDivElement[]>([]);
  const timelineRefs = useRef<HTMLDivElement[]>([]);
  const portfolioRefs = useRef<HTMLDivElement[]>([]);
  const contactRef = useRef<HTMLElement | null>(null);

  const skills: Skill[] = useMemo(
    () => [
      { name: "UI/UX Design", level: 90 },
      { name: "Frontend Development", level: 85 },
      { name: "Backend Development", level: 75 },
      { name: "Project Management", level: 80 },
    ],
    []
  );

  const experiences: Experience[] = useMemo(
    () => [
      {
        title: "Senior Product Designer",
        company: "Tech Innovations Inc.",
        date: "2020 - Present",
        description:
          "Leading design initiatives for enterprise SaaS products, managing a team of 5 designers, and implementing design systems that improved development efficiency by 40%.",
      },
      {
        title: "UX Designer",
        company: "Digital Solutions Ltd.",
        date: "2018 - 2020",
        description:
          "Designed user interfaces for mobile and web applications, conducted user research, and created prototypes that increased user engagement by 60%.",
      },
      {
        title: "Junior Developer",
        company: "StartUp Hub",
        date: "2016 - 2018",
        description:
          "Developed responsive websites and web applications, collaborated with senior developers, and gained expertise in modern web technologies.",
      },
    ],
    []
  );

  const projects: Project[] = useMemo(
    () => [
      {
        title: "E-Commerce Platform",
        description:
          "A modern e-commerce solution with AI-powered recommendations and seamless checkout experience.",
        tags: ["React", "Node.js", "MongoDB"],
        category: "web",
      },
      {
        title: "Task Management App",
        description:
          "Mobile-first task management application with real-time collaboration features.",
        tags: ["React Native", "Firebase"],
        category: "mobile",
      },
      {
        title: "AI Chat Assistant",
        description:
          "Intelligent chatbot powered by machine learning for customer support automation.",
        tags: ["Python", "TensorFlow", "NLP"],
        category: "ai",
      },
      {
        title: "Analytics Dashboard",
        description:
          "Real-time analytics dashboard with interactive visualizations and custom reporting.",
        tags: ["Vue.js", "D3.js", "PostgreSQL"],
        category: "web",
      },
      {
        title: "Fitness Tracker",
        description:
          "Comprehensive fitness tracking app with workout plans and progress monitoring.",
        tags: ["Flutter", "Dart", "AWS"],
        category: "mobile",
      },
      {
        title: "Image Recognition System",
        description:
          "Deep learning system for object detection and image classification.",
        tags: ["PyTorch", "OpenCV", "Docker"],
        category: "ai",
      },
    ],
    []
  );

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  // Smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    }
  };

  // Parallax effect for hero and background
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.pageYOffset;
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrolled * 0.2}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection Observer for fade-in and skill animation
  useEffect(() => {
    const options: IntersectionObserverInit = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          target.classList.add("visible");
          // Trigger skill bar animation
          if (target.dataset.animateskills === "true") {
            skillRefs.current.forEach((skillEl, idx) => {
              if (!skillEl) return;
              const bar = skillEl.querySelector(".skill-level") as HTMLElement | null;
              if (bar) {
                setTimeout(() => {
                  bar.style.width = `${skills[idx]?.level ?? 0}%`;
                }, idx * 200);
              }
            });
          }
        }
      });
    }, options);

    const toObserve: HTMLElement[] = [];
    if (skillsSectionRef.current) {
      skillsSectionRef.current.dataset.animateskills = "true";
      toObserve.push(skillsSectionRef.current);
    }
    timelineRefs.current.forEach((el) => el && toObserve.push(el));
    portfolioRefs.current.forEach((el) => el && toObserve.push(el));
    if (contactRef.current) toObserve.push(contactRef.current);

    toObserve.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [skills]);

  // 3D tilt effect for cards
  const addTilt = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
  };
  const removeTilt = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = e.currentTarget;
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
  };

  // Contact form submit simulation
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setFormStatus("error");
      return;
    }
    setFormStatus("success");
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setFormStatus("idle"), 3000);
  };

  return (
    <>
      <Head>
        <title>John Doe - Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-black text-white overflow-x-hidden relative">
        {/* Animated background */}
        <div
          ref={parallaxRef}
          className="fixed inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 10% 20%, rgba(0,255,136,0.12) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(0,168,255,0.12) 0%, transparent 20%), radial-gradient(circle at 50% 50%, rgba(255,0,128,0.08) 0%, transparent 30%)",
            animation: "bgMove 20s infinite alternate ease-in-out",
          }}
        />

        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
              John Doe
            </div>
            <ul className="hidden md:flex gap-8">
              <li>
                <a
                  href="#home"
                  onClick={(e) => handleSmoothScroll(e, "home")}
                  className="text-white/80 hover:text-emerald-400 transition relative py-1"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleSmoothScroll(e, "about")}
                  className="text-white/80 hover:text-emerald-400 transition relative py-1"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  onClick={(e) => handleSmoothScroll(e, "skills")}
                  className="text-white/80 hover:text-emerald-400 transition relative py-1"
                >
                  Skills
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  onClick={(e) => handleSmoothScroll(e, "experience")}
                  className="text-white/80 hover:text-emerald-400 transition relative py-1"
                >
                  Experience
                </a>
              </li>
              <li>
                <a
                  href="#portfolio"
                  onClick={(e) => handleSmoothScroll(e, "portfolio")}
                  className="text-white/80 hover:text-emerald-400 transition relative py-1"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleSmoothScroll(e, "contact")}
                  className="text-white/80 hover:text-emerald-400 transition relative py-1"
                >
                  Contact
                </a>
              </li>
            </ul>

            <button
              aria-label="Toggle menu"
              className="md:hidden flex flex-col gap-1.5 z-50"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span
                className={`block w-6 h-0.5 bg-white transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span className={`block w-6 h-0.5 bg-white transition ${menuOpen ? "opacity-0" : ""}`} />
              <span
                className={`block w-6 h-0.5 bg-white transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden fixed top-0 left-0 h-screen w-2/3 bg-black/95 backdrop-blur-md border-r border-white/10 transition-transform duration-300 ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="px-6 pt-24 flex flex-col gap-6">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "skills", label: "Skills" },
                { id: "experience", label: "Experience" },
                { id: "portfolio", label: "Portfolio" },
                { id: "contact", label: "Contact" },
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleSmoothScroll(e, link.id)}
                  className="text-lg text-white/80 hover:text-emerald-400 transition"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section
          id="home"
          ref={heroRef as React.RefObject<HTMLElement>}
          className="relative min-h-screen flex items-center justify-center text-center px-6"
        >
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              John Doe
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              Creative Developer & Designer
            </p>
            <p className="text-base md:text-lg text-white/70 mb-10">
              Crafting digital experiences that inspire and innovate
            </p>
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "contact")}
              className="inline-block px-8 py-3 rounded-full font-semibold text-black bg-gradient-to-r from-emerald-400 to-sky-400 shadow-lg hover:shadow-emerald-500/30 transition-transform hover:-translate-y-1"
            >
              Get In Touch
            </a>
          </div>
        </section>

        {/* About */}
        <section id="about" className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white/80 leading-relaxed space-y-4">
              <p>
                I&apos;m a passionate creative developer with over 5 years of experience in crafting exceptional digital experiences. My expertise spans across web development, UI/UX design, and creating innovative solutions that bridge the gap between aesthetics and functionality.
              </p>
              <p>
                I believe in the power of clean code, intuitive design, and continuous learning. Every project is an opportunity to push boundaries and create something extraordinary.
              </p>
              <p>
                When I&apos;m not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through tech blogs and community workshops.
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-72 h-96 rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-400 p-1 rotate-3 hover:rotate-0 transition-transform">
                <div className="w-full h-full rounded-2xl bg-neutral-900 flex items-center justify-center text-white/60">
                  <div className="text-center">
                    <div className="mx-auto mb-4">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                    </div>
                    <p>Professional Headshot</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" ref={skillsSectionRef} className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((s, i) => (
              <div
                key={s.name}
                ref={(el) => {
                  if (el) skillRefs.current[i] = el;
                }}
                onMouseMove={addTilt}
                onMouseLeave={removeTilt}
                className="group bg-white/10 border border-white/10 rounded-xl p-6 backdrop-blur-md transition-transform hover:-translate-y-2 hover:shadow-xl hover:border-emerald-400/30"
              >
                <h3 className="text-emerald-400 font-semibold mb-3">{s.name}</h3>
                <div className="h-2 rounded bg-white/10 overflow-hidden">
                  <div
                    className="skill-level h-full rounded bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-1000"
                    style={{ width: "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            Professional Journey
          </h2>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-400 to-sky-400" />
            <div className="space-y-12">
              {experiences.map((exp, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <div
                    key={exp.title + exp.date}
                    ref={(el) => {
                      if (el) timelineRefs.current[idx] = el;
                    }}
                    className={`relative md:w-1/2 px-6 fade-in ${isLeft ? "md:pr-16 md:text-right md:ml-0 md:mr-auto" : "md:pl-16 md:ml-auto"}`}
                  >
                    <div
                      className={`hidden md:block absolute top-6 w-5 h-5 rounded-full bg-emerald-400 shadow-[0_0_15px] shadow-emerald-400/70 ${isLeft ? "-right-2" : "-left-2"}`}
                    />
                    <div
                      onMouseMove={addTilt}
                      onMouseLeave={removeTilt}
                      className="bg-white/10 border border-white/10 rounded-xl p-6 backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-xl hover:border-emerald-400/30"
                    >
                      <h3 className="text-emerald-400 font-semibold mb-1">{exp.title}</h3>
                      <p className="text-white/70 text-sm mb-1">{exp.company}</p>
                      <p className="text-white/50 text-sm mb-3">{exp.date}</p>
                      <p className="text-white/80">{exp.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section id="portfolio" className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {[
              { key: "all", label: "All" },
              { key: "web", label: "Web Design" },
              { key: "mobile", label: "Mobile Apps" },
              { key: "ai", label: "AI/ML" },
            ].map((btn) => {
              const active = selectedCategory === (btn.key as any);
              return (
                <button
                  key={btn.key}
                  onClick={() => setSelectedCategory(btn.key as any)}
                  className={`px-4 py-2 rounded-full border transition ${
                    active
                      ? "bg-gradient-to-r from-emerald-400 to-sky-400 text-black border-transparent shadow-md"
                      : "bg-transparent text-white/80 border-white/20 hover:bg-emerald-400/10 hover:border-emerald-400/30"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((p, i) => (
              <div
                key={p.title}
                ref={(el) => {
                  if (el) portfolioRefs.current[i] = el;
                }}
                onMouseMove={addTilt}
                onMouseLeave={removeTilt}
                className="group bg-white/10 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md transition-transform hover:-translate-y-2 hover:shadow-xl hover:border-emerald-400/30 fade-in"
              >
                <div className="h-48 flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800 text-white/60">
                  <div className="text-center">
                    <div className="mx-auto mb-3">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                    </div>
                    <p>Project Image</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-emerald-400 font-semibold mb-2">{p.title}</h3>
                  <p className="text-white/80 mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-sm px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          ref={contactRef as React.RefObject<HTMLElement>}
          className="relative mt-8 py-24 px-6 bg-gradient-to-br from-neutral-900 to-black overflow-hidden"
        >
          <div
            className="pointer-events-none absolute -inset-1 opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(0,255,136,0.12) 0%, transparent 70%)",
              animation: "float 15s infinite ease-in-out",
            }}
          />
          <div className="relative max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
              Let&apos;s Connect
            </h2>
            <p className="text-white/80 mb-8">
              I&apos;m always interested in hearing about new projects and opportunities.
            </p>

            <form onSubmit={onSubmit} className="text-left">
              <div className="mb-6">
                <label htmlFor="name" className="block mb-2 text-emerald-400 font-medium">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-emerald-400 font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 text-emerald-400 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 min-h-[150px]"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold text-black bg-gradient-to-r from-emerald-400 to-sky-400 shadow-lg hover:shadow-emerald-500/30 transition-transform hover:-translate-y-1"
              >
                Send Message
              </button>

              {formStatus === "success" && (
                <div className="mt-4 text-center text-emerald-400">Thank you for your message! I&apos;ll get back to you soon.</div>
              )}
              {formStatus === "error" && (
                <div className="mt-4 text-center text-rose-400">Please fill in all fields before sending.</div>
              )}
            </form>

            <div className="flex items-center justify-center gap-6 mt-10">
              {[
                { label: "GH", title: "GitHub" },
                { label: "IN", title: "LinkedIn" },
                { label: "TW", title: "Twitter" },
                { label: "IG", title: "Instagram" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  title={s.title}
                  className="w-12 h-12 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-emerald-400 hover:text-black hover:shadow-lg hover:-translate-y-1 transition"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-center text-white/60 px-6 py-8">
          <p>&copy; 2024 John Doe. All rights reserved.</p>
        </footer>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        @keyframes bgMove {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(-30px, -30px) scale(1.1);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(-20px, -20px) rotate(120deg);
          }
          66% {
            transform: translate(20px, -20px) rotate(240deg);
          }
        }
        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        /* Underline hover for nav links */
        nav a {
          position: relative;
        }
        nav a::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #00ff88;
          transition: width 0.3s ease;
        }
        nav a:hover::after {
          width: 100%;
        }
      `}</style>
    </>
  );
}
