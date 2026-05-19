import Link from "next/link";
import { Badge } from "../ui/badge";
import { ArrowUp, Plus } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-24">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base */}
        <div className="absolute inset-0 bg-[#050816]" />

        {/* Main gradients */}
        <div className="absolute left-1/2 top-[8%] h-140 w-184 -translate-x-1/2 rounded-full bg-violet-700/30 blur-[160px]" />

        <div className="absolute bottom-[-12%] left-[8%] h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[140px]" />

        <div className="absolute right-[4%] top-[18%] h-80 w-80 rounded-full bg-blue-500/20 blur-[140px]" />

        <div className="absolute left-[14%] top-[30%] h-48 w-48 rounded-full bg-cyan-400/10 blur-[120px]" />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px] opacity-70" />

        {/* Fade */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        {/* Badge */}
        <Link href="/sign-up" className="group relative mb-10 inline-block">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-70" />

          <Badge className="relative overflow-hidden rounded-full border border-white/10 bg-white/5 p-5 text-sm font-medium text-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-2xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white">
            {/* Shine */}
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

            {/* NEW pill */}
            <span className="relative mr-3 rounded-full border border-violet-400/30 bg-violet-500/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-100">
              New
            </span>

            {/* Text */}
            <span className="relative tracking-[-0.01em]">
              Introducing a smarter AI experience
            </span>

            {/* Arrow */}
            <span className="relative ml-3 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
              →
            </span>
          </Badge>
        </Link>

        {/* Heading */}
        <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white drop-shadow-[0_16px_50px_rgba(0,0,0,0.35)] sm:text-6xl md:text-7xl lg:text-8xl">
          Build beautiful apps
          <br />
          with AI
        </h1>

        {/* Subtitle */}
        <p className="mt-7 max-w-3xl text-balance text-lg leading-relaxed text-white/62 sm:text-xl md:text-[1.15rem]">
          Create polished websites and applications by describing what you want.
          Get fast, modern, production-ready UI with a premium feel.
        </p>

        {/* Input Card */}
        <div className="mt-14 w-full max-w-4xl">
          <Link href="/sign-up">
            <div className="group rounded-[2rem] border border-white/10 bg-white/4 p-2 shadow-[0_24px_120px_rgba(76,29,149,0.28)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/6">
              <div className="rounded-[1.6rem] border border-white/5 bg-black/40">
                {/* Input area */}
                <div className="px-6 pt-6 md:px-8 md:pt-8">
                  <p className="text-left text-[15px] leading-6 text-white/45 transition-colors group-hover:text-white/55 md:text-base">
                    Ask AI to create a modern SaaS landing page with glass cards,
                    strong type, and subtle motion...
                  </p>
                </div>

                {/* Bottom actions */}
                <div className="flex items-center justify-between gap-4 px-4 pb-4 pt-8 md:px-5 md:pb-5">
                  {/* Left */}
                  <div className="flex items-center gap-3">
                    <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/5 bg-white/4 text-white/50 transition-all hover:bg-white/8 hover:text-white/80">
                      <Plus className="h-5 w-5" />
                    </button>

                    <div className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs font-medium text-white/55 sm:flex">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.75)]" />
                      Ready to generate
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border border-white/10 bg-white/4 px-4 py-1.5 text-sm font-medium text-white/72">
                      Plan
                    </div>

                    <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_24px_rgba(255,255,255,0.35)]">
                      <ArrowUp className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom text */}
        <p className="mt-6 text-sm text-white/35">
          No credit card required · Launch in minutes
        </p>
      </div>
    </section>
  );
};

export default Hero;
