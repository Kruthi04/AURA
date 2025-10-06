import { Link, NavLink } from "react-router-dom";
import { Home, HeartPulse, NotebookPen, Smile } from "lucide-react";

export default function Navbar() {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition";
  const inactive = "text-white/80 hover:text-white hover:bg-white/10";
  const active =
    "text-white bg-white/20 border border-white/30 shadow-sm";

  return (
    <header className="sticky top-0 z-50 bg-black pt-4">
      <nav className="mx-auto w-[95%] rounded-2xl border border-white/20 bg-black backdrop-blur-md shadow-lg">
        <div className="flex items-center justify-between px-4 py-2">
          <Link to="/" className="text-white font-semibold tracking-tight">
            PanicPal
          </Link>

          <div className="flex items-center gap-2">
            <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              <Home className="h-4 w-4" /> Home
            </NavLink>
            <NavLink to="/panic" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              <HeartPulse className="h-4 w-4" /> Panic Support
            </NavLink>
            <NavLink to="/journal" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              <NotebookPen className="h-4 w-4" /> Journal
            </NavLink>
            <NavLink to="/mood-detox" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              <Smile className="h-4 w-4" /> Mood detox
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}