"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/estimator", label: "估价器" },
  { href: "/analysis", label: "市场分析" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 bg-dk-950/80 backdrop-blur-xl border-b border-ac-blue/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ac-blue to-ac-cyan flex items-center justify-center animate-pulse-glow">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"
                />
              </svg>
            </div>
            <div className="flex items-baseline">
              <span className="font-bold text-lg text-white">房产智能门户</span>
              <span className="text-xs text-slate-600 ml-2 hidden sm:inline">多应用平台</span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-ac-blue after:content-[''] after:absolute after:bottom-[-1px] after:left-1/2 after:-translate-x-1/2 after:w-[70%] after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-ac-blue after:to-transparent after:rounded-full"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              接口在线
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
