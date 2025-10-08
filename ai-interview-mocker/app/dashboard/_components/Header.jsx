"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, {useEffect, useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Questions", href: "/dashboard/questions" },
  { label: "How it works?", href: "/how-it-works" },
];




const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const path = usePathname();
  useEffect(()=>{
    console.log(path);
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <Image
            src="/logo.svg"
            width={140}
            height={40}
            alt="logo"
            priority
            className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative transition-colors duration-300 hover:text-primary after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 ${path===item.href && 'text-blue-500 font-bold'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side desktop */}
        <div className="ml-auto hidden md:flex items-center gap-3">
          <Link
            href="/dashboard/upgrade"
            className={`inline-flex items-center rounded-md border bg-gradient-to-r from-primary/90 to-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm ring-1 ring-inset ring-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-md hover:from-primary hover:to-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60`}
          >
            Upgrade
          </Link>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "shadow ring-2 ring-primary/40 transition-transform duration-300 hover:scale-105",
              },
            }}
          />
        </div>

        {/* Mobile hamburger */}
        <div className="ml-auto md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {mobileMenuOpen ? (
              <X size={24} className="transition-transform duration-300 rotate-90" />
            ) : (
              <Menu size={24} className="transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden absolute top-16 left-0 w-full bg-white shadow-lg border-t z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col space-y-4 p-4 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block py-2 px-3 rounded-md hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/dashboard/upgrade"
              className="block py-2 px-3 rounded-md bg-gradient-to-r from-primary/90 to-primary text-white text-center shadow hover:from-primary hover:to-primary/90 transition-all duration-300 hover:scale-[1.02]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Upgrade
            </Link>
          </li>
          <li className="pt-2">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "shadow ring-2 ring-primary/40 transition-transform duration-300 hover:scale-105",
                },
              }}
            />
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
