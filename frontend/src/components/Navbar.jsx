import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./navbar.css";
import {
  BookOpen,
  ChefHat,
  ChevronDown,
  ChevronRight,
  Contact,
  Home,
  LogOut,
  Package,
  Search,
  ShoppingBasket,
  User,
  Wallpaper,
  Wheat,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import axios from "../config/api.js";
import { toast } from "react-toastify";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isUrdu, setIsUrdu] = useState(false);
  const [logoFade, setLogoFade] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileUserDropdown, setShowMobileUserDropdown] = useState(false);
  const mobileMenuRef = useRef(null);
  const desktopDropdownRef = useRef(null);
  const {
    user,
    logout,
    logoutAdmin,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    getCartCount,
    isSeller,
    isAdmin,
  } = useAppContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoFade(false);
      setTimeout(() => {
        setIsUrdu((p) => !p);
        setLogoFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (searchQuery.trim().length > 0 && location.pathname !== "/products") {
      navigate("/products");
    }
  }, [searchQuery, location.pathname, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAll = () => {
    setOpen(false);
    setShowUserDropdown(false);
    setShowMobileUserDropdown(false);
    scrollTo(0, 0);
  };
  const navLinks = [
    { label: "Home", href: "/", icon: <Home size={15} /> },
    { label: "Products", href: "/products", icon: <Wheat size={15} /> },
    { label: "Recipes", href: "/recipes", icon: <BookOpen size={15} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-background-alt">
      {/* Main row */}
      <div className="flex items-center justify-between px-6 md:px-6 lg:px-14 xl:px-20 py-3 gap-4 relative">
        {/* Logo */}
        <NavLink
          to="/"
          onClick={() => {
            setOpen(false);
          }}
          className="flex flex-col items-start lg:items-center shrink-0 gap-0.5 no-underline w-21"
        >
          <div className="h-7 overflow-hidden flex items-center ">
            <span
              className={`bk-logo-text${isUrdu ? " urdu" : " latin"}${logoFade ? " visible" : " hidden"}`}
            >
              {isUrdu ? "برکت" : "Barkat"}
            </span>
          </div>
          <div className="bk-logo-ornament">
            <span className="hidden lg:bk-logo-sub">
              Pure · Fresh · Blessed
            </span>
          </div>
        </NavLink>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink key={link.label} to={link.href} className={`bk-link`}>
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Search — desktop */}
        <div className="hidden lg:flex items-center gap-2 border border-background-alt bg-background-alt px-3 py-1.5 rounded-full flex-1 max-w-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <Search size={14} className="text-secondary-alt shrink-0" />
          <input
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            type="text"
            className="bg-transparent outline-none text-sm w-full text-secondary-alt placeholder:text-secondary-alt/60 font-[Inter]"
            placeholder="Search items, dishes…"
          />
        </div>

        {/* Right actions */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Search icon — tablet only */}
          <button className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-secondary-alt hover:bg-background-alt hover:text-primary transition-all">
            <Search size={18} />
          </button>

          {/* Cart */}
          <button
            onClick={() => {
              navigate("basket");
            }}
            className="relative cursor-pointer flex items-center justify-center w-9 h-9 rounded-lg text-secondary-alt hover:bg-background-alt hover:text-primary transition-all"
          >
            <ShoppingBasket size={19} />
            {getCartCount() > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-primary text-background text-[9px] font-bold min-w-3.75 h-3.75 rounded-full flex items-center justify-center border-2 border-background px-0.5 leading-none">
                {getCartCount() > 99 ? "99+" : getCartCount()}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-background-alt mx-1 rounded-full" />

          {/* Login */}
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="px-5 py-2 cursor-pointer bg-primary hover:bg-[#9B3D3D] active:scale-95 transition-all text-background text-sm font-semibold rounded-xl shadow-sm"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              {/* Trigger */}
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-background-alt hover:bg-background-alt transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User size={14} className="text-primary" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] text-secondary-alt font-medium uppercase tracking-wide">
                    Hello,
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                </div>
                <ChevronDown
                  size={13}
                  className={`text-secondary-alt ml-1 transition-transform ${showUserDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {showUserDropdown && (
                <div
                  ref={desktopDropdownRef}
                  className="absolute right-0 top-full mt-2 w-48 bg-background border border-background-alt rounded-2xl shadow-lg overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-background-alt bg-background-alt/50">
                    <p className="text-[10px] font-bold text-secondary-alt uppercase tracking-widest">
                      My Account
                    </p>
                  </div>
                  <div
                    onClick={() => {
                      navigate("orders");
                      closeAll();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-secondary-alt hover:bg-background-alt hover:text-primary cursor-pointer transition-colors border-b border-background-alt"
                  >
                    <Package size={14} />
                    My Orders
                    <ChevronRight
                      size={12}
                      className="ml-auto text-[#d8c4a6]"
                    />
                  </div>
                  <div
                    onClick={() => {
                      navigate("my-recipes");
                      closeAll();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-secondary-alt hover:bg-background-alt hover:text-primary cursor-pointer transition-colors border-b border-background-alt"
                  >
                    <BookOpen size={14} />
                    My Recipes
                    <ChevronRight
                      size={13}
                      className="ml-auto text-[#d8c4a6]"
                    />
                  </div>
                  {isSeller && (
                    <div
                      onClick={() => {
                        navigate("seller");
                        closeAll();
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-secondary-alt hover:bg-background-alt hover:text-primary cursor-pointer transition-colors border-b border-background-alt"
                    >
                      <Wallpaper size={14} />
                      Dashboard
                      <ChevronRight
                        size={13}
                        className="ml-auto text-[#d8c4a6]"
                      />
                    </div>
                  )}
                  {isAdmin && (
                    <div
                      onClick={() => {
                        navigate("admin");
                        closeAll();
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-secondary-alt hover:bg-background-alt hover:text-primary cursor-pointer transition-colors border-b border-background-alt"
                    >
                      <Contact size={14} />
                      Admin
                      <ChevronRight
                        size={13}
                        className="ml-auto text-[#d8c4a6]"
                      />
                    </div>
                  )}
                  <div
                    onClick={async () => {
                      if (isAdmin) await logoutAdmin();
                      else await logout();
                      closeAll();
                      toast.success("Logged Out!");
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-red-700 hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    <LogOut size={14} />
                    Log Out
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger — mobile */}
        <div ref={mobileMenuRef} className="md:hidden flex gap-2">
          <button
            onClick={() => {
              navigate("/basket");
              setOpen(false);
            }}
            className="relative flex items-center justify-center w-11 h-10 rounded-xl border border-background-alt text-secondary-alt hover:bg-background-alt transition-all"
          >
            <ShoppingBasket size={18} />
            {getCartCount() > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-primary text-background text-[9px] font-bold min-w-3.75 h-3.75 rounded-full flex items-center justify-center border-2 border-background px-0.5 leading-none">
                {getCartCount() > 99 ? "99+" : getCartCount()}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setOpen((p) => !p);
            }}
            aria-label="Menu"
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-background-alt transition-all"
          >
            <svg
              width="20"
              height="14"
              viewBox="0 0 21 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="21" height="1.5" rx=".75" fill="#8A7060" />
              <rect
                x="8"
                y="6"
                width="13"
                height="1.5"
                rx=".75"
                fill="#8A7060"
              />
              <rect
                x="6"
                y="13"
                width="15"
                height="1.5"
                rx=".75"
                fill="#8A7060"
              />
            </svg>
          </button>
          {open && (
            <div
              className={`absolute top-full left-0 right-0 bg-background border-t border-background-alt flex-col gap-1 px-5 pb-4 z-50 sm:hidden`}
            >
              {/* Mobile search */}
              <div className="flex items-center gap-2 border border-background-alt bg-background-alt px-3 py-2 rounded-xl mt-3 mb-1">
                <Search size={14} className="text-secondary-alt shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full text-secondary-alt placeholder:text-secondary-alt/60 font-[Inter]"
                  placeholder="Search items, dishes, ingredients…"
                />
              </div>

              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  onClick={() => {
                    setOpen(false);
                    scrollTo(0, 0);
                  }}
                  className={`bk-link`}
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}

              <div className="pt-2 mt-1 border-t border-background-alt flex gap-2">
                {!user ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowUserLogin(true);
                    }}
                    className="px-5 py-2.5 cursor-pointer flex-1 bg-primary hover:bg-[#9B3D3D] active:scale-95 transition-all text-background text-sm font-semibold rounded-xl shadow-sm"
                  >
                    Login
                  </button>
                ) : (
                  <div className="flex-1 flex flex-col gap-2">
                    <button
                      onClick={() =>
                        setShowMobileUserDropdown(!showMobileUserDropdown)
                      }
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-background-alt border border-background-alt hover:bg-background-alt/80 transition-all w-full"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User size={15} className="text-primary" />
                      </div>
                      <div className="flex flex-col leading-tight flex-1 text-left">
                        <span className="text-[10px] text-secondary-alt font-semibold uppercase tracking-wider">
                          Signed in as
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {user?.name?.split(" ")[0] || "User"}
                        </span>
                      </div>
                      <ChevronDown
                        size={14}
                        className={`text-secondary-alt transition-transform ${showMobileUserDropdown ? "rotate-180" : ""}`}
                      />
                    </button>
                    {showMobileUserDropdown && (
                      <>
                        <button
                          onClick={() => {
                            navigate("orders");
                            closeAll();
                          }}
                          className="flex items-center gap-2 px-4 py-1.5 rounded-xl border border-background-alt hover:bg-background-alt text-sm font-medium text-secondary-alt transition-all"
                        >
                          <Package size={14} />
                          My Orders
                          <ChevronRight
                            size={13}
                            className="ml-auto text-[#d8c4a6]"
                          />
                        </button>
                        <button
                          onClick={() => {
                            navigate("my-recipes");
                            closeAll();
                          }}
                          className="flex items-center gap-2 px-4 py-1.5 rounded-xl border border-background-alt hover:bg-background-alt text-sm font-medium text-secondary-alt transition-all"
                        >
                          <Package size={14} />
                          My Recipes
                          <ChevronRight
                            size={13}
                            className="ml-auto text-[#d8c4a6]"
                          />
                        </button>
                        {isSeller && (
                          <div
                            onClick={() => {
                              navigate("seller");
                              closeAll();
                            }}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-xl border border-background-alt hover:bg-background-alt text-sm font-medium text-secondary-alt transition-all"
                          >
                            <Wallpaper size={14} />
                            Dashboard
                            <ChevronRight
                              size={13}
                              className="ml-auto text-[#d8c4a6]"
                            />
                          </div>
                        )}
                        {isAdmin && (
                          <div
                            onClick={() => {
                              navigate("admin");
                              closeAll();
                            }}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-xl border border-background-alt hover:bg-background-alt text-sm font-medium text-secondary-alt transition-all"
                          >
                            <Contact size={14} />
                            Admin
                            <ChevronRight
                              size={13}
                              className="ml-auto text-[#d8c4a6]"
                            />
                          </div>
                        )}
                        <div
                          onClick={async () => {
                            if (isAdmin) await logoutAdmin();
                            else await logout();
                            closeAll();
                            toast.success("Logged Out!");
                          }}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-red-700 hover:bg-red-50 cursor-pointer transition-colors"
                        >
                          <LogOut size={14} />
                          Log Out
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
