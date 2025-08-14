import { Link, useNavigate } from 'react-router';
import { useAuth } from '../modules/auth/AuthProvider';
import { DashboardIcon } from '../uiKit/Icons.tsx';


export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          MyNotes
        </Link>

        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:bg-blue-500 px-3 py-2 rounded">
                <DashboardIcon />
              </Link>
              <Link to="/notes/create" className="hover:bg-blue-500 px-3 py-2 rounded">
                New Note
              </Link>
              <Link to="/user" className="hover:bg-blue-500 px-3 py-2 rounded">
                <span className="iconify mdi-light--account text-2xl"></span>
              </Link>
              <button
                onClick={handleLogout}
                className="hover:bg-blue-500 px-3 py-2 rounded"
              >
                <span className="iconify mdi-light--logout text-2xl"></span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:bg-blue-500 px-3 py-2 rounded">
                <span className="iconify mdi-light--login text-2xl"></span>
              </Link>
              <Link to="/register" className="hover:bg-blue-500 px-3 py-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
