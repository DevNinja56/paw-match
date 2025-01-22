import { Link, useNavigate } from "react-router-dom";
import { Dog, LogOut, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { logout } from "../lib/api";
import { toast } from "sonner";
import type { RootState } from "../store/store";

export function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(setUser(null));
      navigate("/login");
      toast.success("Logged out successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="bg-primary-950 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Dog className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              <span className="text-lg sm:text-xl font-bold">PawMatch</span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center gap-3 sm:gap-6">
              <Link
                to="/favorites"
                className="flex items-center gap-1 sm:gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span className="text-sm sm:text-base">
                  <span className="hidden sm:inline">Favorites </span>(
                  {favorites.length})
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 text-white/80 hover:text-white transition-colors text-sm sm:text-base"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
