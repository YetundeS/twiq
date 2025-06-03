"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ui/theme-provider";
import { SITE_CONTENT } from "@/constants/landingPageContent";
import { Mail, Moon, MoreVertical, Sparkles, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TextEffect } from "../ui/text-effect";
import "./header.css";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <header className="absolute top-0 right-0 left-0 z-50 bg-transparent">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="text-2xl font-bold text-purple-600">
              <TextEffect per="char" preset="fade-in-blur" delay={300}>
                {SITE_CONTENT.brand}
              </TextEffect>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10"></div>
              <div className="h-10 w-10"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="navbarComp absolute top-0 right-0 left-0 z-50 bg-transparent">
      <div className="navbarInner_box mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <div
              className="group flex cursor-pointer items-center space-x-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Link href={"/"}>
                <div className="text-3xl font-bold text-purple-600 transition-all duration-300 group-hover:scale-105 dark:text-purple-400">
                  <TextEffect per="char" preset="fade-in-blur">
                    {SITE_CONTENT.brand}
                  </TextEffect>
                </div>
              </Link>
              <Sparkles
                className={`size-6 text-purple-600 transition-all duration-500 dark:text-purple-400 ${
                  isHovered
                    ? "scale-110 rotate-12 animate-pulse opacity-100"
                    : "scale-75 rotate-0 opacity-0"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="cursor-pointer text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
              {theme === "dark" ? (
                <Sun className="size-6" />
              ) : (
                <Moon className="size-6" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <MoreVertical className="size-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2">
                <DropdownMenuItem className="cursor-pointer rounded-2xl p-2">
                  <a href="/terms-of-service" className="w-full py-1 pl-2">
                    Terms of Service
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-2xl p-2">
                  <a href="/privacy-policy" className="w-full py-1 pl-2">
                    Privacy Policy
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-2xl p-2">
                  <a
                    href="mailto:hello@twiq.com"
                    className="flex w-full items-center py-1 pl-2"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email us
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
