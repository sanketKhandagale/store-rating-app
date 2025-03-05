import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

const Dashboard = () => {
  const [stores, setStores] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [ratings, setRatings] = useState({});
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
    } catch (err) {
      setError("Invalid session. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/stores", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStores(res.data))
      .catch(() => setError("Failed to load stores"));
  }, [navigate]);

  const handleRatingChange = (storeId, rating) => {
    setRatings({ ...ratings, [storeId]: rating });
  };

  const handleSubmitRating = (storeId) => {
    const token = localStorage.getItem("token");

    axios
      .post(
        `http://localhost:5000/api/stores/rate/${storeId}`,
        { rating: ratings[storeId] },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => alert("Rating submitted successfully!"))
      .catch(() => alert("Failed to submit rating"));
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    axios
      .post(
        "http://localhost:5000/api/auth/update-password",
        passwords,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setMessage(res.data.message))
      .catch((err) => setError(err.response?.data?.message || "Failed to update password"));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.role.toUpperCase()}</h2>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      {user?.role === "admin" && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Admin Controls</h3>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={() => navigate("/admin/manage-users")}>
            Manage Users
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2" onClick={() => navigate("/admin/manage-stores")}>
            Manage Stores
          </button>
        </div>
      )}

      {user?.role === "user" && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Available Stores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="bg-white p-4 shadow-md rounded-lg">
                <h3 className="text-lg font-bold">{store.name}</h3>
                <p className="text-gray-700">{store.address}</p>
                <p className="text-yellow-500 font-bold">⭐ {store.overallRating || "No ratings yet"}</p>

                <select className="mt-2 p-2 border rounded w-full" value={ratings[store.id] || ""} onChange={(e) => handleRatingChange(store.id, e.target.value)}>
                  <option value="">Rate This Store</option>
                  <option value="1">⭐ 1</option>
                  <option value="2">⭐ 2</option>
                  <option value="3">⭐ 3</option>
                  <option value="4">⭐ 4</option>
                  <option value="5">⭐ 5</option>
                </select>

                <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded w-full" onClick={() => handleSubmitRating(store.id)} disabled={!ratings[store.id]}>
                  Submit Rating
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <form onSubmit={handleUpdatePassword} className="mt-3">
          <input type="password" name="oldPassword" placeholder="Current Password" className="p-2 border rounded w-full mb-2" onChange={handlePasswordChange} required />
          <input type="password" name="newPassword" placeholder="New Password" className="p-2 border rounded w-full mb-2" onChange={handlePasswordChange} required />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
