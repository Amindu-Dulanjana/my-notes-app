import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2">
          <img src="/noteimg.png" alt="logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold text-blue-600">MyNotes</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Hi, <span className="font-medium">{user?.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
