import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, User, Building2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/list-your-pg", label: "List your PG", icon: Building2 },
  ];

  const isActive = (path: string) => location.pathname === path;

  const userInitials = user?.user_metadata?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0].toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border safe-top">
      <div className="container flex items-center justify-between h-14 md:h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">Find a PG</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {loading ? (
            <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <Link to="/profile">
              <Avatar className="w-9 h-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          {!loading && user && (
            <Link to="/profile">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="tap-target">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="font-bold text-lg">Menu</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <nav className="flex-1 p-4">
                  <div className="space-y-1">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors tap-target ${
                            isActive(link.href)
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </nav>
                <div className="p-4 border-t border-border">
                  {user ? (
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button className="w-full gap-2" size="lg">
                        <User className="w-4 h-4" />
                        My Profile
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button className="w-full gap-2" size="lg">
                        <LogIn className="w-4 h-4" />
                        Login / Sign Up
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
