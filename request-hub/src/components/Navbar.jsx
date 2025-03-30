import { useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function Navbar({ logout }) {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  return (
    <div
      className="fixed top-0 left-0 w-full h-12 hover:h-16 transition-all duration-300"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <nav
        className={`w-full bg-[rgba(113,110,152,0.6)] py-4 px-8 flex justify-between items-center transition-all ${
          isVisible ? "opacity-100" : "opacity-80"
        }`}
      >
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex gap-6">
          <Link to="/" className={`text-white px-4 py-2 rounded-lg ${location.pathname === "/" ? "bg-gray-700" : "hover:bg-gray-600"}`}>
            Home
          </Link>
          <Link to="/snacks" className={`text-white px-4 py-2 rounded-lg ${location.pathname === "/snacks" ? "bg-gray-700" : "hover:bg-gray-600"}`}>
            Snacks
          </Link>
          <Link to="/manager" className="text-white px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all">
            Manager Access
          </Link>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-all"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
