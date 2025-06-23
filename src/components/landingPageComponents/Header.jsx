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
import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import { Mail, Moon, MoreVertical, Sun } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TextEffect } from "../ui/text-effect";
import "./header.css";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();

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

            <a href={user ? `/platform/${generateSignString(user?.organization_name)}/` : "/"} className="headerLogo">
              <>
                {/* Light mode logo (visible only in light mode) */}
                <Image
                  src="/images/logo/twiq_method_logo_black.png"
                  width={600}
                  height={600}
                  alt="TWIQ Logo Light"
                  className="hl_logo block dark:hidden"
                />

                {/* Dark mode logo (visible only in dark mode) */}
                <Image
                  src="/images/logo/twiq_method_logo_white.png"
                  width={600}
                  height={600}
                  alt="TWIQ Logo Dark"
                  className="hl_logo hidden dark:block"
                />
              </>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="cursor-pointer text-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
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
                  className="cursor-pointer text-white hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
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
