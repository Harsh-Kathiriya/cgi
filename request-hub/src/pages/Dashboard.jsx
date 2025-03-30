import Navbar from "../components/Navbar";
import RequestHandler from "../components/RequestHandler";
import ParticlesBg from "../utils/ParticleBg";
import { useAuth } from "../context/AuthContext.jsx"; // Import useAuthContext

export default function Dashboard() {
  const { logout } = useAuth(); // Get the logout function from the context

  return (
    <div className="h-screen w-screen text-white flex flex-col items-center justify-center relative">
      <ParticlesBg />
      <Navbar logout={logout} /> {/* Pass the logout function to Navbar */}
      <RequestHandler />
    </div>
  );
}