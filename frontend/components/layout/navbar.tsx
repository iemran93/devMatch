"use client";
import { ChevronsDown, Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Button } from "../ui/button";
import { ToggleTheme } from "./toogle-theme";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Handle scroll effect for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links for both desktop and mobile
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#projects", label: "Projects" },
    // { href: "/#features", label: "Features" },
    // { href: "/#pricing", label: "Pricing" },
    // { href: "/#contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl">devMatch</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-6 text-sm">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link href="/dashboard" className="transition hover:text-primary">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {/* Theme toggle - visible on all screen sizes */}
          <ToggleTheme />
          
          {/* Mobile menu button - only visible on mobile */}
          <div className="block md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                      <span className="font-bold text-xl">devMatch</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {navLinks.map((link) => (
                    <Button 
                      key={link.href} 
                      asChild 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  ))}
                  {isAuthenticated && (
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  )}
                  {isAuthenticated ? (
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2 mt-2">
                      <Button 
                        asChild 
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button 
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/register">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
                <SheetFooter className="mt-auto">
                  <Separator className="my-4" />
                  <ToggleTheme />
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Auth buttons / User menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name}`} alt={user?.name || 'User'} />
                    <AvatarFallback>{user?.name?.substring(0, 2) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => logout()}
                  className="cursor-pointer"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
