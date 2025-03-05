import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/dashboard">Store Ratings</Link>
      </h1>
      <div>
        {token ? (
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-blue-500 px-4 py-2 rounded">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
