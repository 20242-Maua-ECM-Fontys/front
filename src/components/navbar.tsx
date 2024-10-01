import { Link } from 'react-router-dom';

export const NavBar = () => {
  return (
    <nav className="fixed top-4 left-4 bg-gray-200 text-white rounded-full p-2 shadow-lg z-50">
      <div className="flex space-x-4 px-2">
        <Link
          to="/"
          className="transition-colors duration-300 text-gray-800 hover:text-black"
        >
          Home
        </Link>
        <Link
          to="/login"
          className="transition-colors duration-300 text-gray-800 hover:text-black"
        >
          Login
        </Link>
        <Link
          to="/app"
          className="transition-colors duration-300 text-gray-800 hover:text-black"
        >
          App
        </Link>
      </div>
    </nav>
  );
};
