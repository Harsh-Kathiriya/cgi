import { useAuth } from "../context/AuthContext";
import ParticlesBg from "../utils/ParticleBg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate instead of useHistory

export default function Landing() {
  const { login, user } = useAuth();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (user) {
      // Check if user is a manager and redirect to manager dashboard
      const managerEmails = ["harsh.socialm@gmail.com"];
      if (managerEmails.includes(user.email)) {
        navigate("/manager"); // use navigate() for redirection
      }
    }
  }, [user, navigate]); // Added navigate to the dependency array

  return (
    <div className="h-screen flex flex-col items-center justify-center text-white">
      <ParticlesBg />
      <div className="z-10 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Genie</h1>
        <p className="text-lg">Submit and manage office requests effortlessly</p>
        <button
          onClick={login}
          className="mt-6 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
