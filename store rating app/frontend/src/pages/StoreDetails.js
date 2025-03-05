import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StoreDetails = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/api/stores/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStore(res.data))
      .catch(() => setError("Failed to load store details"));

    axios
      .get(`http://localhost:5000/api/stores/${storeId}/ratings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRatings(res.data))
      .catch(() => setError("Failed to load ratings"));
  }, [storeId]);

  return (
    <div className="container mx-auto p-6">
      {error && <p className="text-red-500">{error}</p>}

      {store && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-2">{store.name}</h2>
          <p className="text-gray-600">{store.address}</p>
          <p className="text-yellow-500 font-bold text-xl mt-2">⭐ {store.Ratings?.length > 0 ? (store.Ratings.reduce((sum, r) => sum + r.rating, 0) / store.Ratings.length).toFixed(1) : "No ratings yet"}</p>

          <button onClick={() => navigate("/dashboard")} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
            Back to Dashboard
          </button>
        </div>
      )}

      <h3 className="text-2xl font-semibold mt-6">User Ratings</h3>
      {ratings.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {ratings.map((rating) => (
            <li key={rating.id} className="border p-3 rounded-lg shadow">
              <p className="text-gray-800">{rating.User.name}</p>
              <p className="text-yellow-500 font-bold">⭐ {rating.rating}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-2">No ratings yet for this store.</p>
      )}
    </div>
  );
};

export default StoreDetails;
