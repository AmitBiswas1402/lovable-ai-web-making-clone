"use client";

import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

import Link from "next/link";
import { Button } from "../ui/button";

const Navbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto mt-4 flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/3 px-6 backdrop-blur-2xl">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          {/* Logo dot */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
            <div className="h-2 w-2 rounded-full bg-white" />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-none">
            <span className="text-sm font-medium tracking-wide text-white/60">
              AI
            </span>

            <span className="text-lg font-semibold tracking-tight text-white">
              Builder
            </span>
          </div>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="rounded-xl border border-white/10 bg-white/3 px-5 text-white/80 backdrop-blur-xl transition-all duration-300 hover:bg-white/8 hover:text-white"
                >
                  Log in
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button className="rounded-xl bg-white px-5 text-black transition-all duration-300 hover:scale-[1.02] hover:bg-white/90">
                  Get Started
                </Button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="rounded-xl border border-white/10 bg-white/3 px-5 text-white/80 backdrop-blur-xl transition-all duration-300 hover:bg-white/8 hover:text-white"
                >
                  Dashboard
                </Button>
              </Link>

              <div className="ml-1">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "h-10 w-10 ring-2 ring-white/10 transition-all hover:ring-white/20",
                    },
                  }}
                />
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;