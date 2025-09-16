import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export const Navbar = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
 return (
    <nav className="bg-transparent text-white px-6 py-4 absolute top-0 left-0 right-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Title that shifts with sidebar */}
        <div
          className={`flex items-center space-x-2 transition-all duration-300 ${
            isCollapsed ? "ml-14" : "ml-64"
          }`}
        >
          <span
            className="text-xl font-bold cursor-pointer"
            onClick={() => window.location.reload()}
          >
            NajdiKola
          </span>
        </div>

        {/* Buttons stay fixed on right */}
        <div className="flex items-center space-x-3">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-gradient-card"
            onClick={() => (window.location.href = "/register")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
};