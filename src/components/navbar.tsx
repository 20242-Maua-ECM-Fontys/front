import { Link } from 'react-router-dom';

export const NavBar = () => {
  return (
    <nav className="fixed left-4 top-4 z-50 rounded-full bg-gray-200 p-2 text-white shadow-lg">
      <div className="flex space-x-4 px-2">
        <Link
          to="/"
          className="text-gray-800 transition-colors duration-300 hover:text-black"
        >
          Home
        </Link>
        <Link
          to="/login"
          className="text-gray-800 transition-colors duration-300 hover:text-black"
        >
          Login
        </Link>
        <Link
          to="/app"
          className="text-gray-800 transition-colors duration-300 hover:text-black"
        >
          App
        </Link>
      </div>
    </nav>
  );
};
