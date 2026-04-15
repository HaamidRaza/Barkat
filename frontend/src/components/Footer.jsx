import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bottom-0 left-0 w-full flex flex-col md:flex-row gap-1 items-center justify-around py-4 text-xs md:text-sm bg-background text-primary z-10 border-t border-primary/10">
      <p>
        Copyright © {new Date().getFullYear()}{" "}
        <b className="text-primary">Barkat</b>. All rights reservered.
      </p>
      <div className="hidden md:flex items-center text-xs md:text-sm gap-4">
        <NavLink to="#" className="hover:text-primary/80 transition-all">
          Contact Us
        </NavLink>
        <div className="h-4 w-px bg-primary/20"></div>
        <NavLink to="#" className="hover:text-primary/80 transition-all">
          Privacy Policy
        </NavLink>
        <div className="h-4 w-px bg-primary/20"></div>
        <NavLink to="#" className="hover:text-primary/80 transition-all">
          Trademark Policy
        </NavLink>
      </div>
    </footer>
  );
}
